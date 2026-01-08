import {Router }from "express"
import { verifyAccessToken } from "../middlewares/auth.middleware.js"
import {deleteUrl, getUrlAnalytics, getUserUrls, redirectToOriginalUrl, registerUrl, toggleUrlStatus} from "../controllers/url.controller.js"

const router = Router()


router.route("/").get(verifyAccessToken, getUserUrls).post(verifyAccessToken, registerUrl)
router.route("/:id/analytics").get(verifyAccessToken, getUrlAnalytics)
router.route("/:id/status").post(verifyAccessToken, toggleUrlStatus)
router.route("/:shortCode").post(verifyAccessToken, deleteUrl).get(redirectToOriginalUrl)


export default router