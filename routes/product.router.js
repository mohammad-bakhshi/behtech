import express from "express";
import { upload } from "../config/upload.js";
import {
  importProducts,
  getProducts,
} from "../controllers/product.controller.js";
import { getProductsValidation } from "../middlewares/get-products.middleware.js";

const router = express.Router();

router.post("/import", upload.single("products"), importProducts);
router.get("/products", getProductsValidation, getProducts);

export default router;
