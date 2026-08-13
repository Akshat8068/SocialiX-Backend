import type { DeepPartial } from "typeorm";
import AppDataSource from "../config/app.DataSource.js";
import { ConversationParticipant } from "../entities/ConversationParticipant.entity.js";
import { In } from "typeorm"
import { Message } from "../entities/message.entity.js";
interface ConversationWithUnreadCount {
  id: number;
  joinedAt: Date;

  conversation: ConversationParticipant["conversation"];

  unreadCount: number;
}
const cPRepository = AppDataSource.getRepository(ConversationParticipant)
const addParticipants = async (data: DeepPartial<ConversationParticipant>[]): Promise<ConversationParticipant[]> => {
  const participants = cPRepository.create(data)

  return await cPRepository.save(participants)
}



const findConversationBetweenUsers = async (userOneId: number, userTwoId: number): Promise<ConversationParticipant | null> => {
  return await cPRepository
    .createQueryBuilder("cp1")

    .innerJoin(
      ConversationParticipant,
      "cp2",
      "cp1.conversation_id = cp2.conversation_id"
    )

    .leftJoinAndSelect(
      "cp1.conversation",
      "conversation"
    )

    .where(
      "cp1.user_id = :userOneId",
      {
        userOneId
      }
    )

    .andWhere(
      "cp2.user_id = :userTwoId",
      {
        userTwoId
      }
    )

    .getOne()
}

const getUserConversations = async (userId: number) => {
  const { entities, raw } = await cPRepository
    .createQueryBuilder("participant")

    .leftJoinAndSelect(
      "participant.conversation",
      "conversation"
    )

    .leftJoinAndSelect(
      "conversation.participants",
      "participants"
    )

    .leftJoinAndSelect(
      "participants.user",
      "user"
    )

    .where(
      "participant.user_id = :userId",
      { userId }
    )

    .addSelect(
      (subQuery) => {
        return subQuery
          .select("COUNT(message.id)")
          .from(Message, "message")
          .where(
            "message.conversation_id = conversation.id"
          )
          .andWhere(
            "message.sender_id != :userId"
          )
          .andWhere(
            "message.seen_at IS NULL"
          )
          .andWhere(
            "message.is_deleted_for_everyone = false"
          );
      },
      "unreadCount"
    )

    .setParameter("userId", userId)

    .orderBy(
      "conversation.lastMessageAt",
      "DESC"
    )

    .getRawAndEntities()
  const unreadCountMap = new Map<number, number>()
  raw.forEach((item) => {
    unreadCountMap.set(
      Number(item.conversation_id),
      Number(item.unreadCount ?? 0)
    );
  })
  return entities.map((participant) => ({
    ...participant,
    unreadCount:
      unreadCountMap.get(participant.conversation.id) ?? 0,
  }))
}
const cPRepositoryMenthods = { addParticipants, findConversationBetweenUsers, getUserConversations }

export default cPRepositoryMenthods