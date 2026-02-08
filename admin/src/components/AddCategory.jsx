import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, fetchCategories } from "@/redux/categorySlice";
import { ListIcon, PlusCircle, Tag } from "lucide-react";

function AddCategory() {
  const { categories, loading, error } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    label: "",
    name: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label || !form.name) {
      toast.error("Please fill in both label and name");
      return;
    }

    dispatch(addCategory({ label: form.label, value: form.name }))
      .unwrap()
      .then(() => {
        toast.success("Category added successfully");
        setForm({ label: "", name: "" });
      })
      .catch(() => toast.error("Failed to add category"));
  };

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <Card className="w-full border-gray-100 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <PlusCircle className="w-5 h-5 text-skybrand-600" />
          Add Store Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-label" className="text-sm font-semibold">Display Label</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="cat-label"
                name="label"
                placeholder="e.g. Home Decor"
                className="pl-10"
                value={form.label}
                onChange={handleChange}
              />
            </div>
            <p className="text-[10px] text-gray-400">This is what users see in the navigation.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-name" className="text-sm font-semibold">Identifier Name</Label>
            <div className="relative">
              <ListIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="cat-name"
                name="name"
                placeholder="e.g. home-decor"
                className="pl-10"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <p className="text-[10px] text-gray-400">Internal unique name (lowercase, no spaces).</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-skybrand-600 hover:bg-skybrand-700 text-white shadow-sm mt-2"
          >
            {loading ? "Adding..." : "Confirm & Save"}
          </Button>

          {categories.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Existing Categories ({categories.length})</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <span key={cat._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-skybrand-50 text-skybrand-700 border border-skybrand-100">
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default AddCategory;
