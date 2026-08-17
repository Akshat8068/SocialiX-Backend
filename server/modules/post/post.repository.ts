
import { ILike, In } from "typeorm";
import AppDataSource from "../../config/app.DataSource.js";
import { Post } from "./post.entity.js";

import { FollowStatus } from "../../types/types.js";
import { PostMedia } from "./postMedia/postMedia.entity.js";

const postMediaRepository = AppDataSource.getRepository(PostMedia)
const postRepository = AppDataSource.getRepository(Post)

const createPost = async (post: Partial<Post>): Promise<Post> => {
  const newPost = postRepository.create(post)
  return await postRepository.save(newPost)
}

const findById = async (id: number): Promise<Post | null> => {
  return await postRepository.findOne({
    where: { id },
    relations: {
      user: true,
      media: true,
      hashtags: {
        hashtag: true
      }
    }
  })
}
const findByUserId = async (id: number): Promise<Post[]> => {
  return await postRepository.find({
    where: {
      user: {
        id
      },
    },
    relations: {
      user: true,
      media: true,
      hashtags: {
        hashtag: true,
      },
    },
    order: {
      createdAt: "DESC",
    },
  });
};

const updatePost = async (post: Partial<Post>): Promise<Post | null> => {
  return await postRepository.save(post)
}

const deletePost = async (id: number): Promise<void> => {
  await postRepository.delete(id)
}

const getUserPosts = async (userId: number): Promise<Post[]> => {
  return await postRepository.find({
    where: {
      user: {
        id: userId
      }
    },
    relations: {
      media: true,
      user: true,
      hashtags: {
        hashtag: true
      }
    }, order: {
      createdAt: "DESC"
    }
  })
}
const createMedia = async (media: Partial<PostMedia>): Promise<PostMedia> => {
  const newMedia = postMediaRepository.create(media)
  return await postMediaRepository.save(newMedia)
}


const findByPostId = async (postId: number): Promise<PostMedia[]> => {
  return await postMediaRepository.find({
    where: {
      post: {
        id: postId
      }
    }
  })
}

const deleteByPostId = async (postId: number): Promise<void> => {
  await postMediaRepository.delete({
    post: {
      id: postId
    }
  })
}


const incrementLikeCount = async (postId: number) => {
  return await postRepository.increment(
    { id: postId },
    "likeCount",
    1
  )
}

const incrementCommentCount = async (postId: number) => {
  return await postRepository.increment(
    { id: postId },
    "commentCount",
    1
  )
}
const decrementLikeCount = async (postId: number) => {
  return await postRepository.decrement(
    { id: postId },
    "likeCount",
    1
  )
}
const decrementCommentCount = async (postId: number) => {
  return await postRepository.decrement(
    { id: postId },
    "commentCount",
    1
  )
}
const postsCount = async (id: number) => {
  return await postRepository.count({
    where: {
      user: { id }
    }
  })
}

const getHomeFeed = async (userId: number): Promise<Post[]> => {
  return await postRepository
    .createQueryBuilder("post")

    .leftJoinAndSelect("post.user", "user")
    .leftJoinAndSelect("post.media", "media")
    .leftJoinAndSelect("post.hashtags", "postHashtags")
    .leftJoinAndSelect("postHashtags.hashtag", "hashtag")

    .innerJoin(
      "follows",
      "follow",
      `
      "follow"."following_id" = "user"."id"
      AND "follow"."follower_id" = :userId
      AND "follow"."status" = :status
      `,
      {
        userId,
        status: FollowStatus.ACCEPTED,
      }
    )

    .orderBy("post.createdAt", "DESC")

    .getMany();
};



const postRepositoryMethods = {
  createPost, postsCount, findByUserId,
  incrementCommentCount, decrementCommentCount, incrementLikeCount, getHomeFeed, decrementLikeCount, deleteByPostId, deletePost, findById, findByPostId, updatePost, createMedia, getUserPosts
}

export default postRepositoryMethods