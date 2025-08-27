import axios from "axios";

// This is the crucial fix.
// It tells your app: "If you are running on a live server (like Render),
// use the special API URL from the environment variables. Otherwise,
// if you are on a local development machine, use localhost:5000."
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`, // All requests will now go to the correct base URL
});

// --- Your API Functions ---

// Example: Get all products
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data; // Return only the data part of the response
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

// Example: Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/products/add", productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Make sure to export any other API functions you have
export default api;
