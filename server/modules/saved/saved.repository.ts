
import AppDataSource from "../../config/app.DataSource.js";
import type { Post } from "../post/post.entity.js";

import type { User } from "../users/user.entity.js";
import { SavedPost } from "./saved.entity.js";

const savedRepository=AppDataSource.getRepository(SavedPost)


const createSaved=async(user:User,post:Post)=>{
    const savedPost=savedRepository.create({
        user:user,
        post
    })
    return await savedRepository.save(savedPost)
}


const findByUserAndPost=async(userID:number,postId:number):Promise<SavedPost|null>=>{
    return await savedRepository.findOne({
        where:{
            user:{id:userID},
            post:{id:postId}
        },
        relations:{user:true,
            post:true
        }
    })
}

const findById=async(id:number):Promise<SavedPost|null>=>{
    return await savedRepository.findOne({
        where:{id},
        relations:{post:true}
    })
}

const deleteSaved=async(id:number)=>{
    return await savedRepository.delete(id)
}

const allSaved=async(id:number):Promise<SavedPost[]>=>{
    return await savedRepository.find({
        where:{
            user:{id}
        },relations:{
            post: {
                media: true,
                user: true,
                hashtags: {hashtag: true,}
        }
    },
        order:{
            createdAt:"DESC"
        }
    })
}

const savedRepositoryMethods={allSaved,createSaved,deleteSaved,findById,findByUserAndPost}
export default savedRepositoryMethods