import { addToCart, getCart,removeItem } from "../controllers/cartController.js";
import Express from 'express'
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Express.Router()


router.post("/add-to-cart",isAuthenticated,addToCart)
router.get("/get-cart",isAuthenticated,getCart)
router.post("/remove",isAuthenticated,removeItem)


export default router
