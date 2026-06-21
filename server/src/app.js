import express from "express"
import cors from "cors"
import dns from "dns"
import cookieParser from "cookie-parser"
dns.setServers(["1.1.1.1","0.0.0.0"])
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
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