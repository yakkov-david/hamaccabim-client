import React, { useContext } from 'react'; // Add useContext to your imports
import './App.css';
import { AuthProvider, AuthContext } from './hamaccabim/AuthContext'; // Import AuthContext as well
import CountdownPage from './hamaccabim/CountdownPage';
import CreateEditLandingPage from './hamaccabim/CreateEditLandingPage';
import Login from './hamaccabim/Login'; // Make sure to create and import the Login component
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';



// Dummy HomePage component for demonstration. Replace or add your actual components.
//const HomePage = () => <div>Home Page</div>;

const App: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link> {/* This might point to the CreateEditLandingPage or a true HomePage */}
            </li>
            {/* 
              Removed the direct link to CountdownPage since it now requires a document ID parameter.
              You'll need to handle navigation to this page programmatically or with a specific ID from elsewhere in your app.
            */}
          </ul>
        </nav>

        <Routes>
        <Route path="/" element={isAuthenticated ? <CreateEditLandingPage /> : <Login />} /> 
          {/* Update the path for CountdownPage to include a document ID parameter */}
          <Route path="/countdown/:documentId" element={<CountdownPage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;