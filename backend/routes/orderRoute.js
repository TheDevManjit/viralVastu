import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { verifyPayment } from "../controllers/orderController.js";
import { fetchOrders } from "../controllers/orderController.js";
import { fetchOrderDetails, getAllOrders, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";
import isAuthenticated from '../middleware/isAuthenticated.js'


import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify", isAuthenticated, verifyPayment);
router.get("/fetch-orders", isAuthenticated, fetchOrders);
router.get("/fetch-order/:orderId", isAuthenticated, fetchOrderDetails);
router.put("/cancel/:id", isAuthenticated, cancelOrder);

// Admin Routes
router.get("/admin/all-orders", isAuthenticated, isAdmin, getAllOrders);
router.put("/admin/update-status/:id", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
