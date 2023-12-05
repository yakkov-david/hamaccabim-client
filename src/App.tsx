// App.tsx
import React from 'react';
import './App.css'; // Your main CSS file for styling
import CountdownPage from './hamaccabim/CountdownPage'; // Import the countdown page component

const App: React.FC = () => {
  return (
    <div className="App">
      <CountdownPage />
    </div>
  );
}

export default App;