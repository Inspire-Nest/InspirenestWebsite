import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Admin from "./Admin";
import Hr from "./Hr";
import "antd/dist/reset.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/hr/*" element={<Hr />} />
      </Routes>
    </Router>
  );
}

export default App;
