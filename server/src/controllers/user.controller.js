import Pin from "../models/Pin.model.js";
import User from "../models/User.model.js";
import {Comment} from "../models/Comment.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/cloudinary.js";
;

export const getMyProfile = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(401, "user not found.")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "current user fetched successfully.")
        )
})

export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("followers", "fullname avatar")
        .populate("following", "fullname avatar");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User profile fetched successfully.")
        );
});

export const updateMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { fullname, email, gender } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.")
    }

    if (fullname && fullname !== user.fullname) {
        const fullnameExists = await User.findOne({ fullname });
        if (fullnameExists && fullnameExists._id.toString() !== userId.toString()) {
            throw new ApiError(409, "Fullname is already taken.");
        }
        user.fullname = fullname;
    }

    if (email && email.toLowerCase() !== user.email) {
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists && emailExists._id.toString() !== userId.toString()) {
            throw new ApiError(409, "Email is already in use.");
        }
        user.email = email.toLowerCase();
    }


    if (gender) user.gender = gender.toLowerCase();;

    const avatarLocalPath = req.file?.path;

    if (avatarLocalPath) {
        if (user.avatarPublicId) {
            try {
                await deleteImageFromCloudinary(user.avatarPublicId)
            } catch (error) {
                throw new ApiError(500, "failed to delete old avatar.")
            }
        }
        const uploaded = await uploadImageToCloudinary(avatarLocalPath);
        user.avatar = uploaded.url;
        user.avatarPublicId = uploaded.public_id
    }


    await user.save({ validateBeforeSave: true });

    const updatedUser = await User.findById(userId).select("-password -refreshToken").lean();

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "User updated successfully.")
        )

})

export const DeleteProfilePicture = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (!user.avatarPublicId) {
        throw new ApiError(400, "No profile image to delete.");
    }

    await deleteImageFromCloudinary(user.avatarPublicId);

    await User.findByIdAndUpdate(user, {
        $unset: { avatar: 1, avatarPublicId: 1 }
    });

    return res.status(200).json(
        new ApiResponse(200, "Profile image deleted successfully.")
    );
});

export const toggleFollowUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    if (currentUserId.toString() === targetUserId) {
        throw new ApiError(400, "You cannot follow/unfollow yourself.")
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
        throw new ApiError(404, "User does not exist to follow/unfollow")
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);
    }
    else {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
    }

    await currentUser.save({ validateBeforeSave: true })
    await targetUser.save({ validateBeforeSave: true })

    return res
        .status(200)
        .json(
            new ApiResponse(200, isFollowing ? "User unfollowed" : "User followed.")
        )
})

export const toggleSavePin = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const pinId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const pin = await Pin.findById(pinId);
    if (!pin) {
        throw new ApiError(404, "Pin not found.")
    }
    const isSaved = user.saved.includes(pinId);
    if (isSaved) {
        user.saved.pull(pinId);
        pin.savedBy.pull(userId);
    }
    else {
        user.saved.push(pinId);
        pin.savedBy.push(userId);
    }
    await user.save({ validateBeforeSave: true });
    await pin.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(
            new ApiResponse(200, isSaved ? 'Pin unSaved' : 'Pin saved')
        )
})

export const getSavedPins = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const savedPinIds = user.saved;

    const savedPins = await Pin.find({ _id: { $in: savedPinIds } });

    return res.status(200).json(
        new ApiResponse(200, savedPins, "Saved pins fetched successfully")
    );
});



export const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete avatar from Cloudinary
    if (user.avatarPublicId) {
      await deleteImageFromCloudinary(user.avatarPublicId);
    }

    // Fetch user's pins using `owner`
    const userPins = await Pin.find({ owner: userId });

    // Delete each pin image from Cloudinary
    for (const pin of userPins) {
      if (pin.imagePublicID) {
        await deleteImageFromCloudinary(pin.imagePublicID);
      }
    }

    // Delete all pins created by the user
    await Pin.deleteMany({ owner: userId });

    // Delete all comments made by the user
    await Comment.deleteMany({ user: userId });

    // Remove likes made by the user on other pins
    await Pin.updateMany({}, { $pull: { likes: userId } });

    // Remove this user from other users' followers and following lists
    await User.updateMany({}, {
      $pull: {
        followers: userId,
        following: userId
      }
    });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Your profile and all associated data have been deleted.",
    });

  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Failed to delete profile." });
  }
};










