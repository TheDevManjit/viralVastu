import { json } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"


const isAuthenticated = async (req, res , next) => {

    try {
        const authHeader = req.headers.authorization
        
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return  res.status(400).json({
            success: false,
            message: " Authorization token is missing or invalid"
        })
    }

    const token = authHeader.split(" ")[1]
    let decoded

    try {
       decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        if (error === "TokenExpiredError") {
            res.status(400).json({
                success: false,
                message: " The registraction token has expired"
            })
        }

        return res.status(400).json({
            success: false,
            message: "access token is missing or invalid"
        })
    }
     
    const user = await User.findById(decoded.id)

    if(!user){
         res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    
    req.user = user
    req.id = user._id
    next()

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }


}

export default isAuthenticated