import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: "Name is required!",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
