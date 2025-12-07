import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  status: {
    type: Boolean,
    required: "Status is required!",
  },
  name: {
    type: String,
    required: "Name is required!",
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: "Price is required",
  },
  warrantyStartDate: {
    type: Date,
    required: "Warranty Start Date is required",
  },
  warrantyEndDate: {
    type: Date,
    required: "Warranty End Date is required",
  },
  amp: {
    type: Number,
    required: "amp is required",
  },
  productCode: {
    type: String,
    unique: true,
    required: "Product Code is required",
  },
  category_id: {
    type: Schema.Types.ObjectId,
    required: "Category ID is required",
    ref: "Category",
  },
  subCategory_id: {
    type: Schema.Types.ObjectId,
    required: "SubCategory ID is required",
    ref: "SubCategory",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", productSchema);
