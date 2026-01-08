import app from "./app.js";
import dotenv from "dotenv"
import "./cache/syncData.js"
import { connectDb } from "./db/index.js";
dotenv.config()

const port = process.env.PORT | 8080

connectDb().then(res => {
  app.listen(port , () => {
    console.log("Listening on port 8080")
}) 
}).catch(err => {
    console.error("db connection failed ", err)
})
