import { Router } from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import postController from "./post.controller.js"
import upload from "../../middlewares/multer.middleware.js"
const router=Router()

router.get("/posts",authMiddleware,postController.getPosts)
router.post("/", authMiddleware,upload.array("media",2), postController.createPost)
// router.get("/:postId",authMiddleware,postController.getPost)
router.put("/:postId", authMiddleware,upload.array("media",2), postController.updatePost)
router.delete("/:postId", authMiddleware, postController.deletePost)
router.get("/:userId/posts",authMiddleware,postController.getUserPosts)
router.get("/:userId/post/:postId",authMiddleware,postController.getUserPost)

export default router