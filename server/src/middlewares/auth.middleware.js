import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");


            if(!token){
                throw new ApiError(401,"Unauthorized request");
            }

            const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded?._id).select("-password -refreshToken")

            req.user = user;

            next()

    } catch (error) {
        throw new ApiError(401,error.message || "Invalid Access Token")
    }
})

