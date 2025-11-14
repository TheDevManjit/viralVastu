import { Product } from "../models/ProductModel.js"
import cloudinary from "../utiles/cloudinary.js"
import { getDataUri } from "../utiles/dataUri.js"

const addProduct = async (req, res) => {

    try {

        const { productName, productDescription, productPrice, category, brand, offers, tranding } = req.body

        if (!productName || !productDescription || !productPrice || !category) {

            return res.status(400).json({
                success: false,
                message: "Product name, description, image, price, category is required"
            })
        }

        let productImg = []
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "ViralVastu/Product"
                })
                productImg.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
        }

        const product = await Product.findOne({ productName })

        if (product) {
            return res.status(404).json({
                success: false,
                message: "Product already exists"
            })
        }

        const newProduct = await Product.create({
            productName,
            productDescription,
            productImg,
            productPrice,  // array of objects
            category,
            brand,
            offers,
            tranding
        })

        res.status(200).json({
            success: true,
            message: "Product Added Successfully",
            product: newProduct
        })





    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find({})
        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            })
        }

        res.status(200).json({
            success: true,
            products
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

const getProductById = async (req, res) => {
    try {

        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }


}

const updateProduct = async (req, res) => {
    try {

        const { id } = req.params
         const { productName,productDescription,productPrice,category,brand,offers,tranding,existingImage } = req.body
      

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        let updatedImages = []

        if (existingImage ) {
            const keepIds = JSON.parse(existingImage);
            updatedImages = product.productImg.filter(img => keepIds.includes(img.public_id));

           

            // delete removed images from cloudinary

            const removedImages = product.productImg.filter(img => !keepIds.includes(img.public_id));
            for (const img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id)
            }

        }else{

            updatedImages = product.productImg  // keep all images if none specified
        }
   
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "ViralVastu/Product"
                })
                updatedImages.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
        }

        product.productImg = updatedImages

        product.productName = productName || product.productName
        product.productDescription = productDescription || product.productDescription
        product.productPrice = productPrice || product.productPrice
        product.category = category || product.category
        product.brand = brand || product.brand
        product.offers = offers || product.offers
        product.tranding = tranding || product.tranding

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {   
        const { id } = req.params

        const product = await Product.findById(id)  
        if (!product) {
            return res.status(404).json({
                success: false, 
                message: "Product not found"
            })
        }   
        // delete images from cloudinary
        for (const img of product.productImg) {
            await cloudinary.uploader.destroy(img.public_id)
        }  

        await product.deleteOne()

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })  

    } catch (error) {
        return res.status(400).json({
            success: false, 
            message: error.message
        })
    }
}






export { addProduct, getAllProducts, getProductById,updateProduct,deleteProduct    }