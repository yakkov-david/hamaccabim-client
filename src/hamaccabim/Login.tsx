
//Login.tsx

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import './Login.css';

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
          localStorage.setItem('token', data.token);
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
    <div className="login-container">
      <form className="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="button">Login</button>
      </form>
    </div>
  );
};

export default Login;
