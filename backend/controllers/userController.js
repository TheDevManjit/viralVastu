import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { forgotPassLink } from "../emailvarify/forgotPassLink.js";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailvarify/sendOtpMail.js";
import e, { json } from "express";
import cloudinary from "../utiles/cloudinary.js";
import otpGenerator from "otp-generator";



const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })

        if (user) {
            res.status(400).json({
                success: false,
                message: "User already exits"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,

        })


        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });


        sendOtpMail(otp, email)



        newUser.otp = otp
        newUser.otpExpiry = new Date(Date.now() + 60 * 1000)
        await newUser.save()

        return res.status(201).json({
            success: true,
            message: "Otp send Successfully",
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,

        })
    }
}

const varifyOtp = async (req, res) => {

    try {
        const { otp } = req.body
        const { email } = req.params

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Please Enter Opt "
            })
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required"
            })
        }

        //  console.log(email)
        const user = await User.findOne({ email })
        //   console.log(user)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "Otp not generated or expired"
            });
        }

        if (user.otpExpiry < new Date()) {
            await User.findByIdAndUpdate(user._id, { otp: null });
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new one."
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP mismatched"
            });
        }



        // implimenting auto login


        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' })

        user.isVarified = true
        user.otp = null
        user.otpExpiry = null
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
            message: "OTP verified successfully! Logged in automatically.",
            refreshToken,
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });



    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }


}

const resendOtp = async (req, res) => {
    try {

        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // generate new OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        sendOtpMail(otp, user.email)

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await user.save();

        res.json({
            success: true,
            message: "OTP resent successfully",
        });



    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP" });
    }
}

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User Not exits"

            })
        }

        const isMatched = await bcrypt.compare(password, user.password);


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
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const logOut = async (req, res) => {
    try {

        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })

        return res.status(200).json({
            success: true,
            message: 'user logged out succesfully'
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Enter Valid Email"
            })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' })




        existingUser.token = accessToken
        await existingUser.save()

        forgotPassLink(accessToken, email)


        return res.status(200).json({
            success: true,
            message: `otp send successfully on ${existingUser.email} and expire in 10 minutes`
        })



    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const changePassword = async (req, res) => {

    const { newPassword, confirmNewPassword } = req.body

    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(400).json({
                success: false,
                message: "token is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1]           // just token
        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.message === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The Reg token has expired"
                })
            }

            return res.status(400).json({
                success: false,
                message: "Token varification failed"
            })
        }

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "USer not found"
            })
        }

        if (!newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are requird"
            })
        }

        //  console.log(email)

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Password mismathched"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword

        user.token = null
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })




    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const reVarify = async (req, res) => {
    try {

        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User Not exits"

            })
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        varifyEmail(token, email)             // sending email
        user.token = token
        // await user.save()

        return res.status(200).json({
            success: true,
            message: "varification mail send again successfully",
            token: user.token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const NAN = async (req, res) => {
    try {
        const { newPassword, confirmNewPassword } = req.body
        const { email } = req.params

        const user = await User.findOne({ email })

        if (!newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are requird"
            })
        }

        //  console.log(email)

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Password mismathched"
            })
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });


        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })





    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const allUsers = async (req, res) => {

    try {

        const users = await User.find()

        // console.log(users)

        return res.status(200).json({
            success: true,
            message: "All users fetch successfullt",
            users: users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = User.findById(userId).select("-password -otp -otpExpiry -token")

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200), json({
            success: true,
            message: "user fatched successfully"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateUser = async (req, res) => {

    try {
        const userIdToUpdate = req.params.userId
        const loggedInUser = req.user


        const { firstName, lastName, address, city, zipcode, phoneNo, role, email } = req.body;

        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== 'admin'
        ) {
            console.log(userIdToUpdate)
            return res.status(401).json({
                success: false,
                message: "You are not authorised for this change",
            });
        }


        const user = await User.findById(userIdToUpdate)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            })
        }

        let profilePicUrl = user.profilePic
        let profilePicPublicId = user.profilePicPublicId

        // new file uploaf


        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId)
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profile" },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )

                stream.end(req.file.buffer)
            })

            profilePicUrl = uploadResult.secure_url
            profilePicPublicId = uploadResult.public_id
        }


        // setting updates

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (address) user.address = address
        if (city) user.city = city
        if (zipcode) user.zipcode = zipcode
        if (email) user.email = email
        if (phoneNo) user.phoneNo = phoneNo
        if (role) user.role = role
        user.profilePic = profilePicUrl
        user.profilePicPublicId = profilePicPublicId



        const updatedUser = await user.save()

        return res.status(200).json({
            success: true,
            message: "user update succesfully",
            user: updatedUser
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }


}

export { register, logIn, reVarify, logOut, resendOtp, forgotPassword, varifyOtp, changePassword, allUsers, updateUser }