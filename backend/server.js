import Express from "express"
import "dotenv/config"
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import { errorHandler } from "./middleware/errorHandler.js"
import cors from 'cors'




const app = Express()
const PORT = process.env.PORT || 3000

// middleware

app.use(Express.json())
app.use(cors({
  origin: "http://localhost:5173", // frontend ka port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)

app.use(errorHandler)




// https://localhost:5000/api/v1/user/register


app.listen(PORT,()=>{
    connectDB()
    console.log(`Sever Ekdum Ok hai aur port ${PORT} hai`)
})