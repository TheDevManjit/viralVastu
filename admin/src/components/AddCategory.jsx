import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, fetchCategories } from "@/redux/categorySlice";

function AddCategory() {
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState("")
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

    // adjust according to backend field names
    dispatch(addCategory({ label: form.label, value: form.name }))
      .unwrap()
      .then(() => toast.success("Category added successfully"))
      .catch(() => toast.error("Failed to add category"));
  };

  useEffect(() => {

    dispatch(fetchCategories())
    console.log(categories)

  }, [])

  const handleCategory = (e) => {
    setSelectedCategory(e.target.value)
  }

  useEffect(() => {
    if (error) toast.error(error.message
    );
  }, [error]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Card className="w-full shadow-xl rounded-2xl border">

        <CardHeader title="Add New Category" className="text-center" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <TextField
                  label="Label"
                  name="label"
                  fullWidth
                  value={form.label}
                  onChange={handleChange}
                />
              </div>

              <div>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                {
                  categories.length > 0 && (
                    <div>
                      <FormControl fullWidth>
                        <InputLabel>Categories</InputLabel>


                        <Select
                          name="productCategory"
                          value={selectedCategory}
                          onChange={handleCategory}
                          label="Category"
                        >
                          {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat.value}>{cat.label}</MenuItem>
                          ))}


                        </Select>



                      </FormControl>

                    </div>
                  )
                }
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              className="!mt-4 !p-3 w-50 items-center"
            >
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddCategory;
