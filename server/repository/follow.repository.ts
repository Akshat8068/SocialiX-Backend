import type { DeleteResult, Repository } from "typeorm"
import { Follow } from "../entities/follow.entity.js"
import AppDataSource from "../config/app.DataSource.js"
import { FollowStatus } from "../types/types.js"

const followRepository: Repository<Follow> = AppDataSource.getRepository(Follow)

const findRelation = async (followerId: number, followingId: number): Promise<Follow | null> => {
    return await followRepository.createQueryBuilder("follow")
        .leftJoinAndSelect("follow.follower", "follower").leftJoinAndSelect("follow.following", "following")
        .where("follower.id = :followerId", { followerId })
        .andWhere("following.id = :followingId", { followingId })
        .getOne()
}
const isFollowing = async ( followerId: number,followingId: number): Promise<boolean> => {
  const relation = await followRepository.findOne({
    where: {
      follower: {
        id: followerId,
      },
      following: {
        id: followingId,
      },
      status: FollowStatus.ACCEPTED,
    },
  })

  return !!relation
}
const findById=async(id:number):Promise<Follow|null>=>{
    return await followRepository.findOne({
        where:{id},
        relations:{
            follower:true,
            following:true
        }
    })
}
const createFollow = async (follow: Partial<Follow>): Promise<Follow> => {
    const newFollow = followRepository.create(follow)
    return await followRepository.save(newFollow)
}

const deleteFollow = async (id: number): Promise<DeleteResult> => {
    return await followRepository.delete(id)

}
const isFriend = async (userId: number,otherUserId: number): Promise<boolean> => {
  const friends = await getFriends(userId)
  return friends.some(
    (friend) => friend.following.id === otherUserId
  )
}

const updateStatus = async (id: number, status: FollowStatus): Promise<Follow | null> => {
    await followRepository.update(id, { status })
    return await followRepository.findOne({
        where: { id },
        relations: {
            follower: true,
            following: true
        }
    })
}

const getFollowers=async(userId: number): Promise<Follow[]> => {
    return await followRepository.createQueryBuilder("follow")
        .leftJoinAndSelect("follow.follower", "follower")
        .where("follow.following_id = :userId", { userId })
        .andWhere("follow.status = :status", {
            status: FollowStatus.ACCEPTED,
        })
        .getMany()

}

const getFollowing=async(userId: number): Promise<Follow[]> => {
    return await followRepository.createQueryBuilder("follow")
        .leftJoinAndSelect("follow.following", "following")
        .where("follow.follower_id = :userId", { userId })
        .andWhere("follow.status = :status", {
            status: FollowStatus.ACCEPTED,
        })
        .getMany()

}

const getPendingRequests=async(userId: number): Promise<Follow[]> => {
    return await followRepository.createQueryBuilder("follow")
        .leftJoinAndSelect("follow.follower", "follower")
        .where("follow.following_id = :userId", { userId })
        .andWhere("follow.status = :status", {
            status: FollowStatus.PENDING,
        })
        .getMany()

}
const getSentRequests=async(userId: number): Promise<Follow[]> => {
    return await followRepository.createQueryBuilder("follow")
        .leftJoinAndSelect("follow.following", "following")
        .where("follow.follower_id = :userId", { userId })
        .andWhere("follow.status = :status", {
            status: FollowStatus.PENDING,
        })
        .getMany()

}
const getMutualFriends=async(userId:number,otherUserId:number)=>{
    return await followRepository.createQueryBuilder("follow")
    .leftJoinAndSelect("follow.following","following").where(qb=>{
        const subQuery=qb.subQuery().select("f.following_id").from(Follow,"f")
        .where("f.follower_id=:userId").andWhere("f.status=:status")
        .getQuery()

        return `follow.following_id IN ${subQuery}`
    })
    .andWhere("follow.follower_id=:otherUserId")
    .andWhere("follow.status=:status")
    .setParameters({userId,otherUserId,status:FollowStatus.ACCEPTED})
    .getMany()
}
const getFriends=async(userId:number):Promise<Follow[]>=>{
    return await followRepository.createQueryBuilder("follow")
    .leftJoinAndSelect("follow.following","following")
    .where("follow.follower_id=:userId",{userId})
    .andWhere("follow.status=:status",{
        status:FollowStatus.ACCEPTED
    }).andWhere(qb=>{
        const subQuery=qb.subQuery().select("f.follower_id")
        .from(Follow,"f")
        .where("f.following_id=:userId")
        .andWhere("f.status=:status")
        .getQuery()

        return `follow.following_id In ${subQuery}`
    }).setParameter("userId",userId)
    .setParameter("status",FollowStatus.ACCEPTED).getMany()
}


const getFollowingCount=async(id:number)=>{
    return await followRepository.count({
  where: {
    following: {id}
  },
})
}
const getFollowerCount=async(id:number)=>{
    return await followRepository.count({
        where:{
            follower:{id}
        }
    })
}


const followRepositoryMethods = {getFollowerCount,getFollowingCount, findRelation,findById, createFollow,deleteFollow,
    updateStatus,getFollowers,getFollowing,getPendingRequests,
    getSentRequests,getMutualFriends,getFriends,isFollowing,isFriend
 }

export default followRepositoryMethods