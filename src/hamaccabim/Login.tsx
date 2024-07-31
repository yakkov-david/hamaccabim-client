
//Login.tsx

import React, { useState } from 'react';
import config from '../config';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    // Send the credentials to the server
    try {
      const response = await fetch(config.apiUrl + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          localStorage.setItem('token', data.token);
          navigate('/AdminWelcome');
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
      <form
        className="form"
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="button">
          Login
        </button>
        <div>
          <Link to="/ForgotPassword" className="forgot-password-link">
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

