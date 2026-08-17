import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostHashTag } from "../postHashTag.entity.js";
import { User } from "../../users/user.entity.js";


@Entity("hashtags")
export class Hashtag{
    @PrimaryGeneratedColumn()
    id!:number
    @Column({ type:"varchar",unique:true})
    name!:string

    @Column({type:"boolean",default:"true"})
    isPublic!:boolean

    @ManyToOne(() => User, (user) => user.hashtags, {
    onDelete: "CASCADE",
  })
  owner!:User

  @OneToMany(() => PostHashTag, (postHashtag) => postHashtag.hashtag)
  postHashtags!: PostHashTag[]
  
@Column({type:"int", default: 0 })
postCount!: number;
  @CreateDateColumn()
  createdAt!: Date
}