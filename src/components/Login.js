import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';

function LoginSignup() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  

  const handleRoleChange = (e) => setRole(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (url) => {
    try {
      const response = await axios.post("http://localhost:3000" + url, {
        username,
        password,
        role,
      });
      alert(response.data.message);
      localStorage.setItem("isAuthenticated", true);
      // console.log(response.data.token);
      localStorage.setItem("authToken", response.data.token); // Store the token
      navigate("/student-profile");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "An error occurred.");
      } else {
        alert("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Welcome</h2>
      <form className="user-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="form-input"
          required
        />
        <select
          value={role}
          onChange={handleRoleChange}
          className="form-select"
          required
        >
          <option value="">Select Role</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>
        <div className="button-group">
          <button
            type="button"
            onClick={() => handleSubmit("/login")}
            className="form-button login-button"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("/signup")}
            className="form-button signup-button"
          >
            Signup
          </button>
          <button
            type="button"
            onClick={() => navigate('/reset-password')}  
            className="form-button forgot-password-button"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginSignup;
