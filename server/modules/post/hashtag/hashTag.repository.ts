import { ILike, In, type Repository } from "typeorm"
import AppDataSource from "../../../config/app.DataSource.js"
import { Hashtag } from "./hashTag.entity.js"
import { PostHashTag } from "../postHashTag.entity.js"

const hashTagRepository:Repository<Hashtag>=AppDataSource.getRepository(Hashtag)
const postHashTagRepository:Repository<PostHashTag>=AppDataSource.getRepository(PostHashTag)

const createHashTag=async(hashTag:Partial<Hashtag>):Promise<Hashtag>=>{
    const newHashTag=hashTagRepository.create(hashTag)
    return await hashTagRepository.save(newHashTag)
}
const getAllHashtags=async()=>{
    return await hashTagRepository.find({
      relations:{
        owner:true,
        postHashtags:true,
      }
    })
}

const findByName = async (name: string): Promise<Hashtag | null> => {
    return await hashTagRepository.findOne({
        where: {
            name: ILike(name)
        }
    })
}
const findById=async(id:number):Promise<Hashtag|null>=>{
    return await hashTagRepository.findOne({
        where:{id},
        relations:{
                owner:true,
                postHashtags:true
            }
    })
}
const deleteHashTag=async(id:number):Promise<void>=>{
    await hashTagRepository.delete(id)
}

const attachHashTags=async(postHashTags:Partial<PostHashTag>[]):Promise<PostHashTag[]>=>{
    const newPostHashTags=postHashTagRepository.create(postHashTags)
    return await postHashTagRepository.save(newPostHashTags)
}
const findPublicByName = async (name: string): Promise<Hashtag | null> => {
  return await hashTagRepository.findOne({
    where: {
      name,
      isPublic: true,
    }
  })
}
const findByPostId=async(postId:number):Promise<PostHashTag[]>=>{
    return await postHashTagRepository.find({
        where:{
            post:{
                id:postId
            }
        },
        relations:{
            hashtag:true
        }
    })
}
const findPrivateByName = async (ownerId: number, name: string): Promise<Hashtag | null> => {
  return await hashTagRepository.findOne({
    where: {
      name,
      isPublic: false,
      owner: {
        id: ownerId,
      },
    },
    relations: {
      owner: true,
    }
  })
}
const deleteByPostId=async(postId:number):Promise<void>=>{
    await postHashTagRepository.delete({
        post:{
            id:postId
        }
    })
}

const findByIds = async (ids: number[]): Promise<Hashtag[]> => {
  return await hashTagRepository.find({
    where: {
      id: In(ids),
    },
  })
}




const hashTagRepositoryMethods={createHashTag,findByIds,getAllHashtags, findPrivateByName,findById,findPublicByName,attachHashTags,deleteByPostId,findByPostId, deleteHashTag,findByName}

export default hashTagRepositoryMethods