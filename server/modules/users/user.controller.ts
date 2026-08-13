import type { NextFunction, Request, Response } from "express"
import cloudinaryMethod from "../../utils/cloudinary.utils.js"
import postRepositoryMethods from "../post/post.repository.js"
import followRepositoryMethods from "../follow/follow.repository.js"
import likeRepositoryMethod from "../like/like.repository.js"
import userRepositoryMethods from "./user.repository.js"



const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userRepositoryMethods.findById(req.user.id)
        const postCount = await postRepositoryMethods.postsCount(req.user.id)
        const followingCount = await followRepositoryMethods.getFollowingCount(req.user.id)
        const followercount = await followRepositoryMethods.getFollowerCount(req.user.id)
        const posts = await postRepositoryMethods.findByUserId(req.user.id);

        const postIds = posts.map((post) => post.id);

        const likedPostIds = await likeRepositoryMethod.findLikedPostIds(
            req.user.id,
            postIds
        );

        const post = posts.map((post) => ({
            ...post,
            isLiked: likedPostIds.includes(post.id),
        }))
        return res.status(200).json({
            success: true,
            message: "user profile",
            data: {
                ...user,
                postCount,
                followercount,
                followingCount,
                post,
            },
        })
    } catch (error) {
        next(error)
    }
}
const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user

        const updateData = { ...req.body };

        if (updateData.bio === "" && updateData.bio === undefined) {
            updateData.bio = null;
        }

        if (updateData.website === "" && updateData.website === undefined) {
            updateData.website = null;
        }
        const updatedUser = await userRepositoryMethods.updateProfile(
            user.id,
            updateData
        )

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        })
    } catch (error) {
        next(error)
    }
}
const updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required",
            });
        }


        if (user.profilePicturePublicId) {
            await cloudinaryMethod.deleteFromCloudinary(
                user.profilePicturePublicId
            )
        }


        const result = await cloudinaryMethod.uploadToCloudinary(req.file.path);

        await userRepositoryMethods.updateProfilePicture(
            user.id,
            result.secure_url,
            result.public_id
        )

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: {
                profilePicture: result.secure_url,
            }
        })
    } catch (error) {
        next(error)
    }
}

const removeProfilePicture = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.user

        if (!user.profilePicturePublicId) {
            return res.status(400).json({
                success: false,
                message: "Profile picture not found",
            });
        }

        await cloudinaryMethod.deleteFromCloudinary(
            user.profilePicturePublicId
        )

        await userRepositoryMethods.removeProfilePicture(user.id)

        return res.status(200).json({
            success: true,
            message: "Profile picture removed successfully",
        })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userRepositoryMethods.getAllUsers()

        return res.status(200).json({
            success: true,
            message: "All Users",
            data: users
        })
    } catch (error) {
        next(error)
    }
}
const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)
        const user = await userRepositoryMethods.findById(userId)
        if (!user) return res.status(400).json({ success: false, message: "user not found" })
        const isFollowing = await followRepositoryMethods.isFollowing(req.user.id, userId)
        return res.status(200).json({
            success: true,
            message: "User profile",
            data: { user, isFollowing }
        })
    } catch (error) {
        next(error)
    }
}

const userController = {
    getProfile, updateProfile, updateProfilePicture,
    removeProfilePicture, getUserProfile, getAllUsers
}
export default userController