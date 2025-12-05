import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
});

export  const  Category = mongoose.model("Category", categorySchema);
