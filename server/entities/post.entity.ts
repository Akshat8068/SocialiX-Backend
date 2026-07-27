import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm"
import { PostVisibility } from "../types/types.js"
import { User } from "./user.entity.js"
import { PostMedia } from "../modules/post/postMedia.entity.js"
import { PostHashTag } from "../modules/post/postHashTag.entity.js"
import { Like } from "./like.entity.js"
import { number } from "zod"
import { Comment } from "./comment.entity.js"
import { SavedPost } from "./saved.entity.js"

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "text", nullable: true })
    caption?: string

    @Column({ type: "enum", enum: PostVisibility, default: PostVisibility.PUBLIC })
    visibility?: PostVisibility

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: "CASCADE"
    })
    user!: User

    @OneToMany(() => PostMedia, (media) => media.post)
    media!: PostMedia[]
    @Column({type:"int", default: 0 })
    likeCount!: number
    @OneToMany(() => PostHashTag, (postHashtag) => postHashtag.post)
    hashtags!: PostHashTag[]

    @OneToMany(()=>Comment,(comment)=>comment.post)
    comments!:Comment[]

    @Column({type:"int",default:0})
    commentCount!:number

    @CreateDateColumn()
    createdAt!: Date

    @OneToMany(() => Like, (like) => like.post)
    likes!: Like[]
    @UpdateDateColumn()
    updatedAt!: Date
    @OneToMany(()=>SavedPost,(savedPost)=>savedPost.post)
    savedByUsers!:SavedPost[]

}