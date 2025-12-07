import express from "express";
import { upload } from "../config/upload.js";
import {
  importProducts,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/import", upload.single("products"), importProducts);
router.get("/products", getProducts);

export default router;
