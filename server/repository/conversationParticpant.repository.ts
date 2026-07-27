import type { DeepPartial } from "typeorm";
import AppDataSource from "../config/app.DataSource.js";
import { ConversationParticipant } from "../entities/ConversationParticipant.entity.js";
import { In } from "typeorm"

const cPRepository=AppDataSource.getRepository(ConversationParticipant)
const addParticipants = async (data: DeepPartial<ConversationParticipant>[]): Promise<ConversationParticipant[]> => {
  const participants = cPRepository.create(data)

  return await cPRepository.save(participants)
}



const findConversationBetweenUsers = async (userOneId: number,userTwoId: number): Promise<ConversationParticipant | null> => {
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

const getUserConversations = async (userId: number): Promise<ConversationParticipant[]> => {
  return await cPRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      conversation: {
        participants: {
          user: true,
        },
      },
    },
    order: {
      conversation: {
        lastMessageAt: "DESC",
      },
    },
  })
}

const cPRepositoryMenthods={addParticipants,findConversationBetweenUsers,getUserConversations}

export default cPRepositoryMenthods