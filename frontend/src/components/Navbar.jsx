import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🎓</span> 
          <span className="logo-text">Gridaan <span className="logo-accent">School</span></span>
        </div>
        <div className="nav-actions">
          <div className="user-profile">
            <span className="user-avatar">👤</span>
            <span className="user-name">{user?.username}</span>
          </div>
          <button onClick={logout} className="btn logout-button">
            Logout
          </button>
        </div>
      </div>
      <style rx-css="true">{`
        .main-navbar {
          background-color: white;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          height: 70px;
          display: flex;
          align-items: center;
        }
        .nav-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .logo-icon {
          font-size: 24px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }
        .logo-accent {
          color: var(--primary);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-main);
        }
        .logout-button {
          background-color: #fef2f2;
          color: var(--danger);
          padding: 8px 16px;
          font-size: 13px;
          border: 1px solid #fee2e2;
        }
        .logout-button:hover {
          background-color: var(--danger);
          color: white;
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;