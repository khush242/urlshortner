import { User } from "../model/user.model.js"
import {asyncWrapper} from "../utils/asyncWrapper.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"

export const verifyAccessToken = asyncWrapper(async (req, res, next) => {

   // console.log(req)
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

//   console.log(token)

  if (!token) {
    throw new ApiError("Unauthorized, no access token provided", 401);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError("Unauthorized, invalid or expired token", 401);
  }

  const user = await User.findById(decodedToken._id)
    .select("-password -refreshToken");

  if (!user) {
    throw new ApiError("Unauthorized, user not found", 401);
  }

  req.user = user;
  next();
});

export const verifyRefreshToken = asyncWrapper(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError("Unauthorized, no refresh token provided", 401);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError("Unauthorized, invalid or expired refresh token", 401);
  }

  const user = await User.findById(decodedToken._id)
    .select("-password -refreshToken");

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError("Unauthorized, user not found or token mismatch", 401);
  }

  req.user = user;
  next();
});
