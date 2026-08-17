import { CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../users/user.entity.js";
import { Post } from "../post/post.entity.js";


@Entity("SavedPosts")
@Unique(["user","post"])
export class SavedPost{
    @PrimaryGeneratedColumn()
    id!:number
    @ManyToOne(()=>User,(user)=>user.savedPosts,{
        onDelete:"CASCADE"
    })
    user!:User

    @ManyToOne(()=>Post,(post)=>post.savedByUsers,{
        onDelete:"CASCADE"
    })
    post!:Post
    

    @CreateDateColumn()
    createdAt!:Date
}