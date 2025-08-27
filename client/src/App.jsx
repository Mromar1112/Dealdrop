import React, { useState } from "react";
import AddProduct from "./pages/AddProduct.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import "./css/App.css";

export default function App() {
  // Set the default tab to "dash" to show products on page load
  const [tab, setTab] = useState("dash");

  return (
    <div className="app-container">
      <h1 className="app-title">🛒 Deal Drop</h1>
      <div className="tab-buttons">
        <button
          onClick={() => setTab("add")}
          className={tab === "add" ? "active" : ""}
        >
          Add Product
        </button>
        <button
          onClick={() => setTab("dash")}
          className={tab === "dash" ? "active" : ""}
        >
          Dashboard
        </button>
      </div>
      <div className="content-card">
        {tab === "add" ? <AddProduct /> : <Dashboard />}
      </div>
      <p className="app-footer">
        MVP: shows all tracked items. You can filter by email later.
      </p>
    </div>
  );
}
