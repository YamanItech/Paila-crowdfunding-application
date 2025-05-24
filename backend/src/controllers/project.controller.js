import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.model.js";
import { Company } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendEmail} from "../utils/emailService.js";
import {Transaction} from "../models/paymentModel.js";
const addProject = asyncHandler(async (req, res) => {
  const {
    CompanyId,
    Category,
    project_name,
    project_description,
    fund_amount,
    start_date,
    end_date,
  } = req.body;

  // Validate required fields
  const missingFields = [
    { name: "CompanyId", value: CompanyId },
    { name: "Category", value: Category },
    { name: "Project Name", value: project_name },
    { name: "Project Description", value: project_description },
    { name: "Fund Amount", value: fund_amount },
    { name: "Start Date", value: start_date },
    { name: "End Date", value: end_date }
  ].filter(field => !field.value || field.value.toString().trim() === "");

  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.map(field => field.name).join(", ")}`);
  }

  // Validate Company ID
  const companyExists = await Company.findById(CompanyId);
  if (!companyExists) {
    throw new ApiError(404, "Company not found");
  }

  // Validate date range
  if (new Date(start_date) > new Date(end_date)) {
    throw new ApiError(400, "End date must be later than start date");
  }

  // Upload multiple images to Cloudinary
  const imageUrls = [];
  if (req.files && req.files["Image"]) {
    for (const file of req.files["Image"]) {
      const imageLocalPath = file.path;

      // Upload to Cloudinary
      const imageResponse = await uploadOnCloudinary(imageLocalPath);
      if (!imageResponse) {
        throw new ApiError(500, "Error uploading image to Cloudinary");
      }

      // Store URL
      imageUrls.push(imageResponse.url);
    }
  }

  // Create project
  const project = await Project.create({
    CompanyId,
    Category,
    project_name,
    project_description,
    fund_amount,
    start_date,
    end_date,
    Images: imageUrls, // Store uploaded images
  });

  if (!project) {
    throw new ApiError(500, "Something went wrong while creating the project");
  }

  return res.status(201).json(
    new ApiResponse(201, project, "Project created successfully")
  );
});
const getAllProjects = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search;

  const filter = searchQuery
    ? { project_name: { $regex: searchQuery, $options: "i" } }
    : {};

  const projects = await Project.find(filter)
    .populate({
      path: 'CompanyId',
      select: 'Projects',
      populate: {
        path: '_id',
        select: 'fullName description verified',
      }
    })
    .sort({ createdAt: -1 });

  if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects found");
  }

  return res.status(200).json(
    new ApiResponse(200, projects, "Projects retrieved successfully")
  );
});


const toggleProjectStatus = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate({
      path: 'CompanyId',
      populate: {
        path: '_id',
        model: 'User',
        select: 'email fullName'
      }
    });

    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    // Toggle the status
    project.status = project.status === "Active" ? "Inactive" : "Active";
    await project.save();

    // Get the company email
    const companyEmail = project.CompanyId._id.email;
    const companyName = project.CompanyId._id.fullName;
    const projectName = project.project_name;
    const projectStatus = project.status;

    // Send the email
    const subject = `Project "${projectName}" Status Updated`;
    const html = `
      <h2>Hello ${companyName},</h2>
      <p>We want to inform you that the status of your project <strong>${projectName}</strong> has changed.</p>
      <p><strong>New Status:</strong> ${projectStatus}</p>
      <p>Thank you for using <strong>Paila Crowdfunding Nepal</strong>!</p>
    `;

    await sendEmail({ to: companyEmail, subject, html });

    return res.status(200).json(new ApiResponse(200, project, "Project status updated successfully and email sent."));
  } catch (error) {
    return next(error);
  }
};

const getByCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.params; // Get category from route parameter
  const searchQuery = req.query.search; // Get search query from query parameters

  // Validate categoryName and searchQuery (optional)
  if (typeof categoryName !== 'string' || categoryName.trim().length === 0) {
    throw new ApiError(400, "Invalid category name");
  }

  if (searchQuery && typeof searchQuery !== 'string') {
    throw new ApiError(400, "Invalid search query");
  }

  // Build the query object to filter by category and optionally by project name
  const filter = { Category: categoryName };
  if (searchQuery) {
    filter.project_name = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search on project_name
  }

  // Retrieve projects and populate associated company details
  const projects = await Project.find(filter)
    .populate({
      path: 'CompanyId',
      select: 'Projects',
      populate: {
        path: '_id',
        select: 'fullName description verified',
      }
    })
    .sort({ createdAt: -1 });

  // If no projects found, throw an error
  if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects found for the given category");
  }

  // Return the list of projects with company details populated
  return res.status(200).json(
    new ApiResponse(200, projects, "Projects retrieved successfully")
  );
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params; // Assuming projectId is passed in URL params
  const { project_name, project_description } = req.body;

  // Find the existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Validate required fields
  if ((!project_name || project_name.trim() === "") &&
      (!project_description || project_description.trim() === "")) {
    throw new ApiError(400, "At least one of project_name or project_description must be provided");
  }

  // Update only the allowed fields
  if (project_name) project.project_name = project_name;
  if (project_description) project.project_description = project_description;

  // Save updated project
  await project.save();

  return res.status(200).json(
      new ApiResponse(200, project, "Project updated successfully")
  );
});

const getProjectsByCompanyId = asyncHandler(async (req, res) => {
  const { companyId } = req.params; // Assuming CompanyId is passed as a URL parameter

  // Find projects that belong to the specific CompanyId
  const projects = await Project.find({ CompanyId: companyId })
      .populate({
        path: 'CompanyId', // The company (CompanyId) reference in Project model
        select: 'Projects', // Select the reference Projects (if needed)
        populate: {
          path: '_id', // Populate the _id from Company model (which is a reference to User model)
          select: 'fullName description verified', // Select fullName and description from the User model
        }
      })
      .sort({ createdAt: -1 }); // Sort by createdAt date in descending order

  if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects found for this company");
  }

  // Return the list of projects with company details populated
  return res.status(200).json(
      new ApiResponse(200, projects, "Projects retrieved successfully")
  );
});


const getBackerFundedProjects = asyncHandler(async (req, res) => {
  const backerId = req.user._id;

  try {
    // First, let's check what's actually in the transactions
    const transactions = await Transaction.find({
      backer_id: backerId,
      status: "COMPLETED",
    })
      .lean()
      .populate({
        path: "product_id",
        select: "project_name pledged_amount CompanyId",
        populate: [
          {
            path: "CompanyId", // Populate the company information
            select: "fullName" // Fetching the company name
          },

        ]
      })
      .select("amount product_id perk"); // Fixed typo in product*id

    // Debug: Log the first transaction to see if perk exists
    if (transactions.length > 0) {
      console.log("First transaction:", JSON.stringify(transactions[0], null, 2));
    }

    // Return early with a clear message if no funded projects exist
    if (!transactions || transactions.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, [], "You haven't funded any projects yet.")
      );
    }

    // Map to the required format with proper debugging for perk
    const fundedProjects = transactions.map((tx) => {
      const project = tx.product_id || {};

      // Debug: Log the perk value
      console.log(`Transaction ID: ${tx._id}, Perk value: ${tx.perk}, Type: ${typeof tx.perk}`);

      return {
        projectId: project._id,
        projectName: project.project_name || 'Unknown Project',
        totalFunding: project.pledged_amount || 0,
        myFunding: tx.amount || 0,
        // Convert perk to string for consistency and to handle zero values properly
        perk: tx.perk !== undefined && tx.perk !== null ? tx.perk.toString() : 'No perk selected',
        currentPledgedAmount: project.pledged_amount || 0,

      };
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        fundedProjects,
        `Successfully retrieved ${fundedProjects.length} funded projects.`
      )
    );
  } catch (error) {
    console.error("Error in getBackerFundedProjects:", error);
    throw new ApiError(
      500,
      "An error occurred while retrieving your funded projects. Please try again."
    );
  }
});

export { addProject, getAllProjects ,toggleProjectStatus,getByCategory,updateProject,getProjectsByCompanyId,getBackerFundedProjects};
