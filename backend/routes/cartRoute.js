import { addToCart, getCart,removeItem,clearCart } from "../controllers/cartController.js";
import Express from 'express'
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Express.Router()


router.post("/add-to-cart",isAuthenticated,addToCart)
router.get("/get-cart",isAuthenticated,getCart)
router.post("/remove",isAuthenticated,removeItem)
router.post("/clear-cart",isAuthenticated,clearCart)



export default router
