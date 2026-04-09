import React, { useState, useEffect } from 'react';
import { createTask } from '../services/taskService';
import { getStudents } from '../services/studentService';

const TaskForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    studentId: '',
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents(1, 100);
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.studentId) {
      setError('Title and student are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createTask(formData);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>Assign New Task</h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">×</button>
        </div>

        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={styles.inputGroup}>
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete Science Project"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Task Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide more details about the task..."
              rows="4"
              style={{ resize: 'vertical' }}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Assign to Student *</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a student from the list</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.class})
                </option>
              ))}
            </select>
            {students.length === 0 && (
              <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>
                No students found. Please add a student first.
              </span>
            )}
          </div>
          
          {error && <div className="badge badge-warning" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}>{error}</div>}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading || students.length === 0} className="btn btn-primary">
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
};

export default TaskForm;