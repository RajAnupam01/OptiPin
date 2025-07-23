import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/connectDB.js"
import app from "./app.js"
PORT = 3000

const startServer = async()=>{
    try {
        await connectDB();
        const PORT = PORT || 8000
        app.listen(PORT,()=>{
            console.log(`🚀 Server is running at PORT: ${PORT}`)
        })
    } catch (error) {
        console.error("🚫 Server failed to connect",error)
    }
}

startServer()
