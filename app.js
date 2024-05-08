import express from "express";
import morgan from "morgan";
import userRouter from "./src/routes/user.Routes.js"

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.send("Welcome To Our Wallet App")
})

app.use('/api', userRouter)

export default app;