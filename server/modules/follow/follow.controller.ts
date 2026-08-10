import type { NextFunction, Request, Response } from "express"
import { json, number, success } from "zod"
import { AccoutType, User } from "../../entities/user.entity.js"
import { FOLLOW_ERRORS, FOLLOW_MESSAGES, FollowStatus } from "../../types/types.js"
import followRepositoryMethods from "../../repository/follow.repository.js"
import userRepositoryMethods from "../../repository/user.repository.js"



const followUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const reqUserId = req.user.id
    const followingId = Number(req.params.userId)
    if (reqUserId === followingId) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.SELF_FOLLOW
        })
    }
    const targetUser = await userRepositoryMethods.findById(followingId)
    if (!targetUser) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.USER_NOT_FOUND
        })
    }
    const relation = await followRepositoryMethods.findRelation(reqUserId, followingId)

    if (relation) {
        if (relation.status === FollowStatus.ACCEPTED) {
            return res.status(409).json({
                success: false,
                message: FOLLOW_ERRORS.ALREADY_FOLLOWING,
            })
        }

        if (relation.status === FollowStatus.PENDING) {
            return res.status(409).json({
                success: false,
                message: FOLLOW_ERRORS.REQUEST_ALREADY_SENT,
            })
        }
    }
    const status = targetUser?.accountType == AccoutType.PUBLIC ? FollowStatus.ACCEPTED : FollowStatus.PENDING

    const follow = await followRepositoryMethods.createFollow({
        follower: { id: reqUserId } as User,
        following: { id: followingId } as User,
        status,
    })

    return res.status(201).json({
        success: true,
        message: status === FollowStatus.ACCEPTED
            ? FOLLOW_MESSAGES.FOLLOWED
            : FOLLOW_MESSAGES.REQUEST_SENT,
        data: follow,
    })
    }catch(error){
        next(error)
    }

}
const unFollowUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const reqUserId = req.user.id
    const followingId = Number(req.params.userId)
    if (reqUserId === followingId) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.SELF_FOLLOW
        })
    }
    const targetUser = await userRepositoryMethods.findById(followingId)
    if (!targetUser) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.USER_NOT_FOUND
        })
    }
    const relation = await followRepositoryMethods.findRelation(reqUserId, followingId)
    if (!relation) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.FOLLOW_NOT_FOUND
        })
    }
    if (relation?.status == FollowStatus.PENDING) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.PENDING_REQ
        })
    }
    await followRepositoryMethods.deleteFollow(relation.id)

    return res.status(200).json({
        success: true,
        message: FOLLOW_MESSAGES.UNFOLLOWED
    })}catch(error){
        next(error)
    }

}
const acceptRequest = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const userId = req.user.id
    const followId = Number(req.params.id)
    
    const requestAccept = await followRepositoryMethods.findById(followId)
    if (!requestAccept) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.FOLLOW_NOT_FOUND
        })
    }
    if (userId === requestAccept.follower.id) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.SELF_FOLLOW
        })
    }
    if (requestAccept.status === FollowStatus.ACCEPTED) {
        return res.status(409).json({
            success: true,
            message: FOLLOW_ERRORS.ALREADY_FOLLOWING
        })
    }
    const updateFollow = await followRepositoryMethods.updateStatus(followId, FollowStatus.ACCEPTED)
    return res.status(200).json({
        success: true,
        message: FOLLOW_MESSAGES.REQUEST_ACCEPTED,
    })
    }catch(error){
        next(error)
    }
}
const rejectRequest = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const reqUserId = req.user.id
    const followId = Number(req.params.id)
    const requestReject = await followRepositoryMethods.findById(followId)
    if (!requestReject) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.FOLLOW_NOT_FOUND
        })
    }
    if (requestReject.status === FollowStatus.ACCEPTED) {
        return res.status(400).json({
            success: false,
            message: "The req already Accepcted"
        })
    }
    if (requestReject.following.id !== reqUserId) {
        return res.status(403).json({
            success: false,
            message: "Only Receiver have right to reject req"
        })
    }
    const rejectedRequest = await followRepositoryMethods.deleteFollow(requestReject.id)
    return res.status(200).json({
        success: true,
        message: FOLLOW_MESSAGES.REQUEST_REJECTED
    })
    }catch(error){
        next(error)
    }
}
const cancleRequest = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const reqUserId = req.user.id
    const followId = Number(req.params.id)
    const requestCancle = await followRepositoryMethods.findById(followId)
    if (!requestCancle) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.FOLLOW_NOT_FOUND
        })
    }
    if (requestCancle.status === FollowStatus.ACCEPTED) {
        return res.status(400).json({
            success: false,
            message: "The req already Accepcted"
        })
    }
    if (requestCancle.follower.id !== reqUserId) {
        return res.status(403).json({
            success: false,
            message: "Only Receiver have right to reject req"
        })
    }
    const rejectedRequest = await followRepositoryMethods.deleteFollow(requestCancle.id)
    return res.status(200).json({
        success: true,
        message: FOLLOW_MESSAGES.REQUEST_CANCELLED
    })
    }catch(error){
        next(error)
    }
}
const removeFollower = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const profileOwner = req.user.id
    const followerId = Number(req.params.userId)
    if (profileOwner === followerId) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.SELF_FOLLOW
        })
    }
    const followerExist = await userRepositoryMethods.findById(followerId)
    if (!followerExist) {
        return res.status(400).json({
            success: false,
            message: FOLLOW_ERRORS.USER_NOT_FOUND
        })
    }
    const relation = await followRepositoryMethods.findRelation(followerId,profileOwner)
    if(!relation){
        return res.status(400).json({
            success:false,
            message:FOLLOW_ERRORS.FOLLOW_NOT_FOUND
        })
    }
    if (relation?.status !== FollowStatus.ACCEPTED) {
        return res.status(400).json({
            success: false,
            message: "Follower not found"
        })
    }
    if(profileOwner!==relation.following.id){
        return res.status(403).json({
            success:false,
            message:FOLLOW_ERRORS.FOLLOW_NOT_FOUND
        })
    }
    const removedFollower=await followRepositoryMethods.deleteFollow(relation.id)
     return res.status(200).json({
        success:true,
        message:FOLLOW_MESSAGES.FOLLOWER_REMOVED
     })
     }catch(error){
        next(error)
    }
}

