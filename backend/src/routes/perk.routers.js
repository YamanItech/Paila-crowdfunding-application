import { Router } from "express";
import { addPerk, getPerkByProjectId } from "../controllers/perk.controller.js";
const router = Router();
router.route("/addPerk").post(addPerk);
router.route("/perk/:projectId").get(getPerkByProjectId);
router.route("/perk/:perkId/project").get(getPerkByProjectId);
export default router;
