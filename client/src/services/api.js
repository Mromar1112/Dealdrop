import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/products", // ✅ must match backend route
});

// Add product
export const addProduct = (productData) => API.post("/add", productData);

// Get products
export const getProducts = () => API.get("/");
