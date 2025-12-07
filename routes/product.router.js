import express from "express";
import {
  importProducts,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/import", importProducts);
router.get("/products", getProducts);

export default router;
