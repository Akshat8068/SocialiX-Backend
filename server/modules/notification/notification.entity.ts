import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity.js";
import { NotificationType } from "../../types/types.js";
import { Post } from "../post/post.entity.js";
import { Comment } from "../comment/comment.entity.js";
import { Conversation } from "../chat/entity/conversation.entity.js";


@Entity("notifications")
@Index(["recipientId", "isRead"])
@Index(["recipientId", "createdAt"])
export class Notification{
     @PrimaryGeneratedColumn()
  id!: number;

  // User who receives the notification
  @Column()
  recipientId!: number;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "recipientId" })
  recipient!: User;

  // User who performs the action
  @Column()
  senderId!: number;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "senderId" })
  sender!: User;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type!: NotificationType;

  // Related post
  @Column({
    nullable: true,
  })
  postId!: number | null;

  @ManyToOne(() => Post, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "postId" })
  post!: Post | null;

  // Related comment
  @Column({
    nullable: true,
  })
  commentId!: number | null;

  @ManyToOne(() => Comment, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "commentId" })
  comment!: Comment | null;

  // Related conversation for MESSAGE notifications
  @Column({
    nullable: true,
  })
  conversationId!: number | null;

  @ManyToOne(() => Conversation, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "conversationId" })
  conversation?: Conversation | null;

  // Optional notification text
  @Column({
    type: "text",
    nullable: true,
  })
  message!: string | null;

  @Column({
    default: false,
  })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}