import React, { useState } from "react";

import AddProduct from "./pages/AddProduct.jsx";

import Dashboard from "./pages/Dashboard.jsx";

import "./css/App.css"; // ✅ Import the CSS file


export default function App() {

  const [tab, setTab] = useState("add");


  return (

    <div className="app-container">

      <h1 className="app-title">🛒 Deal Drop</h1>


      {/* Navigation Buttons */}

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


      {/* Page Content */}

      <div className="content-card">

        {tab === "add" ? <AddProduct /> : <Dashboard />}

      </div>


      <p className="app-footer">

        MVP: shows all tracked items. You can filter by email later.

      </p>

    </div>

  );

} 
