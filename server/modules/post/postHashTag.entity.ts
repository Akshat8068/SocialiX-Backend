import { CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity.js";
import { Hashtag } from "./hashtag/hashTag.entity.js";

@Entity("PostHashTags")
  @Index(["post"])
@Index(["hashtag"])
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