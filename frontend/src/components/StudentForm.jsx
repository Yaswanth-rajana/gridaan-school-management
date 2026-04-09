import React, { useState, useEffect } from 'react';
import { addStudent, updateStudent } from '../services/studentService';

const StudentForm = ({ student, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    rollNumber: '',
    email: '',
    parentContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        class: student.class || '',
        rollNumber: student.rollNumber || '',
        email: student.email || '',
        parentContact: student.parentContact || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.class.trim()) {
      setError('Name and class are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (student) {
        await updateStudent(student._id, formData);
      } else {
        await addStudent(formData);
      }
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{student ? 'Edit Student' : 'Add Student'}</h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">×</button>
        </div>

        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={styles.inputGroup}>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Class *</label>
            <input
              type="text"
              name="class"
              placeholder="e.g. 10th A"
              value={formData.class}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={styles.inputGroup}>
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                placeholder="01"
                value={formData.rollNumber}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Parent Contact</label>
              <input
                type="text"
                name="parentContact"
                placeholder="Phone number"
                value={formData.parentContact}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          {error && <div className="badge badge-warning" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px' }}>{error}</div>}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (student ? 'Update Changes' : 'Add Student')}
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

export default StudentForm;