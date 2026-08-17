import AppDataSource from "../../config/app.DataSource.js";
import { In } from "typeorm";
import { Like } from "./like.entity.js";

const likeRepository=AppDataSource.getRepository(Like)

const findLike=async(userId:number,postId:number):Promise<Like|null>=>{
    return await likeRepository.findOne({
        where:{
            user:{id:userId},
            post:{id:postId}
        }
    })
}

const createLike=async(userId:number,postId:number):Promise<Like>=>{
    const like= await likeRepository.create({
        user:{id:userId},
        post:{id:postId}
    })
    return await likeRepository.save(like)
}

const deleteLike=async(id:number)=>{
    return await likeRepository.delete(id)
}


const getLikedlist=async(postId:number)=>{
    return await likeRepository.find({
        where:{
            post:{id:postId}
        },
        relations:{
            user:true
        },
        select:{
            id:true,
            user:true
        },
        order:{
            createdAt:"DESC"
        }
    })
}
const findLikedPostIds = async (
    userId: number,
    postIds: number[]
): Promise<number[]> => {
    const likes = await likeRepository.find({
        where: {
            user: { id: userId },
            post: {
                id: In(postIds),
            },
        },
        relations: {
            post: true,
        },
        select: {
            post: {
                id: true,
            },
        },
    });

    return likes.map((like) => like.post.id);
}


const likeRepositoryMethod = { getLikedlist,findLikedPostIds,deleteLike,createLike,findLike}

export default likeRepositoryMethod