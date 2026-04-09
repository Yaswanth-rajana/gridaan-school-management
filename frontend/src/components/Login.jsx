import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }
    
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    
    if (success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-logo">
          <span>🎓</span> Gridaan
        </h1>
        <h2 className="login-subtitle">School Management System</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">
              <span>👤</span> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="Enter username"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">
              <span>🔒</span> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter password"
              disabled={isLoading}
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="demo-credentials">
          <span className="demo-badge">Demo Access</span>
          <div className="credentials-text">
            username: <strong>admin</strong> | password: <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;