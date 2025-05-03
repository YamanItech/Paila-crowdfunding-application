import { Router } from "express";
import updateUserVerification, {
  changeCurrentPassword, getAllBackers, getAllCompanies,
  getCompanyDetails,
  getCurrentUser,
  getRoleByMail,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  // upload.fields([
  //   {
  //     name: "avatar",
  //     maxCount: 1,
  //   },
  //   {
  //     name: "coverImage",
  //     maxCount: 1,
  //   },
  // ]),
 registerUser
);

router.route("/getAllBackers").get(getAllBackers);
router.route("/getAllCompanies").get(getAllCompanies);

router.put("/verify",updateUserVerification);
router.route("/login").post(loginUser);
router.route("/company/:company_id").get(getCompanyDetails);
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post( changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/role").get(verifyJWT, getRoleByMail);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
