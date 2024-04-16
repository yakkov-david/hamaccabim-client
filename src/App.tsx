import React from 'react';
import './App.css';
import CountdownPage from './hamaccabim/CountdownPage';
import CreateEditLandingPage from './hamaccabim/CreateEditLandingPage';
import Login from './hamaccabim/Login';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  exp: number;
}

// Function to check if the user is authenticated by validating the JWT
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    // Check if the token is expired
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to decode JWT', error);
    return false;
  }
};


interface GuardedRouteProps {
  children: React.ReactNode;
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <nav>
        <ul className="nav-list">
            <li>
              <Link to="/">Home</Link>
              <Link to="/login">Admin Panel</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<CountdownPage />} />
          <Route path="/countdown/:documentId" element={<CountdownPage />} />
          <Route path="/admin" element={
            <GuardedRoute>
              <CreateEditLandingPage />
            </GuardedRoute>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
