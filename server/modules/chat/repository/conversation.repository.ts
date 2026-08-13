import type { DeepPartial } from "typeorm";
import AppDataSource from "../../../config/app.DataSource.js";
import { Conversation } from "../entity/conversation.entity.js";

const conversationRepository = AppDataSource.getRepository(Conversation);

const createConversation = async (data: DeepPartial<Conversation>): Promise<Conversation> => {
  const conversation = conversationRepository.create(data)

  return await conversationRepository.save(conversation)
}
const findConversationById = async (id: number): Promise<Conversation | null> => {
  return await conversationRepository.findOne({
    where: {
      id,
    },
    relations: {
      participants: {
        user: true,
      },
      messages: true,
    },
  })
}

const updateConversation = async (data: DeepPartial<Conversation>): Promise<Conversation> => {
  return await conversationRepository.save(data)
}


const conversationRepositoryMethods={createConversation, findConversationById,updateConversation}

export default conversationRepositoryMethods