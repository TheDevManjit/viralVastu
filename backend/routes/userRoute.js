import Express from 'express'
import { logIn, register, reVarify, varify,logOut, forgotPassword, varifyOtp, changePassword, allUsers, updateUser } from '../controllers/userController.js'
import isAuthenticated from '../middleware/isAuthenticated.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { singleUpload } from '../middleware/multer.js'

const router = Express.Router()

router.post("/register",register)
router.post("/login",logIn)
router.post("/varify",varify)
router.post("/revarify",reVarify)
router.post("/logout",isAuthenticated,logOut)
router.post("/forgotpassword",forgotPassword)
router.post("/varifyotp/:email",varifyOtp);
router.post("/changepassword/:email",changePassword);
router.get("/allusers",isAuthenticated,isAdmin,allUsers)
router.put("/update/:userId",isAuthenticated,singleUpload,updateUser)


export default router

