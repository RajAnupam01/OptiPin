import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser())


import { router as authRouter } from "./routes/auth.routes.js";
import { router as userRouter} from "./routes/user.routes.js";
import { router as pinRouter } from "./routes/pin.routes.js";
import {router as commentRouter} from "./routes/comment.routes.js"

app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/pins",pinRouter)
app.use("/api/comment",commentRouter)

export default app;