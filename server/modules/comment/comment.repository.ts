import { id, tr } from "zod/locales";
import AppDataSource from "../../config/app.DataSource.js";
import type { DeepPartial } from "typeorm";
import { Comment } from "./comment.entity.js";

const commentRepository=AppDataSource.getTreeRepository(Comment)

const createComment=async(data:DeepPartial<Comment>)=>{
    const comment =await commentRepository.create(data)

    return await commentRepository.save(comment)
}

const findCommnetById=async(id:number):Promise<Comment|null>=>{
    return await commentRepository.findOne({
        where:{
            id
        },
        relations:{
            user:true,post:true,parentComment:true
        }
    })
}
const updateComment=async(data:Comment)=>{
        return await commentRepository.save(data)
}
const deleteComment=async(id:number)=>{
    return await commentRepository.delete(id)
}
const getPostComments=async(id:number):Promise<Comment[]>=>{
    return await commentRepository.find({
        where:{post:{id}},
        relations:{
            user:true,parentComment:true
        },
        order:{
            createdAt:"DESC"
        }
    })
}

const getReplies=async(id:number)=>{
    return await commentRepository.find({
        where:{
            parentComment:{id}
        },
        relations:{
            user:true
        },
        order:{
            createdAt:"DESC"
        }
    })
}
const commentRepositoryMethod={getReplies,getPostComments,createComment,deleteComment,updateComment,findCommnetById}
export default commentRepositoryMethod