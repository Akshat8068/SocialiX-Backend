import type { DeepPartial } from "typeorm";
import AppDataSource from "../config/app.DataSource.js";
import { Message } from "../entities/message.entity.js";

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

const deleteForEveryone = async (message: Message): Promise<Message> => {
  message.isDeletedForEveryone = true
  message.deletedAt = new Date()

  return await messageRepository.save(message)
}

const messageRepositoryMethods = {createMessage,findMessageById,
  getConversationMessages,markSeen,deleteForEveryone,}

export default messageRepositoryMethods