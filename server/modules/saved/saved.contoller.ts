import type { NextFunction, Request, Response } from "express";
import postRepositoryMethods from "../../repository/post.repository.js";
import savedRepositoryMethods from "../../repository/saved.repository.js";

const savedPost=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const user=req.user
    const postId=Number(req.params.postId)
    const post=await postRepositoryMethods.findById(postId)
    if(!post){
        return res.status(400).json({
        success:false,
        message:"Post not found"
    })
    }
     const savedPost=await savedRepositoryMethods.findByUserAndPost(req.user.id,postId)
     if(savedPost){
        await savedRepositoryMethods.deleteSaved(savedPost.id)
        return res.status(200).json({
        success:true,
        message:"unsaved post"
    })
     }
     const data=await savedRepositoryMethods.createSaved(user,post)
   return res.status(200).json({
        success:true,
        message:"Save Post",
        data:data
    })
    } catch (error) {
        next(error)
    }
}

const getAllSaved=async(req:Request,res:Response,next:NextFunction)=>{
    try{

    const userId=req.user.id
    const savedPost=await savedRepositoryMethods.allSaved(userId)

    return res.status(200).json({
        success:true,
        message:"Get all post",
        data:savedPost
    })
    } catch (error) {
        next(error)
    }
}

const getSingleSaved=async(req:Request,res:Response,next:NextFunction)=>{
try{
    const postId=Number(req.params.postId)
    const savedPost=await savedRepositoryMethods.findByUserAndPost(req.user.id,postId)

    return res.status(200).json({
        success:true,
        message:"Get single post",
        data:savedPost
    })
    } catch (error) {
        next(error)
    }
}


const savedController={savedPost,getAllSaved,getSingleSaved}
export default savedController