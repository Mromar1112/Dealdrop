import React from "react";
import styles from "../css/Products.module.css";


export default function ProductCard({ p }) {
  const atOrBelow =
    p.currentPrice && p.targetPrice && p.currentPrice <= p.targetPrice;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        gap: 12,
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      {p.image ? (
        <img
          src={p.image}
          alt="img"
          style={{ width: 90, height: 90, objectFit: "contain" }}
        />
      ) : null}

      <div style={{ flex: 1 }}>
        {/* Title */}
        <div style={{ fontWeight: 600 }}>{p.title || "Untitled product"}</div>

        {/* Last checked */}
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Last checked:{" "}
          {p.lastChecked
            ? new Date(p.lastChecked).toLocaleString()
            : "—"}
        </div>

        {/* Price info */}
        <div style={{ marginTop: 6 }}>
          Current: {p.currentPrice ? `₹${p.currentPrice}` : "—"} • Target: ₹
          {p.targetPrice}
          {atOrBelow && (
            <span style={{ marginLeft: 8, color: "green", fontWeight: 600 }}>
              Price Dropped ✅
            </span>
          )}
        </div>

        {/* Open link */}
        <div style={{ marginTop: 8 }}>
          <a href={p.url} target="_blank" rel="noreferrer">
            Open product
          </a>
        </div>
      </div>
    </div>
  );
}
