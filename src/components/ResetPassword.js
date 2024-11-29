// src/ResetPassword.js
import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/forgot-password', {
        username,
        newPassword
      });
      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "An error occurred.");
      } else {
        alert("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={handleUsernameChange}
            className="reset-password-input"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="reset-password-input"
            required
          />
        </div>
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
        <button className="back-to-login" onClick={() => navigate('/')} >
          Back to login
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
