import express from "express";
import { getWebSettings, updateWebSettings } from "../controllers/webSettingsController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Public route to fetch settings (e.g. for Home page)
router.get("/get", getWebSettings);

// Admin route to update settings (e.g. upload new hero image)
router.put("/update", isAuthenticated, isAdmin, singleUpload, updateWebSettings);

export default router;
