
import type { Socket } from "socket.io"
import type {  Comment  } from "../entities/comment.entity.js"
export interface register{
    fullname:string,
    email:string,
    username:string,
    password:string
}

export interface login{
    email:string,
    password:string
}

export interface CreateOtp {
    userId: number,
    otp: string,
    expiresAt: Date
}

export interface VerifyOtp {
    userId: number,
    otp: string,
}

export interface userProfile {
  fullname?: string,
  username?:string,
  bio?: string,
  website?: string,
  accountType?: "PUBLIC" | "PRIVATE",
  professionalAccount?: boolean
}
export enum FollowStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export interface CreateFollow {
  followerId: number,
  followingId: number,
  status: FollowStatus
}

export interface FollowResponse {
  id: number,
  followerId: number,
  followingId: number,
  status: FollowStatus,
  createdAt: Date
}

export const FOLLOW_MESSAGES = {
  FOLLOWED: "User followed successfully.",
  REQUEST_SENT: "Follow request sent successfully.",
  UNFOLLOWED: "User unfollowed successfully.",
  REQUEST_ACCEPTED: "Follow request accepted.",
  REQUEST_REJECTED: "Follow request rejected.",
  REQUEST_CANCELLED: "Follow request cancelled.",
  FOLLOWER_REMOVED: "Follower removed successfully.",
}
export const FOLLOW_ERRORS = {
  SELF_FOLLOW: "You can't follow and Unfollow and not sent Follow Request yourself.",
  ALREADY_FOLLOWING: "You are already following this user.",
  REQUEST_ALREADY_SENT: "Follow request already sent.",
  FOLLOW_NOT_FOUND: "Follow relationship not found.",
  USER_NOT_FOUND:"User Not Found",
  PENDING_REQ:"Your Req is Pending"
}
export enum PostVisibility {
  PUBLIC = "PUBLIC",
  FOLLOWERS = "FOLLOWERS",
  FRIENDS = "FRIENDS",
}

export interface CreatePost {
  caption?: string,
  visibility?: PostVisibility,
  hashtags?: number[]
}

export interface UpdatePost {
  caption?: string,
  visibility?: PostVisibility,
  hashtags?: number[]
}

export type CommentNode = Comment & {
  replies: CommentNode[]
}

export enum MessageStatus {
  UNREAD = "UNREAD",
  SEEN = "SEEN",
}

export interface JoinConversationPayload {
  conversationId: number
}

export interface SendMessagePayload {
  conversationId: number,
  receiverId: number,
  content: string
}

export interface TypingPayload {
  conversationId: number,
}

export interface MarkSeenPayload {
  conversationId: number,
  messageId: number
}

export interface DeleteForEveryonePayload {
  conversationId: number,
  messageId: number
}

export interface RegisterPayload {
  userId: number
}

export interface AuthenticatedSocket extends Socket {
  user: {
    id: number;
  };
}