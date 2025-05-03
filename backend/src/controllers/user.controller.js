import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {Backer} from "../models/backer.model.js"
import {Company} from "../models/company.model.js";
import {Admin} from "../models/admin.model.js";

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

const registerUser = asyncHandler( async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res


  const {fullName, email, password,role,description } = req.body
  //console.log("email: ", email);

  if (
    [fullName, email,password,role,description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [ { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }
  //console.log(req.files);

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required")
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required")
  // }


  const user = await User.create({
    fullName,
    // avatar: avatar.url,
    email:email,
    password,
    role,
    description
  })
  // "admin", "backer", "company"
  if (user.role === "backer") {
    await Backer.create({ _id: user._id });
  }
  else if(user.role ==="admin"){
    await Admin.create({ _id: user._id });
  }
  else{
    await Company.create({ _id: user._id });
  }
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )

} )

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

const updateUserAvatar = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
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

  return res.status(200).json(
    new ApiResponse(200, user, `User verification updated to ${verified}`)
  );
});

export default updateUserVerification;




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
  getAllCompanies
}