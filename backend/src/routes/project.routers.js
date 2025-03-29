import { Router } from "express";
import { addProject } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
//secured route
router.route("/add-project").post
(
    upload.fields([
    {
        name: "coverImage",
        maxCount: 1
    }
]),
addProject);


export default router;
