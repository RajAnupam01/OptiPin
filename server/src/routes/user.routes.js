import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    DeleteProfilePicture,
    getMyProfile,
    getSavedPins,
    toggleFollowUser,
    toggleSavePin,
    updateMyProfile,
    getProfile,
    deleteMyProfile
} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

export const router = Router()

router.route("/me").get(verifyJWT, getMyProfile)
router.get("/:id/profile", verifyJWT, getProfile);
router.route("/saved-pins").get(verifyJWT,getSavedPins)
router.route("/:id/follow").patch(verifyJWT, toggleFollowUser)
router.route("/:id/savepin").patch(verifyJWT,toggleSavePin)
router.route("/update-me").patch(verifyJWT,upload.single('avatar'), updateMyProfile)
router.route("/rm-profile").delete(verifyJWT,DeleteProfilePicture)
router.route("/remove-me").delete(verifyJWT,deleteMyProfile)







