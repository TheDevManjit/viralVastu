import { Product } from "../models/ProductModel.js"
import cloudinary from "../utiles/cloudinary.js"
import { getDataUri } from "../utiles/dataUri.js"

const addProduct = async (req, res) => {


    try {

        const {
            productName,
            productDescription,
            productPrice,
            productOriginalPrice,
            productRating,
            productReviews,
            productCategory,
            productSubCategory,
            productBrand,
            productStock,
            isTrending,
        } = req.body;

        //  console.log(productName, productDescription, "Price", productPrice, productCategory, productStock)

        // console.log("productStock", productStock)


        if (!productName || !productDescription || !productPrice || !productCategory || !productStock) {
            return res.status(400).json({
                success: false,
                message: "Product name, description, price, stock and category are required",
            });
        }

        console.log("FILES:", req.files); // ✅ should log all uploaded images
        console.log("BODY:", req.body);

        console.log("Add Products routes works")



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
            productPrice,
            productOriginalPrice,
            productRating,
            productReviews,
            productCategory,
            productSubCategory,
            productBrand,
            productStock: Number(productStock),
            isTrending: isTrending === "true" || isTrending === true,
            productImg,
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: newProduct,
        });




    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find().sort({ createdAt: -1 });


        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            })
        }

        res.status(200).json({
            success: true,
            count: products.length,
            products: products,
        });

        // console.log(products)

    } catch (error) {
        res.status(500).json({ success: false, message: err.message });
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
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }


}

const updateProduct = async (req, res) => {
    try {

        const { id } = req.params
        const {
            productName,
            productDescription,
            productPrice,
            productOriginalPrice,
            productRating,
            productReviews,
            productCategory,
            productSubCategory,
            productBrand,
            productStock,
            isTrending,
            existingImage,
        } = req.body;


        // finding products

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        let images = product.productImg || [];

        if (existingImage) {
            const keepIds = JSON.parse(existingImage);
            const removed = images.filter(img => !keepIds.includes(img.public_id));
            for (const img of removed) {
                await cloudinary.uploader.destroy(img.public_id);
            }
            images = images.filter(img => keepIds.includes(img.public_id));
        }


        if (req.files?.length) {
            for (const file of req.files) {
                const fileUri = getDataUri(file);
                const upload = await cloudinary.uploader.upload(fileUri, {
                    folder: "ViralVastu/Product",
                });
                images.push({ public_id: upload.public_id, url: upload.secure_url });
            }
        }

        Object.assign(product, {
            ...(productName && { productName }),
            ...(productDescription && { productDescription }),
            ...(productPrice && { productPrice }),
            ...(productOriginalPrice && { productOriginalPrice }),
            ...(productRating && { productRating }),
            ...(productReviews && { productReviews }),
            ...(productCategory && { productCategory }),
            ...(productSubCategory && { productSubCategory }),
            ...(productBrand && { productBrand }),
            ...(productStock && { productStock }),
            ...(isTrending !== undefined && {
                isTrending: isTrending === "true" || isTrending === true,
            }),
            productImg: images,
        });

        await product.save()


        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
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

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}






export { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct }