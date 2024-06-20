import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import authRoute from "./routes/auth.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { ERROR_UNKNOWN } from './utils/constants.js';

const app = express();
dotenv.config();
mongoose.set('strictQuery', true);

const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(`Error connecting to DB: ${error}`);
    }
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMsg = err.message || ERROR_UNKNOWN;
    return res.status(errorStatus).send(errorMsg);
});
app.listen(8801, () => {
    connect();
    console.log("Backend server is running");
})