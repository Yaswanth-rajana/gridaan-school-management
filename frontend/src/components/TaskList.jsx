import React, { useState, useEffect } from 'react';
import { getTasks, completeTask, deleteTask } from '../services/taskService';

import TaskForm from './TaskForm';

const TaskList = ({ refreshTrigger, onDataChange }) => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, refreshTrigger]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(page, 10, statusFilter);
      setTasks(data.tasks || []);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      fetchTasks();
      if (onDataChange) onDataChange();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete task');
    }
  };


  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete task "${title}"?`)) {
      try {
        await deleteTask(id);
        fetchTasks();
        if (onDataChange) onDataChange();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };


  if (loading && tasks.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Tasks</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <span style={{ fontSize: '18px' }}>+</span> Assign Task
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Tasks</option>
          <option value="pending">Pending Tasks</option>
          <option value="completed">Completed Tasks</option>
        </select>
      </div>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📝</span>
          <h3>No tasks found</h3>
          <p>Try changing the filter or assign a new task.</p>
        </div>
      ) : (
        <>
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.status}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 className="truncate" title={task.title} style={{ margin: 0, flex: 1, marginRight: '8px' }}>{task.title}</h3>
                  <span className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>

                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
                
                {task.description && (
                  <p className="truncate-2" title={task.description} style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '14px', height: '40px' }}>
                    {task.description}
                  </p>
                )}

                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>👨‍🎓</span>
                    <span style={{ fontWeight: '500' }}>{task.studentId?.name || 'Unknown'}</span>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📚</span>
                    <span style={{ color: 'var(--text-muted)' }}>Class: {task.studentId?.class || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleComplete(task._id)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                    >
                      ✓ Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(task._id, task.title)}
                    className="btn btn-secondary"
                    style={{ padding: '8px', fontSize: '13px', color: 'var(--danger)' }}
                    title="Delete Task"
                  >
                    🗑️
                  </button>
                </div>

              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">

            <div className="page-info">
              Showing Page {page} of {totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary"
              style={{ padding: '6px 12px' }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary"
              style={{ padding: '6px 12px' }}
            >
              Next
            </button>
          </div>
          )}

        </>
      )}
      
      {showForm && (
        <TaskForm
          onClose={() => {
            setShowForm(false);
            fetchTasks();
            if (onDataChange) onDataChange();
          }}

        />
      )}
      <style rx-css="true">{`
        .filter-select {
          max-width: 200px;
        }
        .task-list {
          display: flex;
          flex-direction: column;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TaskList;