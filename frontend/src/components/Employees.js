import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  createEmployeeApi,
  getEmployeesByCompanyApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  bulkUploadEmployees,
} from "../api/endpoint";
import { FaEdit, FaTrash, FaPlus, FaUpload } from "react-icons/fa";

const initialFormState = {
  // Auto-set
  company: "",

  // Basic Info
  firstName: "",
  lastName: "",
  employeeCode: "",
  employeeLevel: "",

  // Manager
  managerName: "",
  managerEmail: "",

  // Contact
  email: "",
  phoneNumber: "",
  whatsappNumber: "",

  // Personal
  gender: "",
  maritalStatus: "",
  dateOfBirth: "",
  dateOfJoining: "",
  anniversaryDate: "",

  // Address
  primaryAddress: "",
  secondaryAddress: "",
  pincode: "",
  city: "",
  state: "",
  country: "",

  // Spouse
  spouseFirstName: "",
  spouseLastName: "",
  spouseDob: "",
  spouseEmail: "",
  spousePhone: "",

  // Child 1
  child1Name: "",
  child1Gender: "",
  child1Dob: "",

  // Child 2
  child2Name: "",
  child2Gender: "",
  child2Dob: "",
};

const Employee = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employee");
  const [formModalIsOpen, setFormModalIsOpen] = useState(false);
  // ✅ Component code
  const companyId = localStorage.getItem("companyId");

  // BULK UPLOAD
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openUploadModal = () => setUploadModal(true);
  const closeUploadModal = () => {
    setUploadModal(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const companyId = localStorage.getItem("companyId");
      await bulkUploadEmployees(selectedFile, companyId);
      alert("Employees uploaded successfully!");
      closeUploadModal();
      fetchEmployees(); // refresh table
    } catch (err) {
      console.error("Bulk upload error:", err.response?.data || err.message);
      alert("Failed to upload employees.");
    }
  };
  // BULKUPLOAD

  useEffect(() => {
    if (companyId) fetchEmployees();
  }, [companyId]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployeesByCompanyApi(companyId);
      console.log("API Response:", response);

      // ✅ response is already your array from backend
      if (Array.isArray(response)) {
        setEmployees(response);
      } else {
        setEmployees([]); // fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]); // prevent undefined
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        alert("Company ID not found. Please login again.");
        return;
      }

      // keep consistent with your working code
      const payload = {
        ...formData,
        companyId: companyId, // ✅ backend expects this
      };

      if (editingId) {
        // For update, backend is fine with same payload
        await updateEmployeeApi(editingId, payload);
        alert("Employee updated successfully!");
      } else {
        await createEmployeeApi(payload);
        alert("Employee created successfully!");
      }

      setFormData(initialFormState);
      setEditingId(null);
      closeModal();
      fetchEmployees();
    } catch (err) {
      console.error(
        "Error saving employee:",
        err.response?.data || err.message
      );
      alert("Failed to save employee.");
    }
  };

  // const handleEdit = (employee) => {
  //   setFormData({
  //     ...employee,
  //     company: employee.company || localStorage.getItem("companyId") || "",
  //   });
  //   setEditingId(employee._id);
  //   setModalIsOpen(true);
  // };

  const handleEdit = (employee) => {
    setFormData({
      ...employee,
      company: employee.company || localStorage.getItem("companyId") || "",
      dateOfBirth: employee.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
        : "",
      dateOfJoining: employee.dateOfJoining
        ? new Date(employee.dateOfJoining).toISOString().split("T")[0]
        : "",
      anniversaryDate: employee.anniversaryDate
        ? new Date(employee.anniversaryDate).toISOString().split("T")[0]
        : "",
      spouseDob: employee.spouseDob
        ? new Date(employee.spouseDob).toISOString().split("T")[0]
        : "",
      child1Dob: employee.child1Dob
        ? new Date(employee.child1Dob).toISOString().split("T")[0]
        : "",
      child2Dob: employee.child2Dob
        ? new Date(employee.child2Dob).toISOString().split("T")[0]
        : "",
    });
    setEditingId(employee._id);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployeeApi(id);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <p style={{ marginTop: "3%" }}></p>
      <h2 style={{ color: "black", fontSize: "30px", marginLeft: "14px" }}>
        Employee Management
      </h2>
      <div
        style={{
          display: "flex",
          marginLeft: "48%",
          gap: "5%",
          marginRight: "1%",
        }}
      >
        <button className="btn btn-primary" onClick={openModal}>
          <FaPlus /> Add Employee Individually
        </button>
        <button className="btn btn-secondary" onClick={openUploadModal}>
          <FaUpload /> Upload Excel File
        </button>
      </div>

      <p style={{ marginTop: "0%" }}></p>
      <div className="displayemployee-wrapper">
        <div className="displayemployee-scroll">
          <table className="displayemployee-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Employee Code</th>
                <th>Employee Level</th>
                <th>Email</th>
                <th>Manager Name</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      {`${emp.firstName || ""} ${emp.lastName || ""}`.trim()}
                    </td>
                    <td>{emp.employeeCode}</td>
                    <td>
                      <span className="displayemployee-levelbadge">
                        {emp.employeeLevel}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`mailto:${emp.email}`}
                        className="displayemployee-email"
                      >
                        {emp.email}
                      </a>
                    </td>
                    <td>{emp.managerName}</td>
                    <td>
                      {emp.dateOfJoining
                        ? new Date(emp.dateOfJoining)
                            .toISOString()
                            .split("T")[0]
                        : ""}
                    </td>
                    <td>
                      <button
                        className="displayemployee-btn displayemployee-btn-edit"
                        onClick={() => handleEdit(emp)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="displayemployee-btn displayemployee-btn-delete"
                        onClick={() => handleDelete(emp._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="displayemployee-nodata">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false} // prevents outside click close
        shouldCloseOnEsc={false} // prevents ESC close
        contentLabel="Employee Modal"
        className="employee-modal"
      >
        <h3>{editingId ? "Edit Employee" : "Add New Employee"}</h3>

        {/* Tab Buttons */}
        <div className="tab-buttons">
          <button
            className={activeTab === "employee" ? "active" : ""}
            onClick={() => setActiveTab("employee")}
          >
            Employee Info
          </button>
          <button
            className={activeTab === "event" ? "active" : ""}
            onClick={() => setActiveTab("event")}
          >
            Event Info
          </button>
          <button
            className={activeTab === "contact" ? "active" : ""}
            onClick={() => setActiveTab("contact")}
          >
            Contact Info
          </button>
          <button
            className={activeTab === "dependent" ? "active" : ""}
            onClick={() => setActiveTab("dependent")}
          >
            Dependent Info
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Employee Info Tab */}
          {activeTab === "employee" && (
            <div className="tab-content">
              <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                value={formData.firstName}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                value={formData.lastName}
              />
              <input
                name="employeeCode"
                placeholder="Employee Code"
                onChange={handleChange}
                value={formData.employeeCode}
              />
              <select
                name="employeeLevel"
                onChange={handleChange}
                value={formData.employeeLevel}
              >
                <option value="">Select level</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
              </select>
              <input
                name="managerName"
                placeholder="Manager Name"
                onChange={handleChange}
                value={formData.managerName}
              />
              <input
                name="managerEmail"
                placeholder="Manager Email ID"
                onChange={handleChange}
                value={formData.managerEmail}
              />
              <input
                name="email"
                placeholder="Employee Email ID"
                onChange={handleChange}
                value={formData.email}
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                value={formData.phoneNumber}
              />
              <input
                name="whatsappNumber"
                placeholder="WhatsApp Number"
                onChange={handleChange}
                value={formData.whatsappNumber}
              />
              <select
                name="gender"
                onChange={handleChange}
                value={formData.gender}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select
                name="maritalStatus"
                onChange={handleChange}
                value={formData.maritalStatus}
              >
                <option value="">Select marital status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
          )}

          {/* Event Info Tab */}
          {activeTab === "event" && (
            <div className="tab-content">
              <label>Date Of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleChange}
                value={formData.dateOfBirth || ""}
              />
              <label>Date Of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                onChange={handleChange}
                value={formData.dateOfJoining || ""}
              />
              <label>Date Of Anniversary</label>
              <input
                type="date"
                name="anniversaryDate"
                onChange={handleChange}
                value={formData.anniversaryDate || ""}
              />
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === "contact" && (
            <div className="tab-content">
              <input
                name="primaryAddress"
                placeholder="Primary Address"
                onChange={handleChange}
                value={formData.primaryAddress}
              />
              <input
                name="secondaryAddress"
                placeholder="Secondary Address"
                onChange={handleChange}
                value={formData.secondaryAddress}
              />
              <input
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
                value={formData.pincode}
              />
              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                value={formData.city}
              />
              <input
                name="state"
                placeholder="State"
                onChange={handleChange}
                value={formData.state}
              />
              <input
                name="country"
                placeholder="Country"
                onChange={handleChange}
                value={formData.country}
              />
            </div>
          )}

          {/* Dependent Info Tab */}

          {activeTab === "dependent" && (
            <div className="tab-content dependent-info">
              <h4>Spouse Info</h4>
              <p></p>
              <input
                name="spouseFirstName"
                placeholder="Spouse First Name"
                onChange={handleChange}
                value={formData.spouseFirstName}
              />
              <input
                name="spouseLastName"
                placeholder="Spouse Last Name"
                onChange={handleChange}
                value={formData.spouseLastName}
              />
              <input
                name="spouseEmail"
                placeholder="Spouse Email"
                onChange={handleChange}
                value={formData.spouseEmail}
              />
              <input
                type="date"
                name="spouseDob"
                onChange={handleChange}
                value={formData.spouseDob}
              />
              <input
                name="spousePhone"
                placeholder="Spouse Phone"
                onChange={handleChange}
                value={formData.spousePhone}
              />
              <p></p>
              <h4>Child 1 Info</h4>
              <p></p>
              <input
                name="child1Name"
                placeholder="Child 1 Name"
                onChange={handleChange}
                value={formData.child1Name}
              />
              <select
                name="child1Gender"
                onChange={handleChange}
                value={formData.child1Gender}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                name="child1Dob"
                onChange={handleChange}
                value={formData.child1Dob}
              />
              <p></p>
              <h4>Child 2 Info</h4>
              <p></p>
              <input
                name="child2Name"
                placeholder="Child 2 Name"
                onChange={handleChange}
                value={formData.child2Name}
              />
              <select
                name="child2Gender"
                onChange={handleChange}
                value={formData.child2Gender}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                name="child2Dob"
                onChange={handleChange}
                value={formData.child2Dob}
              />
              <p></p>
              <div className="form-footer">
                <button
                  style={{ backgroundColor: "#2b6cb0", height: "60px" }}
                  type="submit"
                >
                  {editingId ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    marginRight: "-18%",
                    backgroundColor: "#9ca3af",
                    color: "#fff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={uploadModal}
        onRequestClose={closeUploadModal}
        contentLabel="Upload Employee Excel"
        className="uploademployee-modal"
        overlayClassName="upload-overlay"
        // isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        // contentLabel="Employee Modal"
        // className="employee-modal"
        // overlayClassName="ReactModal__Overlay"
      >
        <h2 className="upload-title">Upload Employee Excel File</h2>
        <p className="upload-subtitle">
          Upload your file below to add or update employee details. <br />
          Make sure your file matches the required format.
        </p>

        <label className="file-label">
          <span>📂 Select Excel File:</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>

        <a href="/sample_employee.xlsx" download className="download-link">
          ⬇ Download Sample Excel Template
        </a>

        <div className="upload-actions">
          <button className="btn-cancel" onClick={closeUploadModal}>
            Cancel
          </button>
          <button
            className="btn-upload"
            onClick={handleBulkUpload}
            disabled={!selectedFile}
          >
            Upload File
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Employee;
