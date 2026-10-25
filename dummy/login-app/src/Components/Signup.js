import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
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

    if (password !== confirmPassword) {
      setFeedback({ message: '❌ Passwords do not match.', type: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:8000/auth/signup', {
        identifier,
        password,
      });
      setFeedback({ message: '✅ Signup successful! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setFeedback({
        message: `❌ ${err.response?.data?.detail || 'Signup failed'}`,
        type: 'error',
      });
    }
  };

  return (
    <div className="login-container large">
      <div className="login-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username or Gmail"
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

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>

        {feedback.message && (
          <p className={feedback.type === 'success' ? 'success-message' : 'error-message'}>
            {feedback.message}
          </p>
        )}

        <div className="pt-3">
          <a href="/">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;














