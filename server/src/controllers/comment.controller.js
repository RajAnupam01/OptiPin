import {Comment} from "../models/Comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js";


export const createComment = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    const {pinId} = req.params;
    if(!content){
        throw new ApiError(400,"Comment content is required.")
    }
    const comment = await Comment.create({
        content,
        user:req.user._id,
        pin:pinId,
    })
    res.status(201).json(
        new ApiResponse(200,comment,"comment created successfully.")
    )
})

export const getCommentForPin = asyncHandler(async(req,res)=>{
    const {pinId} = req.params;
    const comments = await Comment.find({pin:pinId})
    .populate("user","avatar fullname")
    .sort({createdAt:-1});

    res.status(200).json(
        new ApiResponse(200,comments)
    )
})

export const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404,"Comment not found.")
    }
    if(comment.user.toString() !== userId.toString()){
        throw new ApiError(403,"you are not authorized to delete this comment.")
    }
    await comment.deleteOne()

    res.status(200).json(
        new ApiResponse(200,"Comment deleted successfully.")
    )
})