import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Department.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newStudent, setNewStudent] = useState({
    std_name: '',
    age: '',
    department: ''
  });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [deptError, setDeptError] = useState('');
  const [responseError, setResponseError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getStudents();
    getDepartments();
  }, []);

  const getStudents = () => {


    axios.get('http://127.0.0.1:8000/students/')
      .then((res) => setStudents(res.data))
      .catch(() => setDeleteError("Error fetching students."));
  };

  const getDepartments = () => {
    axios.get('http://127.0.0.1:8000/departments')
      .then((res) => setDepartments(res.data));
  };

  const validate = () => {
    let valid = true;

    if (!newStudent.std_name.trim()) {
      setNameError("Student name is required");
      valid = false;
    } else {
      setNameError('');
    }

    if (!newStudent.age || newStudent.age <= 0) {
      setAgeError("Age must be a positive number");
      valid = false;
    } else {
      setAgeError('');
    }

    if (!newStudent.department) {
      setDeptError("Please select a department");
      valid = false;
    } else {
      setDeptError('');
    }

    return valid;
  };

  const saveStudent = () => {
    if (!validate()) return;

    const payload = {
      std_name: newStudent.std_name,
      age: newStudent.age,
      department: newStudent.department
    };

    if (isEditMode) {
      axios.put(`http://127.0.0.1:8000/students/${editId}`, payload)
        .then((res) => {
          if (res.data.message) {
            resetForm();
            getStudents();
          } else {
            setResponseError("Update failed.");
          }
        })
        .catch(() => setResponseError("Error updating student."));
    } else {
      axios.post('http://127.0.0.1:8000/students/', payload)
        .then((res) => {
          if (res.data.message) {
            resetForm();
            getStudents();
          } else {
            setResponseError("Student not added.");
          }
        })
        .catch(() => setResponseError("Error adding student."));
    }
  };

  const resetForm = () => {
    setNewStudent({ std_name: '', age: '', department: '' });
    setEditId(null);
    setIsEditMode(false);
    setShow(false);
    setNameError('');
    setAgeError('');
    setDeptError('');
    setResponseError('');
  };


  const deleteStudent = () => {
    setDeleteError('');
    axios.delete(`http://127.0.0.1:8000/students/${deleteId}`)
      .then((res) => {
        if (res.data.message) {
          getStudents();
          setShowDeleteModal(false);
        } else {
          setDeleteError("Delete failed.");
        }
      })
      .catch(() => setDeleteError("Error deleting student."));
  };

  const getDepartmentName = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.depart_names : 'Unknown';
  };

  const bindDeptDetails = (param) => {
    setShow(true)
    console.log(param)
    // setNewStudent({
    //   std_name: param.std_name,
    //   age: param.age,
    //   department: param.department
    // })
    axios.get(`http://127.0.0.1:8000/students/${param.std_id}`)
      .then((res) => {
        setNewStudent({
          std_name: res.data.std_name,
          age: res.data.age,
          department: res.data.department
        })
      })

  }




  const bindDelDetails = (para) => {
    setDeleteId(para.std_id);
    setShowDeleteModal(true);
    console.log("Ready to delete:", para.std_name);
  };



  const reset = () => {
    setShow(true);
    setIsEditMode(false);
    setNewStudent({ std_name: '', age: '', department: '' });
    setNameError('');
    setAgeError('');
    setDeptError('');
    setResponseError('');

  }

  return (
    <div className="lavender-bg">
      <div className="lavender-container">
        <h4 className="text-center w-100 m-100" style={{ color: '#5d5dd5' }}>Student List</h4>

        <div className="d-flex justify-content-between mb-3">
          <Button variant="primary" onClick={() => navigate('/main/department')}>
            🔙 Back to Departments
          </Button>
          <Button variant="primary" onClick={reset}>
            ➕ Add Student
          </Button>
        </div>

        <table className="table table-bordered table-striped text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.std_id}>
                <td>{index + 1}</td>
                <td>{student.std_name}</td>
                <td>{student.age}</td>
                <td>{getDepartmentName(student.department)}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => { bindDeptDetails(student) }}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => { bindDelDetails(student) }}
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
          <Modal.Title>{isEditMode ? 'Edit Student' : 'Add Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newStudent.std_name}
              onChange={(e) => {
                setNewStudent({ ...newStudent, std_name: e.target.value });
                setNameError('');
              }}
              placeholder="Enter student name"
              maxLength={255}
            />
            {nameError && <small className="text-danger">{nameError}</small>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              value={newStudent.age}
              onChange={(e) => {
                setNewStudent({ ...newStudent, age: e.target.value });
                setAgeError('');
              }}
              placeholder="Enter age"
            />
            {ageError && <small className="text-danger">{ageError}</small>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={newStudent.department}
              onChange={(e) => {
                setNewStudent({ ...newStudent, department: parseInt(e.target.value) });
                setDeptError('');
              }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.depart_names}</option>
              ))}
            </Form.Select>
            {deptError && <small className="text-danger">{deptError}</small>}
          </Form.Group>
          {responseError && <div className="text-danger">{responseError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm}>Cancel</Button>
          <Button variant="primary" onClick={saveStudent}>
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
          Are you sure you want to delete this student?
          {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteStudent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Students;




