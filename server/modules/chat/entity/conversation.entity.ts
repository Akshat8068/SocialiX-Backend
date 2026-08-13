import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Message } from "./message.entity.js";
import { ConversationParticipant } from "./ConversationParticipant.entity.js";

@Entity("conversations")
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number

    @OneToMany(() => ConversationParticipant, (participant) => participant.conversation)
    participants!: ConversationParticipant[]

    @OneToMany(() => Message, (message) => message.conversation)
    messages!: Message[]
    @Column({
        type: "text",
        nullable: true,
    })
    lastMessage!: string

    @Column({
        type: "timestamp",
        nullable: true,
    })
    lastMessageAt!: Date

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}