import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Follow } from "./follow.entity.js";
import { Post } from "./post.entity.js";
import { Hashtag } from "../modules/post/hashTag.entity.js";
import { Like } from "./like.entity.js";
import { Comment } from "./comment.entity.js";
import { SavedPost } from "./saved.entity.js";
import { Message } from "./message.entity.js";
import { Conversation } from "./conversation.entity.js";
import { ConversationParticipant } from "./ConversationParticipant.entity.js";



export enum AccoutType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}
@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar", length: 150, unique: true
    })
    username!: string
    @Column({
        type: "varchar", length: 150,
    })
    fullname!: string

    @Column({
        type: "varchar",
        unique: true,
    })
    email!: string;

    @Column({
        type: "text", select: false
    })
    password!: string

    @Column({ type: "text", nullable: true })
    bio?: string

    @Column({ type: "boolean", default: false })
    isVerified!: boolean

    @Column({ type: "text", nullable: true })
    website?: string

    @Column({ type: "text", nullable: true })
    profilePicture?: string | null

    @Column({
        type: "text",
        nullable: true
    })
    profilePicturePublicId!: string | null

    @Column({
        type: "enum",
        enum: AccoutType,
        default: AccoutType.PUBLIC
    })
    accountType!: AccoutType


    @Column({ type: "boolean", default: false })
    professionalAccount?: boolean

    @OneToMany(() => Follow, (follow) => follow.follower)
    following!: Follow[]

    @OneToMany(() => Follow, (follow) => follow.following)
    followers!: Follow[]

    @OneToMany(() => Post, (post) => post.user)
    posts!: Post[]
    @OneToMany(() => Hashtag, (hashtag) => hashtag.owner)
    hashtags!: Hashtag[]
    @OneToMany(() => Like, (like) => like.user)
    likes!: Like[]
    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[]

    @OneToMany(() => SavedPost, (savedPost) => savedPost.user)
    savedPosts!: SavedPost[]

   
    conversationsAsUserTwo!: Conversation[]

    @OneToMany(() => Message, (message) => message.sender)
    sentMessages!: Message[]

    @OneToMany(() => ConversationParticipant, (participant) => participant.user)
    conversationParticipants!: ConversationParticipant[]
}