import React from 'react';
import './App.css';
import CountdownPage from './hamaccabim/CountdownPage';
import CreateEditLandingPage from './hamaccabim/CreateEditLandingPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Dummy HomePage component for demonstration. Replace or add your actual components.
//const HomePage = () => <div>Home Page</div>;

const App: React.FC = () => {
  return (
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
          <Route path="/" element={<CreateEditLandingPage />} />
          {/* Update the path for CountdownPage to include a document ID parameter */}
          <Route path="/countdown/:documentId" element={<CountdownPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;