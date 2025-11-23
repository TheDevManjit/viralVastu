import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { Session } from "../models/sessionModel.js";


async function adminLogin(req,res) {


    try {
        const { email, password } = req.body

        if (!email || !password) {
           return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
          return  res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        console.log("user is",user)

        if (user.role !== "admin") {
          return   res.status(403).json({
                success: false,
                message: "Admin only"
            })
        }

        const hashedPassword = user.password

        const isMatched = await  bcrypt.compare(password, hashedPassword);


        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: "password Not matched"

            })
        }

        if (user.isVarified === false) {
            return res.status(400).json({
                success: false,
                message: "PLese Varify your email for login"

            })
        }

        // generate token

        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' })

        user.isLoggedIn = true
        await user.save()

        // check for existing session
        const existingSession = await Session.findOne({ userId: user._id })

        if (existingSession) {
            await Session.deleteOne({ userId: user._id })
        }
        // creating new session
        await Session.create({ userId: user._id })

        res.status(200).json({
            success: true,
            message: `Welcome Back ${user.firstName}`,
            user: user,
            refreshToken,
            accessToken

        })




    } catch (error) {
       return res.status(400).json({
            success: false,
            message: error.message
        })
    }




}

export {adminLogin}