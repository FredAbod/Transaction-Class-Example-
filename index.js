import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
dotenv.config();

const port = 3000;

const server = app.listen(port, async ()=>{
    try {
        await connectDB(process.env.MONGODB_URL)
        console.log("Connected to database");
        console.log(`listening on http://localhost:${port}`);
    } catch (error) {
        console.log(error);
    }
})