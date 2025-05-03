import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.model.js";
import { Company } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {sendEmail} from "../utils/emailService.js"
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
  // Retrieve all projects and populate the associated company details (via User model)
  const projects = await Project.find()
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
    throw new ApiError(404, "No projects found");
  }

  // Return the list of projects with company details populated
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

  // Build the query object to filter by category
  const query = { Category: categoryName };

  // Retrieve projects and populate associated company details
  const projects = await Project.find(query)
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

export { addProject, getAllProjects ,toggleProjectStatus,getByCategory,updateProject,getProjectsByCompanyId};
