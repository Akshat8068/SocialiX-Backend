import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, OneToMany, Index } from "typeorm"
import { PostVisibility } from "../../types/types.js"
import { User } from "../users/user.entity.js"
import { PostMedia } from "./postMedia/postMedia.entity.js"
import { PostHashTag } from "./postHashTag.entity.js"
import { Comment } from "../comment/comment.entity.js"
import { Like } from "../like/like.entity.js"
import { SavedPost } from "../saved/saved.entity.js"


@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "text", nullable: true })
    caption?: string

    @Column({ type: "enum", enum: PostVisibility, default: PostVisibility.PUBLIC })
    visibility?: PostVisibility

    @Index()
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