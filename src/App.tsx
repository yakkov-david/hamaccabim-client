import React from 'react';
import './App.css';
import CountdownPage from './hamaccabim/CountdownPage';
import CreateEditLandingPage from './hamaccabim/CreateEditLandingPage';
import Login from './hamaccabim/Login';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';



const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
              <Link to="/login">Admin Panel</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<CountdownPage />} />
          <Route path="/countdown/:documentId" element={<CountdownPage />} />
          <Route path="/admin" element={<CreateEditLandingPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