const getFollowers = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const userId=Number(req.params.userId)
    const user= await userRepositoryMethods.findById(userId)
    if(!user){
        return res.status(404).json({
            success:false,
            message:FOLLOW_ERRORS.USER_NOT_FOUND
        })
    }
    const followersList=await followRepositoryMethods.getFollowers(userId)
    return res.status(200).json({
        success:true,
        message:"Followers list",
        data:followersList,
        count:followersList.length
    })
    }catch(error){
        next(error)
    }
}
const getFollowing = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const userId=Number(req.params.userId)
    const user= await userRepositoryMethods.findById(userId)
    if(!user){
        return res.status(404).json({
            success:false,
            message:FOLLOW_ERRORS.USER_NOT_FOUND
        })
    }
    const followingList=await followRepositoryMethods.getFollowing(userId)
    return res.status(200).json({
        success:true,
        message:"Following list",
        data:followingList,
        count:followingList.length
    })
    }catch(error){
        next(error)
    }
}
const getPendingRequest = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const userId=req.user.id
    const getPendingRequests=await followRepositoryMethods.getPendingRequests(userId)
    return res.status(200).json({
        success:true,
        message:"Your pendings reqs",
        data:getPendingRequests
    })
    }catch(error){
        next(error)
    }

}

const getSentRequest = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const userId=req.user.id
    const getSentRequests=await followRepositoryMethods.getSentRequests(userId)
    return res.status(200).json({
        success:true,
        message:"Your sent reqs",
        data:getSentRequests
    })
    }catch(error){
        next(error)
    }
}
const followContoller = {
    followUser, unFollowUser, getSentRequest
    , getPendingRequest, getFollowers, getFollowing, removeFollower,
    cancleRequest, acceptRequest, rejectRequest
}
export default followContoller

