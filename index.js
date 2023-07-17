import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/user.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
app.use(bodyParser.json());
dotenv.config();

const DB_KEY = process.env.DB_KEY;
async function connectToDatabase() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_KEY}@userscluster.wjg7rh6.mongodb.net/`);
        console.log("DB connected");
    } catch (error) {
        console.log("DB connection error", error);
    }
}
connectToDatabase();

app.use("/auth", authRoute);
app.use(express.json());

app.listen(8000, () => {
    console.log("connected to backend.");
});
