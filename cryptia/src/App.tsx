import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Wrapper from './front-page/Wrapper';
import Cryptia from './main/Cryptia';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Wrapper/>} />
          <Route path="/cryptia" element={<Cryptia/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
