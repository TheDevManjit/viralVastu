import Express from 'express'
import { addProduct } from '../controllers/productController.js'
import isAuthenticated from '../middleware/isAuthenticated.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { multipleUpload } from '../middleware/multer.js'
import { getAllProducts ,getProductById,updateProduct,deleteProduct } from '../controllers/productController.js'


const router = Express.Router()

router.post("/add",isAuthenticated,isAdmin,multipleUpload,addProduct)
router.get("/allproducts",getAllProducts)
router.get("/product/:id",getProductById)
router.put("/update/:id",isAuthenticated,isAdmin,multipleUpload,updateProduct)
router.delete("/delete/:id",isAuthenticated,isAdmin,deleteProduct)


export default router

