import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Healthcare from './Healthcare';
import Login from './Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route for the Login page */}
          <Route path="/" element={<Login />} />
          
          {/* Route for the Healthcare page */}
          <Route path="/healthcare" element={<Healthcare />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
