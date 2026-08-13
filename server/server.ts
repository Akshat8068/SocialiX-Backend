import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import DBConnection from "./config/db.config.js"
import coookieParser from "cookie-parser"
// Route import
import authRoute from "./modules/auth/auth.route.js"
import userRoute from "./modules/users/user.route.js"
import folowRoute from "./modules/follow/follow.route.js"
import postRoute from "./modules/post/post.route.js"
import hashTagRoute from "./modules/post/hashtag/hashTag.route.js"
import likeRoute from "./modules/like/like.route.js"
import commentRoute from "./modules/comment/comment.route.js"
import savedRoute from "./modules/saved/saved.route.js"
import chatRoutes from "./modules/chat/chat.route.js"
import { createServer } from "http"
import { initializeSocket } from "./config/socket.config.js"
import errorMiddleware from "./middlewares/error.middleware.js"


dotenv.config()

const app = express()
const port = process.env.PORT
await DBConnection()
const httpServer = createServer(app)
initializeSocket(httpServer)
app.use(
  cors({
    origin: ["https://sociali-x-frontend.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(coookieParser())

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/follow", folowRoute)
app.use("/api/post", postRoute)
app.use("/api/hashtag", hashTagRoute)
app.use("/api/likes", likeRoute)
app.use("/api/comment", commentRoute)
app.use("/api/saved", savedRoute)
app.use("/api/chat", chatRoutes)

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    sucess: true,
    message: "Socialix Backend"
  })
})
app.use(errorMiddleware)
httpServer.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
