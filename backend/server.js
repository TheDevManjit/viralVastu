import Express from "express"
import "dotenv/config"
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import adminRoute from "./routes/adminRoute.js"
import cartRoute from "./routes/cartRoute.js"
import { errorHandler } from "./middleware/errorHandler.js"
import cors from 'cors'
import categoryRouter from './routes/categoryRoute.js'



const app = Express()
const PORT = process.env.PORT || 3000

// middleware

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://127.0.0.1:5173",
// ];


// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use(cors());


app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/admin",adminRoute)
app.use("/api/v1/cart",cartRoute)

app.use(errorHandler)




// https://localhost:5000/api/v1/user/register


app.listen(PORT,()=>{
    connectDB()
    console.log(`Sever Ekdum Ok hai aur port ${PORT} hai`)
})