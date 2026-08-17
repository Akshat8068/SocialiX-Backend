import "reflect-metadata"
import { DataSource} from "typeorm"
import dotenv from "dotenv"
import { User } from "../modules/users/user.entity.js"
import { Otp } from "../modules/auth/otp.entity.js"
import { Follow } from "../modules/follow/follow.entity.js"
import { Post } from "../modules/post/post.entity.js"
import { PostMedia } from "../modules/post/postMedia/postMedia.entity.js"
import { Comment } from "../modules/comment/comment.entity.js"
import { Hashtag } from "../modules/post/hashtag/hashTag.entity.js"
import { Conversation } from "../modules/chat/entity/conversation.entity.js"
import { ConversationParticipant } from "../modules/chat/entity/ConversationParticipant.entity.js"
import { PostHashTag } from "../modules/post/postHashTag.entity.js"
import { SavedPost } from "../modules/saved/saved.entity.js"
import { Message } from "../modules/chat/entity/message.entity.js"
import { Like } from "../modules/like/like.entity.js"
import { Notification } from "../modules/notification/notification.entity.js"

dotenv.config()

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,

    synchronize: true,
    logging: false,
    entities: [User, Otp,Follow,Post,PostMedia,Comment,Hashtag,Conversation,
        ConversationParticipant,PostHashTag,SavedPost,Message,Like,Notification],
    migrations: [],
    subscribers: [],
    ssl: {
    rejectUnauthorized: false,
}
})

export default AppDataSource
