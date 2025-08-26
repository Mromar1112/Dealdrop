import { useEffect, useState } from "react";
import { listProducts } from "../services/api.js"; // ✅ use one consistent API
import ProductCard from "../components/ProductCard.jsx";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await listProducts(); // ✅ always returns array
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h1>📦 My Products</h1>

      {loading && <p>Loading products…</p>}

      {!loading && products.length === 0 && (
        <p style={{ opacity: 0.7 }}>No products added yet.</p>
      )}

      <div style={{ display: "grid", gap: "12px", marginTop: 12 }}>
        {products.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
    </div>
  );
}

export default Products;
