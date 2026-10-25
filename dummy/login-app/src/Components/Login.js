import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });

    const isEmail = identifier.includes('@');
    const isValidGmail = /^[^\s@]+@gmail\.com$/.test(identifier);

    if (isEmail && !isValidGmail) {
      setFeedback({
        message: '❌ Only valid Gmail addresses are allowed (e.g., yourname@gmail.com).',
        type: 'error',
      });
      return;
    }

    try {
      await axios.post('http://localhost:8000/auth/login', {
        identifier,
        password,
      });
      setFeedback({ message: '✅ Login successful! Redirecting...', type: 'success' });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username',identifier)
      setTimeout(() => navigate('/main'), 1500);
    } catch (err) {
      setFeedback({
        message: '❌ Login failed. New user? Please go to Signup.',
        type: 'error',
      });
    }
  };
  return (
    <div className="login-container large">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit">Login</button>
        </form>

        {feedback.message && (
          <p className={feedback.type === 'success' ? 'success-message' : 'error-message'}>
            {feedback.message}
          </p>
        )}

        <div className="pt-3 text-white">
          <a href="/signup">Don't have an account? Signup</a>
        </div>
      </div>
    </div>
  );
};

export default Login;






