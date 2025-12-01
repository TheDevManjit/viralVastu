import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById, updateProduct } from '@/api/productApi'
import { TextField, Button, Card, CardContent, CardHeader } from "@mui/material"
import { toast } from 'sonner'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';


function ProductUpdate() {
  const { id } = useParams();
  const { products } = useSelector(store => store.products);

  const [product, setProduct] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [customCategory, setCustomCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [currentSubCategories, setCurrentSubCategories] = useState([]);
  const [existingImage, setExistingImage] = useState([]);
  const [files, setFiles] = useState([]);


  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productOriginalPrice: "",
    productRating: "",
    productReviews: 0,
    productCategory: "",
    productSubCategory: "",
    productBrand: "",
    productStock: "",
    isTrending: false,
    productImg: [],
  });


  useEffect(() => {
    if (products && products.length > 0) {
      const categories = [...new Set(products.map(p => p.productCategory))]
      setCategoryOptions(categories)
      console.log(categories)

    }
  }, [products])

  useEffect(() => {
    if (form.productCategory && products.length > 0) {
      const filtered = products.filter(
        p => p.productCategory === form.productCategory
      );
      const subCats = [...new Set(filtered.map(p => p.productSubCategory))];
      setCurrentSubCategories(subCats);

      if (!subCats.includes(form.productSubCategory)) {
        setForm(prev => ({ ...prev, productSubCategory: "" }));
      }
    } else {
      // If user resets category to "All"
      const allSubs = [...new Set(products.map(p => p.productSubCategory))];
      setCurrentSubCategories(allSubs);
      if (!allSubs.includes(form.productSubCategory)) {
        setForm(prev => ({ ...prev, productSubCategory: "" }));
      }

    }
  }, [form.productCategory, products]);



  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(id);
      setProduct(res.data.product);

      console.log(res.data.product)
      // Fill form
      setForm({
        ...res.data.product,
        productImg: res.data.product.productImg, // only actual cloud images
      });

      // Store cloudinary ids for backend
      setExistingImage(res.data.product.productImg.map(img => img.public_id));
    };

    fetchProduct();
  }, [id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };


  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // new files
    setFiles(prev => [...prev, ...selectedFiles]);

    const previews = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      local: true,
      file
    }));

    // Add local previews
    setForm(prev => ({
      ...prev,
      productImg: [...prev.productImg, ...previews]
    }));
  };

  const removeExistingImage = (public_id) => {
    setExistingImage(prev => prev.filter(id => id !== public_id));

    setForm(prev => ({
      ...prev,
      productImg: prev.productImg.filter(img => img.public_id !== public_id)
    }));
  };


  const removeNewImage = (fileToRemove) => {
    setFiles(prev => prev.filter(f => f !== fileToRemove));

    setForm(prev => ({
      ...prev,
      productImg: prev.productImg.filter(img => img.file !== fileToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // text fields
    const finalCategory =
      form.productCategory === "custom" ? customCategory : form.productCategory;

    const finalSubCategory =
      form.productSubCategory === "custom" ? customSubCategory : form.productSubCategory;


    const fd = new FormData();

    fd.append("productName", form.productName);
    fd.append("productDescription", form.productDescription);
    fd.append("productPrice", form.productPrice);
    fd.append("productOriginalPrice", form.productOriginalPrice);
    fd.append("productRating", form.productRating);
    fd.append("productReviews", form.productReviews);
    fd.append("productCategory", finalCategory);
    fd.append("productSubCategory", finalSubCategory);
    fd.append("productBrand", form.productBrand);
    fd.append("productStock", form.productStock);
    fd.append("isTrending", form.isTrending);

    // images to keep
    fd.append("existingImage", JSON.stringify(existingImage));

    // append new uploaded files
    files.forEach(file => {
      fd.append("files", file);
    });

    try {
      const res = await updateProduct(id, fd);
      console.log(res);

      toast.success("Product updated successfully", res.data.message);
    } catch (error) {
      //  console.log(error);

      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (


    <div className='bg-white rounded-lg shadow-md p-4'>
      <Card className="w-full  shadow-xl rounded-2xl ">
        <CardHeader title="Update Product" className="text-center" />
        <CardContent className=''>
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-2">

            <TextField
              label="Product Name"
              fullWidth
              name="productName"
              value={form.productName}
              onChange={handleChange}
            />

            <TextField
              label="Description"
              fullWidth
              name="productDescription"
              value={form.productDescription}
              onChange={handleChange}
              multiline
              rows={3}
            />

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

            <div className="grid grid-cols-2 gap-4">

              {/* CATEGORY */}
              {
                products.length > 0 && (
                  <div>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="productCategory"
                        value={form.productCategory || ""}
                        onChange={handleChange}
                        label="Category"
                      >
                        {categoryOptions.map(cat => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                        <MenuItem value="custom">Add New Category</MenuItem>
                      </Select>
                    </FormControl>

                    {form.productCategory === "custom" && (
                      <TextField
                        label="New Category"
                        fullWidth
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    )}
                  </div>
                )
              }


              {/* SUBCATEGORY */}
              <div>
                {products && (
                  <FormControl fullWidth>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      name="productSubCategory"
                      value={form.productSubCategory || ""}
                      onChange={handleChange}
                      label="Subcategory"
                    >
                      {currentSubCategories.map(sub => (
                        <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                      ))}
                      <MenuItem value="custom">Add New Subcategory</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {form.productSubCategory === "custom" && (
                  <TextField
                    label="New Subcategory"
                    fullWidth
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                  />
                )}
              </div>
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

              <div className="grid grid-cols-3 gap-3 mt-3">
                {form.productImg.map((img, idx) => (
                  <div className="relative" key={idx}>
                    <img src={img.url} className="w-full  object-cover rounded-xl shadow" />

                    <button
                      type="button"
                      onClick={() => {
                      if (img.local) removeNewImage(img.file);
                      else removeExistingImage(img.public_id);
                    }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-bl"
                    >
                      ✕
                    </button>

                  </div>


                ))}
              </div>
            </div>

            <Button type="submit" variant="contained" fullWidth className="!mt-4 !p-3">
             update Product
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductUpdate;
