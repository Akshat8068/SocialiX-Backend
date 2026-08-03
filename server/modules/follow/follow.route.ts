import {Router} from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import followContoller from "./follow.controller.js"

const router =Router()

router.post("/:userId",authMiddleware,followContoller.followUser)
router.delete("/:userId",authMiddleware,followContoller.unFollowUser)

router.put("/request/:id/accept",authMiddleware,followContoller.acceptRequest)
router.put("/request/:id/reject",authMiddleware,followContoller.rejectRequest)

router.delete("/request/:id/cancel",authMiddleware,followContoller.cancleRequest)
router.delete("/remove-follower/:userId",authMiddleware,followContoller.removeFollower)

router.get("/follower/:userId",authMiddleware,followContoller.getFollowers)

router.get("/following/:userId",authMiddleware,followContoller.getFollowing)

router.get("/requests",authMiddleware,followContoller.getPendingRequest)

router.get("/sent-requests",authMiddleware,followContoller.getSentRequest)

export default router