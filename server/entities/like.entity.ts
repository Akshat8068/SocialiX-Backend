import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique, Index } from "typeorm"
import { User } from "./user.entity.js"
import { Post } from "./post.entity.js"

@Entity("likes")
@Unique(["user", "post"])
@Index(["post"])
export class Like {
    @PrimaryGeneratedColumn()
    id!: number
    @ManyToOne(() => User, (user) => user.likes, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "userId" })
    user!: User

    @ManyToOne(() => Post, (post) => post.likes, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "postId" })
    post!: Post

    @CreateDateColumn()
    createdAt!: Date
}