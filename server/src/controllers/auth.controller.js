import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import User from "../models/User.model.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


export const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken(); 
        const refreshToken = user.generateRefreshToken(); 

        user.refreshToken = refreshToken; 

        await user.save({ validateBeforeSave: true });

        const sanitizedUser = user.toObject();
        delete sanitizedUser.password;
        delete sanitizedUser.refreshToken;

        return { accessToken, refreshToken, user:sanitizedUser };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh Tokens");
    }
};


 const sendTokenResponse = async (userId, res, message = "Success", statusCode = 200) => {
    const { accessToken, refreshToken,user } = await generateAccessRefreshToken(userId);
    
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(statusCode)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(statusCode, { user, accessToken, refreshToken }, message));
};


export const RegisterUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, gender } = req.body;

    
    if ([fullname, email, password, gender].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are mandatory to fill.");
    }

    const existedUser = await User.findOne({
        $or: [{ fullname: fullname.trim() }, { email: email.toLowerCase().trim() }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or fullname already exists.");
    }

    const userPayLoad = {
        fullname,
        email: email.toLowerCase(),
        password,
        gender: gender.toLowerCase(),
    };

    const avatarLocalPath = req.file?.path;
    if (avatarLocalPath) {
        const avatar = await uploadImageToCloudinary(avatarLocalPath);
        userPayLoad.avatar = avatar.url;
        userPayLoad.avatarPublicId = avatar.public_id;
    }

    const user = await User.create(userPayLoad);

    return sendTokenResponse(user._id, res, "User registered and logged in successfully", 201);
});


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password is required to login.");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect Password");
    }

    return sendTokenResponse(user._id, res, "User logged in successfully");
});


export const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: "" },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(200)
        .json(new ApiResponse(200, {}, "User logged out successfully."));
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
    
    const incomingrefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingrefreshToken) {
        throw new ApiError(401, "Unauthorized Request. Refresh Token missing.");
    }

    try {
        
        const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh Token");
        }

        if (incomingrefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used.");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access Token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error.message);
    }
});


