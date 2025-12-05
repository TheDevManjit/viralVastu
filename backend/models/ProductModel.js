import mongoose, { disconnect } from 'mongoose'



const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productImg: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        }
    ],
    productPrice: { type: String },
    productOriginalPrice: { type: String },
    productRating: { type: String },
    productReviews: { type: Number },
    categories: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Category" } // 👈 multiple categories
    ],
    productBrand: { type: String },
    productStock: { type: Number },
    isTrending: {
        type: Boolean,
        default: false,
    }
});



export const Product = mongoose.model("Product", productSchema)