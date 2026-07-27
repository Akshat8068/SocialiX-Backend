import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hashtag } from "./hashTag.entity.js";
import { Post } from "../../entities/post.entity.js";

@Entity("PostHashTags")
export class PostHashTag{
    @PrimaryGeneratedColumn()
    is!:number

    @ManyToOne(() => Post, (post) => post.hashtags, {
    onDelete: "CASCADE",
  })
  post!: Post

    @ManyToOne(() => Hashtag, (hashtag) => hashtag.postHashtags, {
    onDelete: "CASCADE",
  })
  hashtag!: Hashtag
    @CreateDateColumn()
    createdAt!:Date
}