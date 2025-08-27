import axios from "axios";

// This is the crucial fix.
// It tells your app: "If running on a live server (like Render),
// use the special API URL from the environment variables. Otherwise,
// if on a local machine, use localhost:5000."
// NOTE: Vite requires the prefix VITE_ for environment variables.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`, // All requests will now go to the correct base URL
});

/**
 * Fetches all products from the server.
 * @returns {Promise<axios.AxiosResponse<any>>} The full axios response.
 */
export const getProducts = () => {
  return api.get("/products");
};

/**
 * Adds a new product to the tracker.
 * @param {{url: string, targetPrice: number, userEmail: string}} productData The product data to add.
 * @returns {Promise<axios.AxiosResponse<any>>} The full axios response.
 */
export const addProduct = (productData) => {
  return api.post("/products/add", productData);
};
