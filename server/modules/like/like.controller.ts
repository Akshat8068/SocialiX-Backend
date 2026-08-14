import type { NextFunction, Request, Response } from "express";
import postRepositoryMethods from "../post/post.repository.js";
import { fa } from "zod/locales";
import likeRepositoryMethod from "./like.repository.js";
import notificationController from "../notification/notification.controller.js";
import { NotificationType } from "../../types/types.js";


const like = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = Number(req.params.postId)

        const post = await postRepositoryMethods.findById(postId)
        if (!post) {
            return res.status(404).json({
                success: fa,
                message: "Post not found"
            })
        }
        const existLike = await likeRepositoryMethod.findLike(req.user.id, postId)
        if (existLike) {
            await likeRepositoryMethod.deleteLike(existLike.id)
            await postRepositoryMethods.decrementLikeCount(postId)

            return res.status(200).json({
                success: true,
                liked: false,
                message: "Post dislike"
            })
        }
        await likeRepositoryMethod.createLike(req.user.id, postId)
        await postRepositoryMethods.incrementLikeCount(postId)
        await notificationController.createNotification({
            recipientId: post.user.id,
            senderId: req.user.id,
            type: NotificationType.LIKE,
            postId: post.id,
            message: `${req.user.username} liked your post`
        })
        res.status(200).json({
            success: true,
            liked: true,
            message: "post like"
        })
    }
    catch (error) {
        next(error)
    }
}

const getLikedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = Number(req.params.postId)
        const users = await likeRepositoryMethod.getLikedlist(postId)
        res.status(200).json({
            success: true,
            message: "Liked user list",
            data: users
        })
    }
    catch (error) {
        next(error)
    }
}


const likeController = { like, getLikedUser }
export default likeController
