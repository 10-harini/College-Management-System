import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Marksheet.css";

const Marksheet = () => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    sub1_mark: "",
    sub1_internal: "",
    sub1_total: "",
    sub2_mark: "",
    sub2_internal: "",
    sub2_total: "",
    sub3_mark: "",
    sub3_internal: "",
    sub3_total: "",
    sub4_mark: "",
    sub4_internal: "",
    sub4_total: "",
    sub5_mark: "",
    sub5_internal: "",
    sub5_total: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8000/students").then((res) => {
      setStudents(res.data);
    });

    axios.get("http://localhost:8000/student-marks").then((res) => {
      setMarks(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const match = name.match(/sub(\d)_(mark|internal)/);
      if (match) {
        const index = match[1];
        const mark = parseInt(updated[`sub${index}_mark`]) || 0;
        const internal = parseInt(updated[`sub${index}_internal`]) || 0;
        updated[`sub${index}_total`] = mark + internal;
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/add-marks/", formData);
      alert("Marks added successfully!");
      setShowModal(false);
      setFormData({
        student_id: "",
        sub1_mark: "", sub1_internal: "", sub1_total: "",
        sub2_mark: "", sub2_internal: "", sub2_total: "",
        sub3_mark: "", sub3_internal: "", sub3_total: "",
        sub4_mark: "", sub4_internal: "", sub4_total: "",
        sub5_mark: "", sub5_internal: "", sub5_total: ""
      });

      const res = await axios.get("http://localhost:8000/student-marks");
      setMarks(res.data);
    } catch (error) {
      alert("Error submitting marks");
      console.error(error);
    }
  };

  const getStudentName = (id) => {
    const student = students.find((s) => s.std_id === id);
    return student ? student.std_name : "Unknown";
  };

  const calculateTotal = (m) => {
    return (
      (parseInt(m.sub1_total) || 0) +
      (parseInt(m.sub2_total) || 0) +
      (parseInt(m.sub3_total) || 0) +
      (parseInt(m.sub4_total) || 0) +
      (parseInt(m.sub5_total) || 0)
    );
  };

  const latestMarks = Object.values(
    marks.reduce((acc, curr) => {
      acc[curr.student_id] = curr;
      return acc;
    }, {})
  );

  return (
    <div className="marksheet-container flex-start">
      <div className="marksheet-box">
        <div className="top-header mb-5 position-relative">
          <h2 className="marksheet-title">Student Marksheet</h2>
          <button className="add-btn position-absolute end-0 top-0" onClick={() => setShowModal(true)}>
            ➕ Add Marks
          </button>
        </div>


        <table className="marks-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {latestMarks.length > 0 ? (
              latestMarks.map((m) => (
                <tr key={m.student_id}>
                  <td>{getStudentName(m.student_id)}</td>
                  <td>{calculateTotal(m)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  No data loaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal glass-modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content glass-content p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-white m-0">Enter Student Marks</h4>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <label className="form-label text-white">Student Name</label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="form-select mb-3"
              >
                <option value="">Select Student</option>
                {students.map((std) => (
                  <option key={std.std_id} value={std.std_id}>
                    {std.std_name}
                  </option>
                ))}
              </select>

              {[1, 2, 3, 4, 5].map((i) => (
                <div className="row mb-2" key={i}>
                  <div className="col-md-2 text-white">Subject {i}</div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="Mark"
                      name={`sub${i}_mark`}
                      className="form-control"
                      value={formData[`sub${i}_mark`]}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="Internal"
                      name={`sub${i}_internal`}
                      className="form-control"
                      value={formData[`sub${i}_internal`]}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="Total"
                      name={`sub${i}_total`}
                      className="form-control"
                      value={formData[`sub${i}_total`]}
                      readOnly
                    />
                  </div>
                </div>
              ))}

              <div className="text-end">
                <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                  Submit Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marksheet;

