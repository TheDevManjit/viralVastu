import mongoose from "mongoose";

const webSettingsSchema = new mongoose.Schema({
    heroImage: {
        type: String,
        default: "", // Default to empty or a placeholder URL
    },
    // We can add more settings here later (e.g., siteTitle, contactEmail)
}, { timestamps: true });

export const WebSettings = mongoose.model("WebSettings", webSettingsSchema);
