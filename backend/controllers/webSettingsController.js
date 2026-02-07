import { WebSettings } from "../models/webSettingsModel.js";
import { getDataUri } from "../utiles/dataUri.js";
import cloudinary from "../utiles/cloudinary.js";

// Fetch the current web settings (Public)
const getWebSettings = async (req, res) => {
    try {
        let settings = await WebSettings.findOne();

        if (!settings) {
            // If no settings exist yet, return defaults or create one
            settings = new WebSettings();
            await settings.save();
        }

        res.status(200).json({ success: true, settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch settings" });
    }
};

// Update web settings (Admin only)
const updateWebSettings = async (req, res) => {
    try {
        let settings = await WebSettings.findOne();
        if (!settings) {
            settings = new WebSettings();
        }

        const { heroImage } = req.body;
        const file = req.file;

        // If a file is uploaded, upload to Cloudinary and update heroImage
        if (file) {
            const fileUri = getDataUri(file);
            const mycloud = await cloudinary.uploader.upload(fileUri.content);
            settings.heroImage = mycloud.secure_url;
        }

        await settings.save();

        res.status(200).json({
            success: true,
            message: "Web settings updated successfully",
            settings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update settings" });
    }
};

export { getWebSettings, updateWebSettings };
