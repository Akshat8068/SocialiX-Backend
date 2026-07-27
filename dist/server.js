import express, {} from "express";
import dotenv from "dotenv";
import DBConnection from "./config/dbConfig.js";
// Route import
import authRoute from "./modules/auth/authRoute.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
await DBConnection();
app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
    res.status(200).json({
        sucess: true,
        message: "Socialix Backend"
    });
});
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map