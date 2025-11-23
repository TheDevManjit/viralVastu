import Express from 'express'
import { adminLogin } from '../controllers/adminContoller.js'

const router = Express.Router()


router.post("/admin-login",adminLogin)



export default router
