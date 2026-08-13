import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "../post.entity.js";

@Entity("PostMedias")
@Index(["post"])
export class PostMedia{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"text"})
    publicId!:string
    @Column({type:"text"})
    secureUrl!:string

    @ManyToOne(() => Post, (post) => post.media, {
    onDelete: "CASCADE",
  })
  post!: Post
    @CreateDateColumn()
    createdAt!:Date
    @UpdateDateColumn()
    updatedAt!:Date
}