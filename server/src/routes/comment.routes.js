import {Router} from "express";
import { createComment, deleteComment, getCommentForPin } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const router = Router()

router.route('/pin/:pinId').get(verifyJWT, getCommentForPin);    // GET comments for a pin
router.route('/pin/:pinId').post(verifyJWT, createComment);      // POST a comment on a pin
router.route('/:commentId').delete(verifyJWT, deleteComment);    // DELETE a specific comment


