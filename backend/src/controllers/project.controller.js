import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.model.js";
import { Company } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  // Check for missing required fields
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

  // Validate start and end dates
  if (new Date(start_date) > new Date(end_date)) {
    throw new ApiError(400, "End date must be later than start date");
  }

  // Handle file upload for cover image
  let coverImageUrl = "";
  
  if (req.files && req.files.coverImage) {
    const coverImageLocalPath = req.files.coverImage[0]?.path;
    
    if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is required");
    }
    
    // Upload to Cloudinary
    const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);
    
    if (!coverImageResponse) {
      throw new ApiError(500, "Error uploading cover image to cloudinary");
    }
    
    coverImageUrl = coverImageResponse.url;
  }

  // Create the project with cover image
  const project = await Project.create({
    CompanyId,
    Category,
    project_name,
    project_description,
    fund_amount,
    start_date,
    end_date,
    coverImage: coverImageUrl
  });

  if (!project) {
    throw new ApiError(500, "Something went wrong while creating the project");
  }

  // Return the created project as a response
  return res.status(201).json(
    new ApiResponse(201, project, "Project created successfully")
  );
});

export { addProject };