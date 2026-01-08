import {User}  from "../model/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import {asyncWrapper} from "../utils/asyncWrapper.js"
import { Response } from "../utils/Response.js";

const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken =await user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = asyncWrapper(async (req , res) => {
    const {email, password , fullName} = req.body;

    if([email,password ,fullName].some(field => field.trim() === "")){
        throw new ApiError("All fieled must required", 400)
    }
    
    const userExist = await User.findOne({email})

    if (userExist) {
        throw new ApiError("User already exist with this email", 400)
    }
    
    const user = await User.create({
        email:email,
        fullName:fullName,
        password:password
    })

    if (!user) {
        throw new ApiError("User registration failed", 500)
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    res.status(201).json(
        new Response(201,createdUser,"User created successfully")
    )
})

export const loginUser = asyncWrapper(async(req,res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new ApiError("Both email and password required", 400);
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError("User not found", 404)
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError("Incorrect password", 401)
    }
    
    const {accessToken, refreshToken} = await generateTokens(user._id)
    
   const options = {
     httpOnly: true,
     secure: true,
     sameSite: "none"
   };

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    res.status(201)
    .cookie('accessToken', accessToken ,options)
    .cookie("refreshToken", refreshToken, options)
    .json(new Response(
        200, loggedInUser,"Login successfully"
    ))
})

export const logoutUser = asyncWrapper(async(req , res) => {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId,{
      $unset : {
        refreshToken:1
      }},
      {
        new: true
      }
    )
    
    const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
    };

    res.status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken", options)
    .json(
        new Response(200,{},"User Logged out successfully")
    )
})

export const getCurrUser = asyncWrapper( async(req , res) => {
    const userId = req.user._id
    if (!userId) {
        throw new ApiError("UserId not found", 400)
    }
    const user = await User.findById(userId).select("-password -refreshToken")

    if (!user) {
        throw new ApiError("User not found", 404)
    }
    res.status(200).json(
        new Response(200, user, "User profile retrieved successfully")
    )
})

export const refreshTokens = asyncWrapper( async(req , res) => {
    const {refreshToken} = req.cookies;

    if (!refreshToken) {
        throw new ApiError("Refresh token not found", 401)
    }

    const user = await User.findOne({refreshToken})

    if (!user) {
        throw new ApiError("Invalid refresh token", 403)
    }

    const tokens = await generateTokens(user._id)

    res.status(200)
    .cookie("accessToken", tokens.accessToken , {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    .cookie("refreshToken", tokens.refreshToken , {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    .json(
        new Response(200, {}, "Tokens refreshed successfully")
    )
})