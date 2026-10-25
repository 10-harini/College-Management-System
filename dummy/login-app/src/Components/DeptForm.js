import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeptForm.css';

const DeptForm = () => {
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeptName, setSelectedDeptName] = useState('');
  const [editId, setEditId] = useState(null);

  const [subjects, setSubjects] = useState({
    subject1: '', subject2: '', subject3: '', subject4: '', subject5: ''
  });

  useEffect(() => {
    axios.get('http://localhost:8000/department-subjects')
      .then(res => setRecords(res.data))
      .catch(console.error);

    axios.get('http://localhost:8000/departments')
      .then(res => setDepartments(res.data))
      .catch(console.error);
  }, []);

  const handleSubjectChange = (e) => {
    setSubjects({ ...subjects, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setShowModal(true);
    setEditId(item.id);
    setSelectedDeptName(item.department_name);
    setSubjects({
      subject1: item.subject1 || '',
      subject2: item.subject2 || '',
      subject3: item.subject3 || '',
      subject4: item.subject4 || '',
      subject5: item.subject5 || ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios.delete(`http://localhost:8000/department-subjects/${id}`)
        .then(() => window.location.reload())
        .catch(console.error);
    }
  };

  const handleSave = () => {
    const selectedDept = departments.find(d => d.depart_names === selectedDeptName);
    if (!selectedDept) {
      alert("Please select a valid department.");
      return;
    }

    const payload = {
      dept_id: selectedDept.id,
      ...subjects
    };

    const url = editId
      ? `http://localhost:8000/department-subjects/${editId}`
      : 'http://localhost:8000/department-subjects';

    const request = editId
      ? axios.put(url, payload)
      : axios.post(url, payload);

    request
      .then(() => {
        setShowModal(false);
        setEditId(null);
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <div className="main-layout d-flex justify-content-start align-items-center ">
      <div className="glass-card p-4 w-100" style={{ maxWidth: '1100px' }}>
        <div className="d-flex justify-content-between align-items-center text-center mb-3">
          <h3 className="text-white fw-bold m-0 ">Department Subjects</h3>
          <button className="btn btn-outline-light fw-bold" onClick={() => {
            setShowModal(true);
            setEditId(null);
            setSubjects({ subject1: '', subject2: '', subject3: '', subject4: '', subject5: '' });
            setSelectedDeptName('');
          }}>
            + Add Subject
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle text-white">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Department</th>
                <th>Sub1</th>
                <th>Sub2</th>
                <th>Sub3</th>
                <th>Sub4</th>
                <th>Sub5</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.department_name}</td>
                    <td>{item.subject1 || '-'}</td>
                    <td>{item.subject2 || '-'}</td>
                    <td>{item.subject3 || '-'}</td>
                    <td>{item.subject4 || '-'}</td>
                    <td>{item.subject5 || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEdit(item)}>✏️</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal glass-modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content glass-content p-4">
              <button type="button" className="btn-close ms-auto" onClick={() => setShowModal(false)}></button>
              <h5 className="text-center text-white mb-3">{editId ? "Edit Subjects" : "Assign Subjects"}</h5>

              <div className="mb-3">
                <label className="form-label text-white">Select Department</label>
                <select
                  className="form-select"
                  value={selectedDeptName}
                  onChange={(e) => setSelectedDeptName(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.depart_names}>
                      {dept.depart_names}
                    </option>
                  ))}
                </select>
              </div>

              {[1, 2, 3, 4, 5].map((num) => (
                <div className="mb-2" key={num}>
                  <input
                    type="text"
                    name={`subject${num}`}
                    placeholder={`Subject ${num}`}
                    className="form-control"
                    value={subjects[`subject${num}`]}
                    onChange={handleSubjectChange}
                  />
                </div>
              ))}

              <div className="text-center mt-3">
                <button className="btn btn-primary px-4" onClick={handleSave}>
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptForm;

