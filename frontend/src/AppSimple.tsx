import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import AROMIFixedChat from './pages/AROMIFixedChat';

function AppSimple() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/pages/TestPage" element={<TestPage />} />
          <Route path="/pages/AROMIFixedChat" element={<AROMIFixedChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppSimple;
