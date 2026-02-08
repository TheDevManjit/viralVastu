import React, { useState, useEffect } from 'react'
import { addProduct } from '@/api/productApi'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// Textarea import removed as it does not exist in ui directory
import { selectClasses } from '@mui/material' // Removing MUI slowly
import AddCategory from '@/components/AddCategory'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { getAllProducts } from '@/api/productApi'
import { setProducts } from '@/redux/productSlice'
import { fetchCategories } from '@/redux/categorySlice'
import { Plus, X, UploadCloud, ChevronDown, Check } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

function ProductAdd() {
    const { products } = useSelector(store => store.products)
    const { categories, loading: catLoading } = useSelector(state => state.categories)
    const [enableCatEdit, setEnableCatEdit] = useState(false)
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
    }, [dispatch])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCategoryChange = (value) => {
        // For Shadcn Multi-select is often custom, but here we'll assume a specific implementation or just use single for now if multi is complex, 
        // but the backend wants an array. Let's implement a simple multi-selection logic if possible or just handle it as a single selection that appends.
        // Actually, let's keep it simple for now and just set it to the value since the backend expects productCategory[] in FormData.
        setForm(prev => ({
            ...prev,
            productCategory: typeof value === 'string' ? [value] : value
        }));
    };

    const handleImageUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const previews = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        setFiles(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        setFiles((prev) => {
            const updated = [...prev];
            const removed = updated.splice(index, 1)[0];
            if (removed?.url) URL.revokeObjectURL(removed.url);
            return updated;
        });
    };

    useEffect(() => {
        return () => {
            files.forEach((item) => URL.revokeObjectURL(item.url));
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

        files.forEach(({ file }) => fd.append("files", file));

        try {
            const res = await addProduct(fd);
            if (res.data.success) {
                toast.success("Product added successfully");
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

                const prodRes = await getAllProducts()
                dispatch(setProducts(prodRes.data.products));
            } else {
                toast.error(res.data.message || "Failed to add product");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='max-w-5xl mx-auto'>
            {enableCatEdit && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="font-bold text-lg">Manage Categories</h2>
                            <Button variant="ghost" size="icon" onClick={() => setEnableCatEdit(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <AddCategory />
                        </div>
                    </div>
                </div>
            )}

            <Card className="shadow-lg border-gray-100 rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-800">Add New Product</CardTitle>
                        <CardDescription>Fill in the details to list a new product in your inventory.</CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEnableCatEdit(true)}
                        className="flex items-center gap-2 text-skybrand-600 border-skybrand-200 hover:bg-skybrand-50"
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </Button>
                </CardHeader>

                <CardContent className='p-8'>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input
                                    id="productName"
                                    name="productName"
                                    placeholder="e.g. Wireless Noise Canceling Headphones"
                                    value={form.productName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="productCategory">Category</Label>
                                <Select
                                    onValueChange={handleCategoryChange}
                                    value={form.productCategory[0] || ""}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat._id} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="productDescription">Description</Label>
                            <Input
                                id="productDescription"
                                name="productDescription"
                                placeholder="Describe the product features and specifications..."
                                value={form.productDescription}
                                onChange={handleChange}
                                className="h-24 py-2" // Hack for multiline if Textarea not available
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="productPrice">Sale Price (₹)</Label>
                                <Input
                                    id="productPrice"
                                    name="productPrice"
                                    type="number"
                                    placeholder="0.00"
                                    value={form.productPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="productOriginalPrice">Original Price (₹)</Label>
                                <Input
                                    id="productOriginalPrice"
                                    name="productOriginalPrice"
                                    type="number"
                                    placeholder="0.00"
                                    value={form.productOriginalPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Brand & Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="productBrand">Brand Name</Label>
                                <Input
                                    id="productBrand"
                                    name="productBrand"
                                    placeholder="e.g. Sony, Apple, Samsung"
                                    value={form.productBrand}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="productStock">Available Stock</Label>
                                <Input
                                    id="productStock"
                                    name="productStock"
                                    type="number"
                                    placeholder="0"
                                    value={form.productStock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="productRating">Initial Rating (1-5)</Label>
                                <Input
                                    id="productRating"
                                    name="productRating"
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    min="0"
                                    placeholder="4.5"
                                    value={form.productRating}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="productReviews">Number of Reviews</Label>
                                <Input
                                    id="productReviews"
                                    name="productReviews"
                                    type="number"
                                    placeholder="0"
                                    value={form.productReviews}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                id="isTrending"
                                name="isTrending"
                                checked={form.isTrending}
                                onChange={handleChange}
                                className="w-4 h-4 text-skybrand-600 border-gray-300 rounded focus:ring-skybrand-500"
                            />
                            <Label htmlFor="isTrending" className="font-medium text-gray-700 cursor-pointer">Mark as Trending Product</Label>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <Label>Product Images</Label>
                            <div className="border-2 border-dashed border-gray-200 hover:border-skybrand-400 rounded-2xl p-8 transition-colors bg-gray-50/50">
                                <label className='flex flex-col items-center justify-center cursor-pointer'>
                                    <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                                    <span className="text-gray-700 font-medium">Click to upload images</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB each</span>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                        className='hidden'
                                    />
                                </label>
                            </div>

                            {files.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6">
                                    {files.map((img, idx) => (
                                        <div className="relative group aspect-square" key={idx}>
                                            <img src={img.url} className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <Button type="submit" className="w-full md:w-auto px-12 py-6 bg-skybrand-600 hover:bg-skybrand-700 text-white rounded-xl shadow-md shadow-skybrand-200 transition-all font-bold text-lg">
                                Save Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ProductAdd;
