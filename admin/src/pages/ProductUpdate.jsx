import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, updateProduct } from '@/api/productApi'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategories } from '@/redux/categorySlice'
import { X, UploadCloud, ChevronLeft, Save, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        const p = res.data.product;

        setForm({
          productName: p.productName || "",
          productDescription: p.productDescription || "",
          productPrice: p.productPrice || "",
          productOriginalPrice: p.productOriginalPrice || "",
          productRating: p.productRating || "",
          productReviews: p.productReviews || 0,
          productCategory: p.productCategory || [],
          productBrand: p.productBrand || "",
          productStock: p.productStock || "",
          isTrending: p.isTrending || false,
        });

        setExistingImages(p.productImg || []);
      } catch (err) {
        toast.error("Failed to fetch product details");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (value) => {
    setForm(prev => ({
      ...prev,
      productCategory: [value] // Keeping it simple for now as single select
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setPreviews(prev => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return updated;
    });
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (public_id) => {
    setExistingImages(prev => prev.filter(img => img.public_id !== public_id));
  };

  useEffect(() => {
    return () => previews.forEach(p => URL.revokeObjectURL(p.url));
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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

    // Send existing image data as stringified array of public_ids to keep
    fd.append("existingImage", JSON.stringify(existingImages.map(img => img.public_id)));

    newFiles.forEach(file => fd.append("files", file));

    try {
      const res = await updateProduct(id, fd);
      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate('/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-10 h-10 border-4 border-skybrand-200 border-t-skybrand-600 rounded-full animate-spin" />
      <p className="text-gray-500 font-medium">Loading product details...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/products')} className="flex items-center gap-2 text-gray-600 hover:text-skybrand-600">
          <ChevronLeft size={20} /> Back to Products
        </Button>
      </div>

      <Card className="shadow-lg border-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Update Product</CardTitle>
            <CardDescription>Modify product details and manage inventory images.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className='p-8'>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
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
                  <SelectTrigger>
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
                value={form.productDescription}
                onChange={handleChange}
                className="h-24 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productPrice">Sale Price (₹)</Label>
                <Input
                  id="productPrice"
                  name="productPrice"
                  type="number"
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
                  value={form.productOriginalPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productBrand">Brand Name</Label>
                <Input
                  id="productBrand"
                  name="productBrand"
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
                  value={form.productStock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productRating">Rating (1-5)</Label>
                <Input
                  id="productRating"
                  name="productRating"
                  type="number"
                  step="0.1"
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
                  value={form.productReviews}
                  onChange={handleChange}
                />
              </div>
            </div>

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

            {/* Images Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Product Media</Label>
                <label className="cursor-pointer bg-skybrand-50 text-skybrand-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-skybrand-100 transition-colors flex items-center gap-2">
                  <UploadCloud size={18} /> Upload New
                  <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-500">Currently in Cloud</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {existingImages.map((img, idx) => (
                      <div key={img.public_id} className="relative group aspect-square">
                        <img src={img.url} className="w-full h-full object-cover rounded-xl border border-gray-100 shadow-sm" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.public_id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Previews */}
              {previews.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                  <h4 className="text-sm font-medium text-skybrand-600">New Uploads to Save</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {previews.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <img src={img.url} className="w-full h-full object-cover rounded-xl border-2 border-skybrand-200 shadow-sm" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-gray-100 flex gap-4">
              <Button
                type="submit"
                disabled={saving}
                className="px-12 py-6 bg-skybrand-600 hover:bg-skybrand-700 text-white rounded-xl shadow-md transition-all font-bold text-lg flex items-center gap-2"
              >
                {saving ? "Saving Changes..." : <><Save size={20} /> Update Product</>}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
                className="px-8 py-6 rounded-xl font-bold text-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductUpdate;

