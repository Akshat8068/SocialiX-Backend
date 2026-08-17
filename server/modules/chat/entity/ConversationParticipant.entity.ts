import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

import { Conversation } from "./conversation.entity.js";
import { User } from "../../users/user.entity.js";


@Entity("conversation_participants")
@Index(["user"])
@Index(["conversation"])
export class ConversationParticipant {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Conversation,(conversation) => conversation.participants,
    {
      nullable: false,
      onDelete: "CASCADE",
    })
  @JoinColumn({ name: "conversation_id" })
  conversation!: Conversation

  @ManyToOne(() => User,(user) => user.conversationParticipants,
    {
      nullable: false,
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "user_id" })
  user!: User

  @CreateDateColumn({
    name: "joined_at",
  })
  joinedAt!: Date
}