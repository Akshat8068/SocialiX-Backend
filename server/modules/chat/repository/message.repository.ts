import type { DeepPartial } from "typeorm";
import AppDataSource from "../../../config/app.DataSource.js";
import { Message } from "../entity/message.entity.js";
const messageRepository=AppDataSource.getRepository(Message)


const createMessage = async (data: DeepPartial<Message>): Promise<Message> => {
  const message = messageRepository.create(data)
  return await messageRepository.save(message)
}

const findMessageById = async (id: number): Promise<Message | null> => {
  return await messageRepository.findOne({
    where: {
      id,
    },
    relations: {
      conversation: true,
      sender: true,
    },
  })
}

const getConversationMessages = async (conversationId: number): Promise<Message[]> => {
  return await messageRepository.find({
    where: {
      conversation: {
        id: conversationId,
      },
    },
    relations: {
      sender: true,
    },
    order: {
      createdAt: "ASC",
    },
  })
}

const markSeen = async (message: Message): Promise<Message> => {
  message.seenAt = new Date()
  return await messageRepository.save(message)
}
const markConversationMessagesAsSeen = async (
  conversationId: number,
  userId: number
) => {
  const seenAt = new Date();

  await messageRepository
    .createQueryBuilder()
    .update()
    .set({
      seenAt,
    })
    .where(
      "conversation_id = :conversationId",
      { conversationId }
    )
    .andWhere(
      "sender_id != :userId",
      { userId }
    )
    .andWhere(
      "seen_at IS NULL"
    )
    .andWhere(
      "is_deleted_for_everyone = false"
    )
    .execute();

  return seenAt;
};

const deleteForEveryone = async (messageId: number): Promise<void> => {
  await messageRepository.delete(messageId)
}

const messageRepositoryMethods = {createMessage,markConversationMessagesAsSeen,findMessageById,
  getConversationMessages,markSeen,deleteForEveryone,}

export default messageRepositoryMethods