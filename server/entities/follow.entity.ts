import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,
  CreateDateColumn,  UpdateDateColumn,Unique,} from "typeorm";
import { User } from "./user.entity.js";
import { FollowStatus } from "../types/types.js";


@Entity("follows")
@Unique(["follower", "following"])
export class Follow {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "follower_id" })
  follower!: User;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "following_id" })
  following!: User;

  @Column({
    type: "enum",
    enum: FollowStatus,
    default: FollowStatus.PENDING,
  })
  status!: FollowStatus;

  @CreateDateColumn({name: "created_at",})
  createdAt!: Date;

  @UpdateDateColumn({name: "updated_at",})
  updatedAt!: Date;
}