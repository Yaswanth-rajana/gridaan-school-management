import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/studentService';
import StudentForm from './StudentForm';

const StudentList = ({ refreshTrigger, onDataChange }) => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [page, search, refreshTrigger]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents(page, 10, search);
      setStudents(data.students || []);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete student "${name}"? All their tasks will also be deleted.`)) {
      try {
        await deleteStudent(id);
        fetchStudents();
        if (onDataChange) onDataChange();
      } catch (error) {
        alert('Failed to delete student');
      }
    }
  };


  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
    fetchStudents();
    if (onDataChange) onDataChange();
  };


  if (loading && students.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Students</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <span style={{ fontSize: '18px' }}>+</span> Add Student
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search students by name, class or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <span style={{ position: 'absolute', right: '12px', top: '10px', color: 'var(--text-muted)' }}>🔍</span>
      </div>
      
      {students.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">👥</span>
          <h3>No students found</h3>
          <p>Try adjusting your search or add a new student.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header">
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Class/Roll</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Email</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="table-row">
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500', maxWidth: '150px' }} className="truncate" title={student.name}>{student.name}</div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ color: 'var(--text-main)' }}>{student.class}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Roll: {student.rollNumber || '-'}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <div className="truncate" style={{ maxWidth: '180px' }} title={student.email}>
                        {student.email || '-'}
                      </div>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(student)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '13px' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(student._id, student.name)} className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '13px' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <StudentForm
          student={editingStudent}
          onClose={handleFormClose}
        />
      )}
      
      <style rx-css="true">{`
        .search-input {
          padding-right: 40px;
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

export default StudentList;