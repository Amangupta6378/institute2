import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InstituteManagement from "./InstituteManagement";
import AddStudent from "./AddStudent";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<InstituteManagement />} />
        <Route path="/add-student" element={<AddStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
