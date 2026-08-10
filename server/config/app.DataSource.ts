import "reflect-metadata"
import { DataSource} from "typeorm"
import dotenv from "dotenv"
import { User } from "../entities/user.entity.js"
import { Otp } from "../entities/otp.entity.js"
import { Follow } from "../entities/follow.entity.js"
import { Post } from "../entities/post.entity.js"
import { PostMedia } from "../modules/post/postMedia.entity.js"
import { Hashtag } from "../modules/post/hashTag.entity.js"
import { PostHashTag } from "../modules/post/postHashTag.entity.js"
import { Like } from "../entities/like.entity.js"
import { Comment} from "../entities/comment.entity.js"
import { SavedPost } from "../entities/saved.entity.js"
import { Message } from "../entities/message.entity.js"
import { Conversation } from "../entities/conversation.entity.js"
import { ConversationParticipant } from "../entities/ConversationParticipant.entity.js"
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
    entities: [User, Otp,Follow,Post,PostMedia,Comment,Hashtag,Conversation,ConversationParticipant,PostHashTag,SavedPost,Message,Like],
    migrations: [],
    subscribers: [],
    ssl: {
    rejectUnauthorized: false,
}
})

export default AppDataSource
