import React from 'react';
import './App.css';
import CountdownPage from './hamaccabim/CountdownPage';
import CreateEditLandingPage from './hamaccabim/CreateEditLandingPage';
import Login from './hamaccabim/Login';
import ManagerForm from './hamaccabim/ManagerRegistration';
import ForgotPassword from './hamaccabim/ForgotPassword';
import ResetPassword from './hamaccabim/ResetPassword';
import AnalyticsPage from './hamaccabim/AnalyticsPage';
import AdminWelcome from './hamaccabim/AdminWelcome';
import UsersTable from './hamaccabim/UsersTable';
import LandingPagesTable from './hamaccabim/LandingPagesTable';
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
  validate?: () => boolean;
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({ children, validate }) => {
  const isAuthValid = validate ? validate() : isAuthenticated();
  return isAuthValid ? <>{children}</> : <Navigate to="/login" />;
};


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="nav-list">
            <li>
              <Link
                to="/">
                Home
              </Link>
              <Link
                to="/login">
                Admin Panel
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<CountdownPage />}
          />
          <Route
            path="/countdown/:documentId"
            element={<CountdownPage />}
          />
          <Route
            path="/admin"
            element={
              <GuardedRoute>
                <CreateEditLandingPage />
                {/*<ManagerForm />*/}
              </GuardedRoute>
            }
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/ForgotPassword"
            element={<ForgotPassword />}
          />
          <Route
            path="/ResetPassword"
            element={<ResetPassword />}
          />
          <Route
            path="/AnalyticsPage"
            element={<AnalyticsPage />}
          />

          <Route
            path="/AdminWelcome"
            element={<AdminWelcome />}
          />

          <Route
            path="/ManagerForm"
            element={<ManagerForm />}
          />




          <Route
            path="/UsersTable"
            element={<UsersTable />}
          />


          <Route
            path="/LandingPagesTable"
            element={<LandingPagesTable />}
          />


          {/*<Route
            path="/ManagerForm"
            element={<ManagerForm />}
          />*/}

          {/*<Route
            path="/edit-user"
            element={
              <GuardedRoute validate={() => isAuthenticated()}>
                <AdminEditUser />
              </GuardedRoute>
            }
          />*/}

        </Routes>
      </div>
    </Router>
  );
}


export default App;
