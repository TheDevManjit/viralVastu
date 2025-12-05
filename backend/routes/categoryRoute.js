import Express from 'express'
import { addCategory,getCategories,removeCategory } from '../controllers/categoryController.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = Express.Router()

router.post("/add",isAuthenticated,addCategory)
router.delete("/remove/:id",isAuthenticated,removeCategory)
router.get("/get-all-category",isAuthenticated,getCategories)

export default router