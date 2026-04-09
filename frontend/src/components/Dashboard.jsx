import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import StudentList from './StudentList';
import TaskList from './TaskList';
import { getStats } from '../services/taskService';

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const data = await getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">School Management Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stats-card primary">
            <span className="stats-label">Total Students</span>
            <div className="stats-value">{loadingStats ? '...' : stats?.totalStudents || 0}</div>
          </div>
          <div className="stats-card">
            <span className="stats-label">Total Tasks</span>
            <div className="stats-value">{loadingStats ? '...' : stats?.totalTasks || 0}</div>
          </div>
          <div className="stats-card warning">
            <span className="stats-label">Pending Tasks</span>
            <div className="stats-value">{loadingStats ? '...' : stats?.pendingTasks || 0}</div>
          </div>
          <div className="stats-card success">
            <span className="stats-label">Completed Tasks</span>
            <div className="stats-value">{loadingStats ? '...' : stats?.completedTasks || 0}</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-column">
            <StudentList refreshTrigger={refreshTrigger} onDataChange={refreshData} />
          </div>
          <div className="dashboard-column">
            <TaskList refreshTrigger={refreshTrigger} onDataChange={refreshData} />
          </div>
        </div>
      </div>

      <style rx-css="true">{`
        .dashboard-wrapper {
          min-height: 100vh;
          background-color: var(--bg);
        }
        .dashboard-container {
          padding: 32px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .dashboard-title {
          margin-bottom: 32px;
          color: var(--text-main);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .dashboard-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;