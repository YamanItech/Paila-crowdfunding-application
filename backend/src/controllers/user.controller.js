import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {Backer} from "../models/backer.model.js"
import {Company} from "../models/company.model.js";
import {Admin} from "../models/admin.model.js";
import {sendEmail} from "../utils/emailService.js";
import { upload } from "../middlewares/multer.middleware.js";

const generateAccessAndRefreshTokens = async(userId) =>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken, refreshToken}


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  const {fullName, email, password, role, description} = req.body

  // Validation - not empty
  if ([fullName, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Required fields cannot be empty")
  }

  // Check if user already exists: email
  const existedUser = await User.findOne({ email })

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists")
  }

  // Handle avatar upload to Cloudinary if file is present
  let avatarUrl = null;
  if (req.files && req.files["avatar"]) {
    const avatarLocalPath = req.files["avatar"][0].path;

    // Upload to Cloudinary
    const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarResponse) {
      throw new ApiError(500, "Error uploading avatar to Cloudinary");
    }

    // Get the URL
    avatarUrl = avatarResponse.url;
  }

  // Create user object - create entry in db
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    description,
    avatar: avatarUrl // Set avatar URL (null if no file uploaded)
  })

  // Create corresponding role-based entry
  if (user.role === "backer") {
    await Backer.create({ _id: user._id });
  } else if (user.role === "admin") {
    await Admin.create({ _id: user._id });
  } else {
    await Company.create({ _id: user._id });
  }

  // Remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
})

const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, password} = req.body
  console.log(email);

  if (!email) {
    throw new ApiError(400, "Email is required")
  }

  // Here is an alternative of above code based on logiciscussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{email}]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const getRoleByMail = asyncHandler(async (req, res) => {
  // Query the user and exclude the password field in the projection
  const user = await User.findOne({ email: req.user.email }).select('-password'); 

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Return the user's role
  return res.status(200).json({
    status: "success",
    role: user.role,
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")

    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

// const changeCurrentPassword = asyncHandler(async(req, res) => {
//   const {oldPassword, newPassword} = req.body
//
//
//
//   const user = await User.findById(req.user?._id)
//   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
//
//   if (!isPasswordCorrect) {
//     throw new ApiError(400, "Invalid old password")
//   }
//
//   user.password = newPassword
//   await user.save({validateBeforeSave: false})
//
//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Password changed successfully"))
// })
//
const changeCurrentPassword = asyncHandler(async(req, res) => {
  const { oldPassword, newPassword, userId } = req.body;
  // Or get the userId from a token in the request
  // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // const userId = decodedToken?._id;

  if(!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId);

  if(!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  // Check if new password is the same as old password
  if(oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be the same as your current password");
  }

  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const getCurrentUser = asyncHandler(async(req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullName, email} = req.body

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email
      }
    },
    {new: true}

  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});
// Controller to handle KYC update using user ID in the URL
const updateKYC = asyncHandler(async (req, res) => {
  // Check if user exists
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Handle KYC image upload
  if (!req.file) {
    return res.status(400).json({ message: "No KYC image uploaded" });
  }

  const kycResponse = await uploadOnCloudinary(req.file.path);
  if (!kycResponse || !kycResponse.url) {
    return res.status(500).json({ message: "Error uploading KYC image to Cloudinary" });
  }

  // Extract all form data except the file
  const formData = {
    fullName: req.body.fullName,
    gender: req.body.gender,
    dob: req.body.dob,
    citizenshipNumber: req.body.citizenshipNumber,
    citizenshipIssueDistrict: req.body.citizenshipIssueDistrict,
    citizenshipIssueDate: req.body.citizenshipIssueDate,
    province: req.body.province,
    district: req.body.district,
    address: req.body.address,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    occupation: req.body.occupation
  };

  // Update user's KYC field with all data and image URL
  user.kyc = {
    data: formData,
    url: kycResponse.url,
    status: 'pending'
  };

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        kycUrl: kycResponse.url,
        status: 'pending'
      },
      "KYC submitted successfully and pending review"
    )
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const userId = req.user?._id; // ✅ Comes from verified JWT middleware

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});


const getCompanyDetails = asyncHandler(async (req, res) => {
  const { company_id } = req.params;  // Get the company_id from URL parameters

  // Find the company and populate the associated user (company owner)
  const company = await Company.findById(company_id).populate({
    path: "_id", // This will populate the referenced User document (company owner)
    select: "fullName description" // Only select fullName and description fields from User
  });

  if (!company) {
    res.status(404).json({ message: "Company not found" });
    return;
  }

  // Return the company name (fullName) and description from the populated User
  res.json({
    companyName: company._id.fullName,  // fullName from populated user data
    description: company._id.description,  // description from populated user data
  });
});
const getAllBackers = asyncHandler(async (req, res) => {
  const backers = await User.find({ role: "backer" }).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, backers, "All Backers")
  );
});
const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await User.find({ role: "company" }).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, companies, "All Companies")
  );
});

const updateUserVerification = asyncHandler(async (req, res) => {
  const { userId, verified } = req.body;

  if (typeof verified !== "boolean") {
    return res.status(400).json(
      new ApiResponse(400, null, "`verified` must be true or false")
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { verified },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, "User not found")
    );
  }

  // Prepare email notification
  const subject = verified
    ? "Your account has been verified"
    : "Your account verification has been revoked";

  const html = `
    <h2>Hello ${user.fullName || "User"},</h2>
    <p>Your account verification status has been updated.</p>
    <p><strong>New Verification Status:</strong> ${verified ? "Verified " : "Not Verified "}</p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Thank you,<br><strong>Paila Crowdfunding Nepal</strong></p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject,
      html,
    });
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    // Optionally still continue response even if email fails
  }

  return res.status(200).json(
    new ApiResponse(200, user, `User verification updated to ${verified} and notification email sent.`)
  );
});


export default updateUserVerification;

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});


export { getUserProfile };


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getRoleByMail,getCompanyDetails,
  getAllBackers,
  getAllCompanies,
  updateKYC
}