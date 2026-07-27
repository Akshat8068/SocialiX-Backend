import {Entity,  PrimaryGeneratedColumn,Column,
  ManyToOne,JoinColumn,  CreateDateColumn,UpdateDateColumn,
} from "typeorm";

import { Conversation } from "./conversation.entity.js";
import { User } from "./user.entity.js";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.messages,
    {
      nullable: false,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "conversation_id" })
  conversation!: Conversation

  @ManyToOne(
    () => User,
    (user) => user.sentMessages,
    {
      nullable: false,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "sender_id" })
  sender!: User

  @Column({
    type: "text",
  })
  content!: string


  @Column({
    name: "seen_at",
    type: "timestamp",
    nullable: true,
  })
  seenAt!: Date | null

  @Column({
    name: "is_deleted_for_everyone",
    type: "boolean",
    default: false,
  })
  isDeletedForEveryone!: boolean

  @Column({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
  })
  deletedAt!: Date | null

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date
}