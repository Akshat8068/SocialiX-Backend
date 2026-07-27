import type { NextFunction, Request, Response } from "express"
import userRepositoryMethods from "../../repository/user.repository.js"
import hashTagRepositoryMethods from "../../repository/hashTag.repository.js"
import { AccoutType } from "../../entities/user.entity.js"
import { ILike } from "typeorm"
import { nextTick } from "node:process"

const createHashTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body
        const userId = Number(req.user?.id)
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Hashtag name is required"
            })
        }

        const user = await userRepositoryMethods.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "unathorized"
            })
        }
        const trimName = name.trim().toLowerCase()
        if (user.accountType == AccoutType.PRIVATE) {
            const findPrivateHashTag = await hashTagRepositoryMethods.findPrivateByName(userId, trimName)
            if (findPrivateHashTag) {
                return res.status(400).json({
                    success: false,
                    message: "private HashTag already exist"
                })
            }
        } else {
            const findPublicHashTag = await hashTagRepositoryMethods.findPublicByName(trimName)
            if (findPublicHashTag) {
                return res.status(400).json({
                    success: false,
                    message: "public HashTag already exist"
                })
            }
        }

        const hashTag = await hashTagRepositoryMethods.createHashTag({
            name: trimName,
            owner: user,
            isPublic: user.accountType !== AccoutType.PRIVATE
        })
        res.status(200).json({
            success: true,
            message: "HashTag created",
            data: hashTag
        })
    } catch (error) {
        next(error)
    }
}
const getHashTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hashTag } = req.body
        const existHashTag = await hashTagRepositoryMethods.findByName(hashTag)
        if (!existHashTag) {
            return res.status(400).json({
                success: false,
                message: "Hashtag not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "HashTag found",
            data: existHashTag
        })
    }
    catch (error) {
        next(error)
    }
}
const deleteHashTag = async (req: Request, res: Response, next: NextFunction) => {
    try{
    const hashtagId = Number(req.params.hashtagId)
    const userId = req.user?.id

    if (!hashtagId) {
        return res.status(400).json({
            success: false,
            message: "Hashtag id is required",
        })
    }

    const hashtag = await hashTagRepositoryMethods.findById(hashtagId)

    if (!hashtag) {
        return res.status(404).json({
            success: false,
            message: "Hashtag not found",
        })
    }

    if (hashtag.owner.id !== userId) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to delete this hashtag",
        })
    }
    if (hashtag.isPublic) {
        return res.status(400).json({
            success: false,
            message: "Public hashtag cannot be deleted manually",
        })
    }

    if (hashtag.postHashtags && hashtag.postHashtags.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Hashtag is already used in posts",
        })
    }

    await hashTagRepositoryMethods.deleteHashTag(hashtagId)

    return res.status(200).json({
        success: true,
        message: "Hashtag deleted successfully",
    })
}catch(error){
    next(error)
}
}


const hashTagController = { createHashTag, getHashTag, deleteHashTag }
export default hashTagController