import type { NextFunction, Request, Response } from "express";
import postRepositoryMethods from "../post/post.repository.js";
import commentRepositoryMethod from "./comment.repository.js";
import { NotificationType, type CommentNode } from "../../types/types.js";
import notificationController from "../notification/notification.controller.js";



const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = Number(req.params.postId)
        const { content } = req.body
        const post = await postRepositoryMethods.findById(postId)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required.",
            })
        }
        const comment = await commentRepositoryMethod.createComment({
            content,
            user: { id: req.user.id },
            post: { id: postId },
            parentComment: null
        })
        await postRepositoryMethods.incrementCommentCount(postId)
        await notificationController.createNotification({
            recipientId: post.user.id,
            senderId: req.user.id,
            type: NotificationType.COMMENT,
            postId: post.id,
            commentId: comment.id,
            message: `${req.user.username}commented on your post`,
        })
        return res.status(201).json({
            success: true,
            message: "Comment added Successfully",
            data: comment
        })
    }
    catch (error) {
        next(error)
    }
}
const replyComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parentCommentId = Number(req.params.commentId)
        const { content } = req.body

        const parentComment = await commentRepositoryMethod.findCommnetById(parentCommentId)
        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply content is required.",
            })
        }
        const reply = await commentRepositoryMethod.createComment({
            content,
            user: { id: req.user.id },
            post: { id: parentComment.post.id },
            parentComment: { id: parentCommentId }
        })
        await postRepositoryMethods.incrementCommentCount(parentComment.post?.id)
        await notificationController.createNotification({
            recipientId: parentComment.user.id,
            senderId: req.user.id,
            type: NotificationType.COMMENT,
            postId: parentComment.post.id,
            commentId: reply.id,
            message: `${req.user.username}lied to your comment`
        })
        return res.status(201).json({
            success: true,
            message: "Reply added",
            data: reply
        })
    }
    catch (error) {
        next(error)
    }
}
const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = Number(req.params.commentId)
        const { content } = req.body

        const comment = await commentRepositoryMethod.findCommnetById(commentId)
        if (!comment) {
            return res.status(404).json({
                success: true,
                message: "Comment not found"
            })
        }
        if (comment.user.id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to updae the comment"
            })
        }
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required.",
            })
        }
        comment.content = content.trim()
        const updatedComment = await commentRepositoryMethod.updateComment(comment)

        return res.status(200).json({
            success: true,
            message: "comment updated sucessfully",
            data: updatedComment
        })
    }
    catch (error) {
        next(error)
    }
}

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentID = Number(req.params.commentId)
        const comment = await commentRepositoryMethod.findCommnetById(commentID)
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }
        if (comment.user.id !== req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to delete the comment"
            })
        }
        await commentRepositoryMethod.deleteComment(commentID)
        await postRepositoryMethods.decrementCommentCount(comment.post.id)
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        })
    }
    catch (error) {
        next(error)
    }
}

const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postID = Number(req.params.postId)
        const post = await postRepositoryMethods.findById(postID)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        const comments = await commentRepositoryMethod.getPostComments(postID)
        const commentMap = new Map<number, CommentNode>()
        comments.forEach((comment) => {
            commentMap.set(comment.id, {
                ...comment,
                replies: []
            })

        })
        const nestedComment: CommentNode[] = []
        comments?.forEach((Comment) => {
            const currentComment = commentMap.get(Comment.id)!
            if (Comment.parentComment) {
                const parentComment = commentMap.get(Comment.parentComment.id)
                if (parentComment) {
                    parentComment.replies.push(currentComment)
                }
            } else {
                nestedComment.push(currentComment)
            }
        })
        return res.status(200).json({
            success: true,
            commentCount: post.commentCount,
            data: nestedComment
        })
    }
    catch (error) {
        next(error)
    }
}
const commentController = { getPostComments, updateComment, deleteComment, createComment, replyComment }
export default commentController