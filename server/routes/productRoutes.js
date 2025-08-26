import express from "express";
import { addProduct, getProducts } from "../controllers/productController.js";


const router = express.Router();

router.post("/add", addProduct);   // ✅ matches frontend
router.get("/", getProducts);      // ✅ matches frontend

export default router;
