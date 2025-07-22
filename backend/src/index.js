import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoute from "./routes/Auth.route.js";
import UserRouter from "./routes/User.route.js";
import CategoryRoute from "./routes/Category.route.js";
import BlogRoute from "./routes/Blog.route.js";
import CommentRouote from "./routes/Comment.route.js";
import BlogLikeRoute from "./routes/Bloglike.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// route setup
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRouter);
app.use("/api/category", CategoryRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/comment",CommentRouote);
app.use("/api/blog-like",BlogLikeRoute);

app.listen(PORT, () => {
  console.log("server is running in port : " + PORT);
  connectDB();
});
