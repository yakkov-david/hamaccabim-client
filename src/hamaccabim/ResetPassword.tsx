
//ResetPassword.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config';
import './ForgotPassword.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const query = useQuery();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = query.get('token');
      //console.log(token);


      if (!token) {
        setMessage('Invalid token');
        return;
      }
      const response = await axios.post(config.apiUrl + '/users', { token, newPassword, action: 'resetPassword' });

      /*const response = await fetch(config.apiUrl + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword, action: 'resetPassword' }),
      });*/

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage('An error occurred');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Reset Password</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
        />
        <button type="submit">Submit</button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
