// src/App.js
import React from "react";
import { BrowserRouter, Router, Route, Link, Routes } from "react-router-dom";
import Dashboard from "./components/DashboardPage";
import Header from "./Header";
import Sidebar from "./Sidebar";
const Manager = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/setting" element={<Sidebar />} />
      </Routes>
    </>
  );
};

export default Manager;
