import React, { useState, useEffect } from 'react'
import { addProduct } from '@/api/productApi'
import { TextField, Button, Card, CardContent, CardHeader, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import AddCategory from '@/components/AddCategory'
import { toast } from 'sonner'
import store from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { getAllProducts } from '@/api/productApi'
import { setProducts } from '@/redux/productSlice'
import { fetchCategories } from '@/redux/categorySlice'



function ProductAdd() {
    const { products } = useSelector(store => store.products)
    const { categories, loading, error } = useSelector(state => state.categories)
    const [enableCatEdit, setEnableCatEdit] = useState(false)
    // const [categoriesInput,setCategories] = useState([])
    const dispatch = useDispatch()


    const [form, setForm] = useState({
        productName: "",
        productDescription: "",
        productPrice: "",
        productOriginalPrice: "",
        productRating: "",
        productReviews: 0,
        productCategory: [],
        productBrand: "",
        productStock: "",
        isTrending: false,
    });


    const [files, setFiles] = useState([]);



    useEffect(() => {

        dispatch(fetchCategories())
        console.log(categories)

    }, [])



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : Array.isArray(value)  // for multiple select fields
                        ? value
                        : value,
        }));
    };





    const handleImageUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const previews = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            local: true,
            file
        }));
        setFiles(previews);
    };


    const handleRemoveImage = (index) => {
        setFiles((prev) => {
            const updated = [...prev];
            const removed = updated.splice(index, 1)[0];
            if (removed?.preview) URL.revokeObjectURL(removed.preview);
            return updated;
        });
    };



    useEffect(() => {
        return () => {
            files.forEach((item) => URL.revokeObjectURL(item.preview));
        };
    }, [files]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();

        fd.append("productName", form.productName);
        fd.append("productDescription", form.productDescription);
        fd.append("productPrice", form.productPrice);
        fd.append("productOriginalPrice", form.productOriginalPrice);
        fd.append("productRating", form.productRating);
        fd.append("productReviews", form.productReviews);
        form.productCategory.forEach(cat => fd.append("productCategory[]", cat));
        fd.append("productBrand", form.productBrand);
        fd.append("productStock", form.productStock);
        fd.append("isTrending", form.isTrending);


        console.log("FormData check:");
        for (let [key, val] of fd.entries()) console.log(key, val);


        files.forEach(({ file }) => fd.append("files", file));


        console.log(files)

        try {
            const res = await addProduct(fd);
            if (res.data.success) {
                toast.success("Product added successfully");
                // Reset form   
                setForm({
                    productName: "",
                    productDescription: "",
                    productPrice: "",
                    productOriginalPrice: "",
                    productRating: "",
                    productReviews: 0,
                    productCategory: [],
                    productBrand: "",
                    productStock: "",
                    isTrending: false,
                });
                setFiles([]);
                // Refresh product list

                try {
                    const res = await getAllProducts()
                    dispatch(setProducts(res.data.products));

                } catch (error) {
                    toast.error(error?.data?.message || "Unexpected error");
                }


            } else {
                toast.error(res.data.message || "Failed to add product");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };



    return (


        <div className='bg-white rounded-lg shadow-md p-4 relative'>
            <Card className="w-full  shadow-xl rounded-2xl ">
                <div className=''>
                    <CardHeader title="Add New Product" className="text-center relative" />

                    <div className={enableCatEdit ? 'flex w-full' : "hidden"}>
                        <AddCategory />
                    </div>
                    <div className='absolute right-15 top-3'>
                        <Button onClick={() => { setEnableCatEdit((prev) => !prev) }} variant="contained" className="!mt-4 !p-3 ">
                            Add Category
                        </Button>

                    </div>



                </div>

                <CardContent className=''>
                    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-1">

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Product Name"
                                fullWidth
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                            />

                            {
                                products.length > 0 && (
                                    <div>
                                        <FormControl fullWidth>
                                            <InputLabel>Categories</InputLabel>
                                            <Select
                                                name="productCategory"
                                                value={form.productCategory}
                                                onChange={handleChange}
                                                label="Category"
                                                multiple
                                            >
                                                {categories.map(cat => (
                                                    <MenuItem key={cat._id} value={cat.value}>{cat.label}</MenuItem>
                                                ))}
                                                <MenuItem value="custom">Add New Category</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </div>
                                )
                            }
                        </div>

                        <div>
                            <TextField
                                label="Description"
                                fullWidth
                                name="productDescription"
                                value={form.productDescription}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </div>



                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Price"
                                name="productPrice"
                                value={form.productPrice}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Original Price"
                                name="productOriginalPrice"
                                value={form.productOriginalPrice}
                                onChange={handleChange}
                            />
                        </div>


                        {/* BRAND / STOCK */}
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Brand"
                                name="productBrand"
                                value={form.productBrand}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Stock"
                                name="productStock"
                                type="number"
                                value={form.productStock}
                                onChange={handleChange}
                            />
                        </div>

                        {/* RATING / REVIEWS */}
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Rating"
                                name="productRating"
                                value={form.productRating}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Reviews"
                                name="productReviews"
                                type="number"
                                value={form.productReviews}
                                onChange={handleChange}
                            />
                        </div>

                        {/* TRENDING */}
                        <div className="flex items-center gap-3">
                            <label>Trending:</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={form.isTrending}
                                onChange={handleChange}
                            />
                        </div>

                        {/* IMAGES */}
                        <div>
                            <label className='cursor-pointer'>
                                Upload Images
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImageUpload}
                                    className='border cursor-pointer ms-14 rounded p-1 hidden '
                                />
                                <span className="text-gray-700 ms-4 border-2 p-2 rounded-lg hover:border-sky-600">
                                    {files.length === 0
                                        ? "Choose images"
                                        : `${files.length} image${files.length > 1 ? "s" : ""} selected`}
                                </span>
                            </label>

                            <div className="flex gap-2 mt-10 ">
                                {files.map((img, idx) => (
                                    <div className="relative" key={idx}>
                                        <img src={img.url} className="w-30 object-cover rounded-xl shadow" />

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-bl"
                                        >
                                            ✕
                                        </button>

                                    </div>


                                ))}
                            </div>
                        </div>

                        <Button type="submit" variant="contained" fullWidth className="!mt-4 !p-3">
                            Add Product
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ProductAdd;
