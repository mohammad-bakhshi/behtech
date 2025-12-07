import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: "Name is required!",
    unique: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Category = mongoose.model("Category", categorySchema);
