import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Pin from "../models/Pin.model.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createPin = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
        throw new ApiError(400, "Please enter the necessary details to create pins.");
    }

    const buffer = req.file?.buffer;

    if (!buffer) {
        throw new ApiError(400, "Image field is necessary to create pins.");
    }

    const image = await uploadImageToCloudinary(buffer);

    if (!image) {
        throw new ApiError(500, "Failed to upload image.");
    }

    const pin = await Pin.create({
        title,
        description,
        category,
        owner: req.user.id,
        image: image.url,
        imagePublicID: image.public_id,
    });

    return res.status(201).json(
        new ApiResponse(201, pin, "Pin created successfully")
    );
});

export const getAllPins = asyncHandler(async (req, res) => {
    const pins = await Pin.find()
        .populate("owner", "fullname avatar")
        .sort({ createdAt: -1 });

    if (!pins || pins.length === 0) {
        throw new ApiError(404, "No Pins exist.");
    }

    return res.status(200).json(
        new ApiResponse(200, pins, "All pins fetched successfully.")
    );
});

export const getOnePin = asyncHandler(async (req, res) => {
    const pinId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pinId)) {
        throw new ApiError(400, "Invalid pin ID.");
    }

    const pin = await Pin.findById(pinId)
        .populate("owner", "avatar fullname followers")
        .populate("comments.user", "avatar username");

    if (!pin) {
        throw new ApiError(404, "No such pin exists.");
    }

    return res.status(200).json(
        new ApiResponse(200, pin, "Single pin fetched successfully.")
    );
});

export const getPins = asyncHandler(async (req, res) => {
    const { category } = req.query;

    if (!category) {
        throw new ApiError(400, "Category is required.");
    }

    const categoryPins = await Pin.find({
        category: { $regex: new RegExp(category, "i") }
    }).sort({ createdAt: -1 });

    if (categoryPins.length === 0) {
        throw new ApiError(404, "No pins found in this category.");
    }

    return res.status(200).json(
        new ApiResponse(200, categoryPins, "Pins in category fetched successfully.")
    );
});

export const toggleLikePin = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const targetPinId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetPinId)) {
        throw new ApiError(400, "Invalid pin ID.");
    }

    const targetPin = await Pin.findById(targetPinId);
    if (!targetPin) {
        throw new ApiError(404, "No such pin exists to like/unlike");
    }

    const isLiked = targetPin.likes.includes(currentUserId);

    if (isLiked) {
        targetPin.likes.pull(currentUserId);
    } else {
        targetPin.likes.push(currentUserId);
    }

    await targetPin.save({ validateBeforeSave: true });

    return res.status(200).json(
        new ApiResponse(200, {
            liked: !isLiked,
            totalLikes: targetPin.likes.length
        }, isLiked ? "Unliked the pin" : "Liked the pin")
    );
});

export const updatePin = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const pinId = req.params.id;

    if (!title || !description) {
        throw new ApiError(400, "Please fill all details to update.");
    }

    if (!mongoose.Types.ObjectId.isValid(pinId)) {
        throw new ApiError(400, "Invalid pin ID.");
    }

    const pin = await Pin.findById(pinId);
    if (!pin) {
        throw new ApiError(404, "No such pin exists to update.");
    }

    if (pin.owner.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "You are not authorized to update this pin.");
    }

    pin.title = title;
    pin.description = description;

    await pin.save({ validateBeforeSave: true });

    return res.status(200).json(
        new ApiResponse(200, pin, "Pin updated successfully.")
    );
});

export const deletePin = asyncHandler(async (req, res) => {
    const pinId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pinId)) {
        throw new ApiError(400, "Invalid pin ID.");
    }

    const pin = await Pin.findById(pinId);
    if (!pin) {
        throw new ApiError(404, "Pin not found.");
    }

    if (pin.owner.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this pin.");
    }

    if (pin.imagePublicID) {
        await deleteImageFromCloudinary(pin.imagePublicID);
    }

    await pin.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Pin deleted successfully.")
    );
});

