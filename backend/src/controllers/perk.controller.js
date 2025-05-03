import { asyncHandler } from "../utils/asyncHandler.js"; // A utility for handling async functions with error handling
import { ApiError } from "../utils/ApiError.js"; // Custom error handler
import { ApiResponse } from "../utils/ApiResponse.js"; // Custom response handler
import { Perk } from "../models/perk.model.js"; // Perk model

// Controller to add a perk for a project
const addPerk = asyncHandler(async (req, res) => {
  const {
    projectId,
    benefit1,
    benefit2,
    benefit3
  } = req.body;

  // Validate required fields
  const missingFields = [
    { name: "Project ID", value: projectId },
    { name: "Benefit 1", value: benefit1 },
    { name: "Benefit 2", value: benefit2 },
    { name: "Benefit 3", value: benefit3 }
  ].filter(field => !field.value || (Array.isArray(field.value) && field.value.length === 0));

  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.map(field => field.name).join(", ")}`);
  }

  // Create perk
  const perk = await Perk.create({
    projectId,
    benefit1,
    benefit2,
    benefit3
  });

  if (!perk) {
    throw new ApiError(500, "Something went wrong while creating the perk");
  }

  return res.status(201).json(
    new ApiResponse(201, perk, "Perk created successfully")
  );
});
// Controller to get a perk by its projectId
const getPerkByProjectId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;  // Extract projectId from URL parameters

  // Find the perk associated with the given projectId
  const perk = await Perk.findOne({ projectId });

  if (!perk) {
    // If perk is not found, throw a 404 error
    throw new ApiError(404, "Perk not found for the given projectId");
  }

  // Return the perk details if found
  return res.status(200).json(
    new ApiResponse(200, perk, "Perk fetched successfully")
  );
});

const getProjectIdByPerkId = asyncHandler(async (req, res) => {
  const { perkId } = req.params; // Extract perkId from URL parameters

  // Find the perk document by its ID
  const perk = await Perk.findById(perkId);

  if (!perk) {
    throw new ApiError(404, "Perk not found with the given ID");
  }

  // Get projectId from the found perk
  const projectId = perk.projectId;

  return res.status(200).json(
    new ApiResponse(200, { projectId }, "Project ID fetched successfully")
  );
});

export { addPerk,getPerkByProjectId,getProjectIdByPerkId}