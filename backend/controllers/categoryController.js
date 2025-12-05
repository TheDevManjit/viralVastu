import { Category } from "../models/categoryModel.js"


const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        res.status(200).json({
            success: true,
            data: categories
        })  
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addCategory = async (req, res) => {
    

    try {
        const { label, value } = req.body
        console.log(label,value)

        if (!value?.trim() || !label?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Both label and value are required."
            });
        }

        const newCategory = await Category.create({ label, value });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeCategory = async (req, res) => {

    try {

        const { id } = req.params

        if (id === undefined || !id) {
            res.status(400).json({
                success: false,
                message: "Id is undefined Or NOt Found"
            })
        }

        const category = await Category.findOne({_id:id})

        console.log(category)

        if (!category || category.length <= 0) {
            res.status(400).json({
                success: false,
                message: "Id is undefined Or NOt Found"
            })
        }

        await category.deleteOne();

        res.status(201).json({
            success: true,
            message: "Category deleted successfully",
            
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export { addCategory, removeCategory,getCategories }