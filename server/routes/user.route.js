import { Router } from "express";
import {verifyAccessToken,verifyRefreshToken} from '../middlewares/auth.middleware.js'
import { getCurrUser, loginUser, logoutUser, registerUser , refreshTokens} from "../controllers/auth.controller.js";
const router = Router()

router.route("/me").get(verifyAccessToken,getCurrUser)
router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyAccessToken,logoutUser)
router.route("/refresh-token").post(verifyRefreshToken,refreshTokens)

export default router