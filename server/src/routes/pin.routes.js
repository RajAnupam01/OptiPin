import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPin, deletePin, getAllPins, getOnePin, getPins, toggleLikePin, updatePin } from "../controllers/pin.controller.js";

export const router = Router();

router.route("/all").get(verifyJWT, getAllPins);
router.route("/single/:id").get(verifyJWT, getOnePin);
router.route("/category").get(verifyJWT, getPins);
router.route("/create").post(verifyJWT, upload.single('image'), createPin);
router.route("/edit/:id").patch(verifyJWT, updatePin);           // ✅ Fixed
router.route("/:id/like").patch(verifyJWT, toggleLikePin);
router.route("/rm-pin/:id").delete(verifyJWT, deletePin);        // ✅ Fixed



