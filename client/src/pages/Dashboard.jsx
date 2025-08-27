import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api.js"; // Ensure this path is correct
import ProductCard from "../components/ProductCard.jsx";
import styles from "../css/Dashboard.module.css";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // Correctly handle the response from the api service
      const response = await getProducts();
      setItems(response.data); // The product array is in response.data
    } catch (err) {
      console.error("❌ Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles['dashboard-container']}>
      <h2 className={styles['dashboard-title']}>Your Dashboard</h2>
      <div className={styles['dashboard-actions']}>
        <button className={styles['refresh-btn']} onClick={load} disabled={loading}>
          {loading ? "⏳ Loading…" : "🔄 Refresh"}
        </button>
      </div>
      {items.length === 0 && !loading && (
        <div className={styles['empty-msg']}>
          🚀 No items yet. Add some from the <b>Add Product</b> tab.
        </div>
      )}
      <div className={styles['dashboard-grid']}>
        {items.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
    </div>
  );
}
