import type { Server, Socket } from "socket.io"
import messageRepositoryMethods from "../../repository/message.repository.js"
import { onlineUsers } from "../../config/socket.config.js"
import conversationRepositoryMethods from "../../repository/conversation.repository.js"
import type { AuthenticatedSocket, DeleteForEveryonePayload, JoinConversationPayload, MarkSeenPayload, SendMessagePayload, TypingPayload } from "../../types/types.js"
import userRepositoryMethods from "../../repository/user.repository.js"
import cPRepositoryMenthods from "../../repository/conversationParticpant.repository.js"
import type { Request, Response } from "express"

const joinConversation = async (io: Server, socket: Socket, data: JoinConversationPayload) => {
  const { conversationId } = data
  const roomName = `conversation-${conversationId}`

  socket.join(roomName)


  socket.emit("joinedConversation", {
    conversationId,
    message: "Joined conversation successfully",
  })
}

const sendMessage = async (io: Server, socket: Socket, data: SendMessagePayload) => {

  const senderId = (socket as AuthenticatedSocket).user.id

  const { conversationId, content, } = data
  const createdMessage = await messageRepositoryMethods.createMessage({
    conversation: {
      id: conversationId,
    },
    sender: {
      id: senderId,
    },
    content,
    seenAt: null,
    isDeletedForEveryone: false,
    deletedAt: null,
  })


  const message = await messageRepositoryMethods.findMessageById(
    createdMessage.id
  )
  if (!message) {
    return
  }
  await conversationRepositoryMethods.updateConversation({
    id: conversationId,
    lastMessage: content,
    lastMessageAt: new Date(),
  })

  io.to(`conversation-${conversationId}`).emit("newMessage", {
    ...message,
    conversationId,
  })
}
const typingStart = async (io: Server, socket: Socket, data: TypingPayload) => {
  const userId = (socket as AuthenticatedSocket).user.id
  const user = await userRepositoryMethods.findById(userId)
  const username = user?.username
  const { conversationId } = data
  socket.to(`conversation-${conversationId}`).emit("userTyping",
    {
      conversationId,
      userId,
      username,
      isTyping: true,
    })
}
const typingStop = async (
  io: Server,
  socket: Socket,
  data: TypingPayload) => {
  const userId = (socket as AuthenticatedSocket).user.id
  const user = await userRepositoryMethods.findById(userId)
  const username = user?.username
  const { conversationId } = data
  socket.to(`conversation-${conversationId}`)
    .emit(
      "userTyping",
      {
        conversationId,
        userId,
        username,
        isTyping: false,
      })
}
const markSeen = async (
  io: Server,
  socket: Socket,
  data: MarkSeenPayload
) => {
  const userId =
    (socket as AuthenticatedSocket).user.id

  const { conversationId } = data;

  const seenAt =
    await messageRepositoryMethods
      .markConversationMessagesAsSeen(
        conversationId,
        userId
      );

  socket
    .to(`conversation-${conversationId}`)
    .emit("conversationSeen", {
      conversationId,
      userId,
      seenAt,
    })

}
const deleteForEveryone = async (io: Server,
  socket: Socket,
  data: DeleteForEveryonePayload) => {
  const userId = (socket as AuthenticatedSocket).user.id
  const { messageId, conversationId } = data
  const message = await messageRepositoryMethods.findMessageById(messageId)
  if (!message) {
    return socket.emit(
      "error",
      {
        message: "Message not found"
      }
    )
  }

  if (message.sender.id !== userId) {

    return socket.emit(
      "error",
      {
        message: "You cannot delete this message"
      }
    )
  }

  await messageRepositoryMethods.deleteForEveryone(message.id)
  io.to(`conversation-${conversationId}`).emit("messageDeleted", {
    conversationId,
    messageId,
  })
}
const disconnect = async (io: Server, socket: Socket) => {
  let disconnectedUserId: number | null = null
  for (const [userId, socketId] of onlineUsers.entries()) {
    if (socketId === socket.id) {
      disconnectedUserId = userId
      break
    }
  }
  if (disconnectedUserId) {
    onlineUsers.delete(disconnectedUserId)
    console.log(
      `User ${disconnectedUserId} is offline`
    )
    io.emit(
      "userOffline",
      {
        userId: disconnectedUserId,
        lastSeen: new Date(),
      }
    )
  }
}
const getConversationMessages = async (
  req: Request,
  res: Response
) => {
  const conversationId = Number(req.params.conversationId);

  if (isNaN(conversationId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid conversation id",
    });
  }

  const messages =
    await messageRepositoryMethods.getConversationMessages(
      conversationId
    );

  return res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    data: messages,
  });

};

const getUserConversations = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id

  const conversations =
    await cPRepositoryMenthods.getUserConversations(
      userId
    );

  return res.status(200).json({
    success: true,
    message: "Conversations fetched successfully",
    data: conversations,
  })
}
const createConversation = async (
  req: Request,
  res: Response
) => {

  const senderId = req.user.id;

  const { receiverId } = req.body;


  if (!receiverId) {
    return res.status(400).json({
      success: false,
      message: "Receiver id is required",
    });
  }


  if (senderId === receiverId) {
    return res.status(400).json({
      success: false,
      message: "Cannot create conversation with yourself",
    });
  }


  // Check existing conversation
  const existingConversation =
    await cPRepositoryMenthods.findConversationBetweenUsers(senderId,
      receiverId
    );


  if (existingConversation) {

    return res.status(200).json({
      success: true,
      message: "Conversation already exists",
      data: {
        conversationId: existingConversation.conversation.id,
      },
    });
  }


  // Create Conversation
  const conversation =
    await conversationRepositoryMethods.createConversation({})
  // Add participants
  await cPRepositoryMenthods.addParticipants([
    {
      conversation: {
        id: conversation.id,
      },
      user: {
        id: senderId,
      },
    },
    {
      conversation: {
        id: conversation.id,
      },
      user: {
        id: receiverId,
      },
    },
  ]);



  return res.status(201).json({
    success: true,
    message: "Conversation created successfully",
    data: {
      conversationId: conversation.id,
    },
  });




}



const chatController = { joinConversation, createConversation, getUserConversations, getConversationMessages, disconnect, deleteForEveryone, markSeen, typingStart, typingStop, sendMessage }
export default chatController