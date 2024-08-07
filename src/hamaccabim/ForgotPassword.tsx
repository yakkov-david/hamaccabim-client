import React, { useState } from 'react';
import config from '../config';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Sending email:', email); // Log email being sent

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      if (config.apiKey) {
        headers.set('x-api-key', config.apiKey);
      }

      const response = await fetch(config.apiUrl + '/users', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, action: 'forgotPassword' }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(data.message);
      console.log("The request sent successfully"); // Log successful request

    } catch (error) {
      console.error('Error:', error); // Log error
      setMessage('An error occurred');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Submit</button>
        {message && <p className="forgot-password-message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
