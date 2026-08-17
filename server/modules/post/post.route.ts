import { Router } from "express"
import postController from "./post.controller.js"
import upload from "../../middlewares/multer.middleware.js"
import authMiddleware from "../auth/auth.middleware.js"
const router=Router()


router.post("/", authMiddleware,upload.array("media",10), postController.createPost)
router.get("/feed",authMiddleware,postController.getHomeFeed)

router.get("/:postId",authMiddleware,postController.getPost)
router.put("/:postId", authMiddleware,upload.array("media",10), postController.updatePost)
router.delete("/:postId", authMiddleware, postController.deletePost)


router.get("/:userId/posts",authMiddleware,postController.getUserPosts)
router.get("/:userId/post/:postId",authMiddleware,postController.getUserPost)

export default router