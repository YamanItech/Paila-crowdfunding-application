import { Router } from "express";
import {
    addProject,
    getAllProjects,
    getByCategory, getProjectsByCompanyId,
    toggleProjectStatus,
    updateProject
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
//secured route
router.route("/add-project").post
(
    upload.fields([
    {
        name: "Image",
        maxCount: 3
    }
]),
addProject);
router.route("/allProjects").get(getAllProjects);
router.route("/projects/status/:projectId").patch(toggleProjectStatus);
router.route("/projects/category/:categoryName").get(getByCategory);
router.route("/projects/:projectId/update").patch(updateProject);
router.route("/project/:companyId").get(getProjectsByCompanyId);
export default router;
