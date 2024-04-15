
//Login.tsx

import React, { useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const navigate = useNavigate();  // Create an instance of the navigate function

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  

  const handleSubmit = async () => {

    const text = 'hello';
    // Send the credentials to the server
    try {
      const response = await fetch(`http://localhost:3030/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          navigate('/admin');
        } else {
          alert('Invalid credentials');
        }
      } else {
        throw new Error('Failed to authenticate');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed');
    }
  };

  return (
    <div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={() => handleSubmit()}>Login</button>
    </div>
  );
};

export default Login;
