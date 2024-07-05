import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RetinopathyImageUpload from './pages/Retinopathy';
import FoodScannerImageUpload from './pages/FoodScanner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/retinopathy-check" element={<RetinopathyImageUpload />} />
        <Route path="/food-scanner" element={<FoodScannerImageUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
