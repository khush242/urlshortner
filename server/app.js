import express from "express"
import cors from "cors"
import redisClient , {connectRedis} from "./cache/radis_client.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import userRoute from "./routes/user.route.js"
import urlRoute from "./routes/url.route.js"

dotenv.config()
const app = express()


app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.get("", (req, res) =>{
    res.send("hello")
} )

app.get("/test", async(req, res) => {
 await redisClient.set("ping", "pong");
 const value = await redisClient.get("ping");
 res.send(value);
})

app.use("/api/auth",userRoute)
app.use("/api/urls", urlRoute)

await connectRedis();
export default app