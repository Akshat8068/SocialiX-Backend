import type { NextFunction, Request, Response } from "express"
import cloudinaryMethod from "../../utils/cloudinary.utils.js"
import followRepositoryMethods from "../follow/follow.repository.js"
import { PostVisibility } from "../../types/types.js"
import likeRepositoryMethod from "../like/like.repository.js"
import postRepositoryMethods from "./post.repository.js"
import hashTagRepositoryMethods from "./hashtag/hashTag.repository.js"
import userRepositoryMethods from "../users/user.repository.js"


const createPost = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { caption, visibility, hashtags } = req.body
        const files = req.files as Express.Multer.File[]
        const parsedHashtags = typeof hashtags === "string" ? JSON.parse(hashtags)
            : hashtags
        const user = req.user

        const post = await postRepositoryMethods.createPost({
            caption,
            visibility,
            user,
        })
        if (files && files.length > 0) {
            for (const file of files) {
                const uploaded = await cloudinaryMethod.uploadToCloudinary(file.path)

                await postRepositoryMethods.createMedia({
                    publicId: uploaded.public_id,
                    secureUrl: uploaded.secure_url,
                    post,
                })
            }
        }


        if (parsedHashtags && parsedHashtags.length > 0) {
            const postHashTags = []

            for (const tag of parsedHashtags) {
                let hashtag = await hashTagRepositoryMethods.findByName(tag)

                if (hashtag) {
                    postHashTags.push({
                        post,
                        hashtag,
                    })
                }
            }

            if (postHashTags.length > 0) {
                await hashTagRepositoryMethods.attachHashTags(postHashTags)
            }
        }

        const createdPost = await postRepositoryMethods.findById(post.id)

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: createdPost,
        })

    } catch (error) {
        next(error)
    }
}
const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)
        const currUser = req.user

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required",
            })
        }
        const user = await userRepositoryMethods.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        const posts = await postRepositoryMethods.getUserPosts(userId)
        for (const post of posts) {

            if (post.user.id !== currUser.id) {
                switch (post.visibility) {
                    case PostVisibility.PUBLIC:
                        break;

                    case PostVisibility.FOLLOWERS: {
                        const isFollower = await followRepositoryMethods.isFollowing(
                            currUser.id,
                            post.user.id
                        );

                        if (!isFollower) {
                            return res.status(403).json({
                                success: false,
                                message: "This post is only visible to followers",
                            });
                        }
                        break;
                    }
                    case PostVisibility.FRIENDS: {break;}


                    default:
                        return res.status(400).json({
                            success: false,
                            message: "Invalid post visibility",
                        })
                }
            }
        }
        const postIds = posts.map((post) => post.id);

        const likedPostIds = await likeRepositoryMethod.findLikedPostIds(
            currUser.id,
            postIds
        );

        const data = posts.map((post) => ({
            ...post,
            isLiked: likedPostIds.includes(post.id),
        }));
        return res.status(200).json({
            success: true,
            message: "User posts fetched successfully",
            data: data
        })
    } catch (error) {
        next(error)
    }

}
const getUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)
        const postId = Number(req.params.postId)
        const currUser = req.user.id

        if (!userId || !postId) {
            return res.status(400).json({
                success: false,
                message: "User id and Post id are required",
            })
        }


        const user = await userRepositoryMethods.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        const post = await postRepositoryMethods.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }
        if (post.user.id !== userId) {
            return res.status(404).json({
                success: false,
                message: "Post does not belong to this user",
            })
        }



        if (post.user.id !== currUser) {
            switch (post.visibility) {
                case PostVisibility.PUBLIC:
                    break;

                case PostVisibility.FOLLOWERS: {
                    const isFollower = await followRepositoryMethods.isFollowing(
                        currUser,
                        post.user.id
                    );

                    if (!isFollower) {
                        return res.status(403).json({
                            success: false,
                            message: "This post is only visible to followers",
                        });
                    }
                    break;
                }

                default:
                    return res.status(400).json({
                        success: false,
                        message: "Invalid post visibility",
                    })
            }
        }

        const liked = await likeRepositoryMethod.findLike(currUser, post.id);

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: {
                ...post,
                isLiked: !!liked,
            },
        });
    } catch (error) {
        next(error)
    }
}
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = Number(req.params.postId)
        const userId = req.user.id
        const post = await postRepositoryMethods.findById(postId)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }
        if (post.user.id !== userId) {
            switch (post.visibility) {
                case PostVisibility.PUBLIC:
                    break;

                case PostVisibility.FOLLOWERS: {
                    const isFollower = await followRepositoryMethods.isFollowing(
                        userId,
                        post.user.id
                    );

                    if (!isFollower) {
                        return res.status(403).json({
                            success: false,
                            message: "This post is only visible to followers",
                        });
                    }
                    break;
                }
                default:
                    return res.status(400).json({
                        success: false,
                        message: "Invalid post visibility",
                    })
            }
        }
        const liked = await likeRepositoryMethod.findLike(userId, post.id)
        return res.status(200).json({
            success: true,
            message: "Post found",
            data: {
                ...post,
                isLiked: !!liked,
            }
        })
    } catch (error) {
        next(error)
    }
}
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = Number(req.params.postId)
        const userId = req.user.id

        const { caption, visibility, hashtags } = req.body

        const post = await postRepositoryMethods.findById(postId)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }
        if (post.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this post",
            })
        }
        if (caption !== undefined) {
            post.caption = caption.trim() || null
        }
        if (visibility !== undefined) {
            post.visibility = visibility
        }
        if (hashtags !== undefined) {
            const hashtagIds: number[] =
                typeof hashtags === "string"
                    ? JSON.parse(hashtags)
                    : hashtags
            await hashTagRepositoryMethods.deleteByPostId(postId)
            const hashtagList = await hashTagRepositoryMethods.findByIds(hashtagIds)

            const postHashtags = hashtagList.map((hashtag) => ({
                post,
                hashtag,
            }))


            if (postHashtags.length > 0) {
                await hashTagRepositoryMethods.attachHashTags(postHashtags)
            }
        }

        const updatedPost = await postRepositoryMethods.updatePost(post)

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        })
    } catch (error) {
        next(error)
    }
}
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = Number(req.params.postId)
        const userId = req.user.id

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post id is required"
            })
        }

        const post = await postRepositoryMethods.findById(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }

        if (post.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this post",
            })
        }

        const medias = await postRepositoryMethods.findByPostId(postId)

        for (const media of medias) {
            await cloudinaryMethod.deleteFromCloudinary(media.publicId)
        }

        await postRepositoryMethods.deleteByPostId(postId)

        await hashTagRepositoryMethods.deleteByPostId(postId)

        await postRepositoryMethods.deletePost(postId)

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        })
    } catch (error) {
        next(error)
    }
}
const getHomeFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.user.id

        const following = await followRepositoryMethods.getFollowing(currentUserId)

        if (following.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No posts found",
                data: []
            })
        }
        const posts = await postRepositoryMethods.getHomeFeed(req.user.id)
        const postIds = posts.map((post) => post.id);

        const likedPostIds = await likeRepositoryMethod.findLikedPostIds(
            currentUserId,
            postIds
        );

        const data = posts.map((post) => ({
            ...post,
            isLiked: likedPostIds.includes(post.id),
        }));

        return res.status(200).json({
            success: true,
            message: "Home feed fetched successfully",
            data: data
        })
    } catch (error) {
        next(error)
    }
}


const postController = { createPost, getHomeFeed,   getUserPosts, updatePost, getUserPost, getPost, deletePost }
export default postController