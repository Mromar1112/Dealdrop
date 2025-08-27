import React, { useState } from "react";
import { addProduct } from "../services/api.js"; // Ensure this path is correct
import styles from "../css/AddProduct.module.css";

export default function AddProduct() {
  const [url, setUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!url || !targetPrice || !userEmail) {
      setMsg("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await addProduct({
        url,
        targetPrice: Number(targetPrice),
        userEmail,
      });
      // Correctly access the data from the response
      setMsg(`✅ Added: ${res.data.title} (Current: ₹${res.data.currentPrice})`);
      setUrl("");
      setTargetPrice("");
    } catch (err) {
      // Improved error handling
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
      setMsg(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <label>
          Product URL
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Amazon/Myntra/BigBasket/walmart URL"
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Target Price (₹)
          <input
            type="number"
            min="0"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Your Email (for alerts)
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%" }}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Adding…" : "Add Product"}
        </button>
        {msg && <div style={{ padding: 10, background: "#f6f6f6", borderRadius: 8 }}>{msg}</div>}
      </form>
    </div>
  );
}
