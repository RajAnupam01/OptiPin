import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import {
    loginUser,
    logoutUser,
    RegisterUser,
    refreshAccessToken
} from "../controllers/auth.controller.js"

export const router = Router()

router.route("/register").post(upload.single("avatar"), RegisterUser);
router.route("/login").post(loginUser);
router.route("/update-token").get(refreshAccessToken)
router.route("/logout").post(verifyJWT, logoutUser)
