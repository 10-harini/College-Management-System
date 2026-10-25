import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Department.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [error, setError] = useState('');
  const [responseError, setResponseError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = () => {
    axios.get('http://127.0.0.1:8000/departments')
      .then((res) => setDepartments(res.data))
      .catch(() => setDeleteError("Failed to load departments."));
  };

  const validate = () => {
    if (!newDepartment.trim()) {
      setError("Department name is required");
      return false;
    }
    setError('');
    return true;
  };

  const saveDepartment = () => {
    if (!validate()) return;

    const payload = { depart_names: newDepartment };

    if (isEditMode) {
      axios.put(`http://127.0.0.1:8000/departments/${editId}`, payload)
        .then((res) => {
          if (res.data.message) {
            resetForm();
            getDepartments();
          } else {
            setResponseError("Update failed.");
          }
        })
        .catch(() => setResponseError("Error updating department."));
    } else {
      axios.post('http://127.0.0.1:8000/departments', payload)
        .then((res) => {
          if (res.data.message) {
            resetForm();
            getDepartments();
          } else {
            setResponseError("Department not added.");
          }
        })
        .catch(() => setResponseError("Error adding department."));
    }
  };

  const resetForm = () => {
    setNewDepartment('');
    setEditId(null);
    setIsEditMode(false);
    setShow(false);
    setError('');
    setResponseError('');
  };

  const reset = () => {
    setShow(true);
    setIsEditMode(false);
    setNewDepartment('');
    setError('');
    setResponseError('');
  };

  const bindDeptDetails = (dept) => {
    console.log("Edit department:", dept);
    setShow(true);
    setEditId(dept.id);
    setIsEditMode(true);

    axios.get(`http://127.0.0.1:8000/departments/${dept.id}`)
      .then((res) => {
        setNewDepartment(res.data.depart_names);
      })
      .catch(() => {
        setNewDepartment('');
        alert("Failed to load department details.");
      });
  };

  const bindDelDetails = (dept) => {
    setDeleteId(dept.id);
    setShowDeleteModal(true);
    console.log("Ready to delete:", dept.depart_names);
  };

  const deleteDepartment = () => {
    setDeleteError('');
    axios.delete(`http://127.0.0.1:8000/departments/${deleteId}`)
      .then((res) => {
        if (res.data.message) {
          getDepartments();
          setShowDeleteModal(false);
        } else {
          setDeleteError("Delete failed.");
        }
      })
      .catch(() => setDeleteError("Error deleting department."));
  };

  return (
    <div className="lavender-bg">
      <div className="lavender-container">
        <h4 className="text-center w-100 m-100 " style={{ color: '#5d5dd5' }}>Department List</h4>

        <div className="d-flex justify-content-between mb-3">
          <Button variant="primary" onClick={() => navigate('/main/students')}>
            🔁 View Students
          </Button>
          <Button variant="primary" onClick={reset}>
            ➕ Add Department
          </Button>
        </div>

        <table className="table table-bordered table-striped text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.id}>
                <td>{index + 1}</td>
                <td>{dept.depart_names}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => bindDeptDetails(dept)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => bindDelDetails(dept)}
                  >
                    🗑 Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {deleteError && <div className="text-danger text-center mt-2">{deleteError}</div>}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={resetForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Department' : 'Add Department'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              value={newDepartment}
              onChange={(e) => {
                setNewDepartment(e.target.value);
                setError('');
                setResponseError('');
              }}
              placeholder="Enter department name"
              maxLength={50}
            />
            {error && <small className="text-danger">{error}</small>}
            {responseError && <div className="text-danger mt-2">{responseError}</div>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>Cancel</Button>
          <Button variant="primary" onClick={saveDepartment}>
            {isEditMode ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this department?
          {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteDepartment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Department;











