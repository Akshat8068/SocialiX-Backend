import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity.js";
import { Post } from "./post.entity.js";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "text" })
    content!: string

    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: "CASCADE",
    })
    @JoinColumn({name:"userId"})
    user!:User
    @ManyToOne(() => Post, (post) => post.comments, {
        onDelete: "CASCADE",
    })
    @JoinColumn({name:"postId"})
    post!:Post

    @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({name:"parentCommentId"})
  parentComment!:Comment|null

  @OneToMany(()=>Comment,(comment)=>comment.parentComment)
  replies!:Comment[]

  @CreateDateColumn()
  createdAt!:Date

  @UpdateDateColumn()
  updatedAt!:Date
}