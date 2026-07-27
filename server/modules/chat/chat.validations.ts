import { z } from "zod"

export const joinConversationSchema = z.object({
  conversationId: z
    .number()
    .int()
    .positive(),
})

export const sendMessageSchema = z.object({
  conversationId: z
    .number()
    .int()
    .positive(),

  receiverId: z
    .number()
    .int()
    .positive(),

  content: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
})
export const typingSchema = z.object({
  conversationId: z
    .number()
    .int()
    .positive()
})

export const markSeenSchema = z.object({
  conversationId: z
    .number()
    .int()
    .positive(),

  messageId: z
    .number()
    .int()
    .positive(),
})

export const deleteForEveryoneSchema = z.object({
  conversationId: z
    .number()
    .int()
    .positive(),

  messageId: z
    .number()
    .int()
    .positive()
})


