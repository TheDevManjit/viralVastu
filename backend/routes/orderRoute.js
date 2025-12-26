import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { verifyPayment } from "../controllers/orderController.js";
import isAuthenticated from '../middleware/isAuthenticated.js'


const router = express.Router();

router.post("/create-order",isAuthenticated, createOrder);
router.post("/verify",isAuthenticated,verifyPayment);

export default router;
