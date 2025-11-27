import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  createEmployeeApi,
  getEmployeesByCompanyApi,
  updateEmployeeApi,
  getEmployeeLevels,
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

const Employee = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employee");
  const [formModalIsOpen, setFormModalIsOpen] = useState(false);
  // ✅ Component code
  const companyId = localStorage.getItem("companyId");
  const [levels, setLevels] = useState([]);
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
  useEffect(() => {
    const fetchLevels = async () => {
      const data = await getEmployeeLevels();
      setLevels(data);
    };
    fetchLevels();
  }, []);
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const companyId = localStorage.getItem("companyId");
  //     if (!companyId) {
  //       alert("Company ID not found. Please login again.");
  //       return;
  //     }

  //     // keep consistent with your working code
  //     const payload = {
  //       ...formData,
  //       companyId: companyId, // ✅ backend expects this
  //     };

  //     if (editingId) {
  //       // For update, backend is fine with same payload
  //       await updateEmployeeApi(editingId, payload);
  //       alert("Employee updated successfully!");
  //     } else {
  //       await createEmployeeApi(payload);
  //       alert("Employee created successfully!");
  //     }

  //     setFormData(initialFormState);
  //     setEditingId(null);
  //     closeModal();
  //     fetchEmployees();
  //   } catch (err) {
  //     console.error(
  //       "Error saving employee:",
  //       err.response?.data || err.message
  //     );
  //     alert("Failed to save employee.");
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // ✅ Basic front-end validation
  //   const requiredFields = [
  //     "firstName",
  //     "lastName",
  //     "employeeLevel",
  //     "email",
  //     "phoneNumber",
  //     "whatsappNumber",
  //     "gender",
  //     "maritalStatus",
  //     "dateOfBirth",
  //     "dateOfJoining",
  //   ];

  //   for (const field of requiredFields) {
  //     if (!formData[field]) {
  //       alert(`Please fill the required field: ${field}`);
  //       return;
  //     }
  //   }

  //   try {
  //     const companyId = localStorage.getItem("companyId");
  //     if (!companyId) {
  //       alert("Company ID not found. Please login again.");
  //       return;
  //     }

  //     const payload = { ...formData, companyId };
  //     await createEmployeeApi(payload);

  //     alert("Employee added successfully!");
  //     onEmployeeAdded();
  //     onClose();
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to add employee.");
  //   }
  // };

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // ✅ Basic front-end validation
  //   const requiredFields = [
  //     "firstName",
  //     "lastName",
  //     "employeeLevel",
  //     "email",
  //     "phoneNumber",
  //     "whatsappNumber",
  //     "gender",
  //     "maritalStatus",
  //     "dateOfBirth",
  //     "dateOfJoining",
  //   ];

  //   for (const field of requiredFields) {
  //     if (!formData[field]) {
  //       alert(`Please fill the required field: ${field}`);
  //       return;
  //     }
  //   }

  //   try {
  //     const companyId = localStorage.getItem("companyId");
  //     if (!companyId) {
  //       alert("Company ID not found. Please login again.");
  //       return;
  //     }

  //     const payload = { ...formData, companyId };
  //     const response = await createEmployeeApi(payload);

  //     console.log("Create Employee API Response:", response);

  //     if (response?.status === 200 || response?.status === 201) {
  //       alert("✅ Employee added successfully!");
  //       onEmployeeAdded();
  //       onClose();
  //     } else {
  //       alert("⚠️ Employee added but response status was unexpected.");
  //       console.warn("Unexpected response:", response);
  //     }
  //   } catch (error) {
  //     console.error("❌ Error in Employee Creation:", error);

  //     // More specific feedback
  //     if (error.response) {
  //       alert(`Failed to add employee: ${error.response.data.message || error.message}`);
  //     } else {
  //       alert("Failed to add employee. Please try again.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic front-end validation
    const requiredFields = [
      "firstName",
      "lastName",
      "employeeLevel",
      "email",
      "phoneNumber",
      "whatsappNumber",
      "gender",
      "maritalStatus",
      "dateOfBirth",
      "dateOfJoining",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the required field: ${field}`);
        return;
      }
    }

    try {
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        alert("Company ID not found. Please login again.");
        return;
      }

      const payload = { ...formData, companyId };
      await createEmployeeApi(payload);

      alert("Employee added successfully!");
      onEmployeeAdded();
      onClose();
    } catch (error) {
      console.error(error);
      // alert("Failed to add employee.");
    }
  };

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
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        contentLabel="Employee Modal"
        className="employee-modal"
      >
        <h1>{editingId ? "Edit Employee" : "Add New Employee"}</h1>

        {/* Tab Buttons */}
        <div className="tab-buttons">
          {["employee", "event", "contact", "dependent"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "employee"
                ? "Employee Info"
                : tab === "event"
                ? "Important Date"
                : tab === "contact"
                ? "Contact Info"
                : "Dependent Info"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Employee Info Tab */}
          {activeTab === "employee" && (
            <div className="tab-content grid-2col">
              <div>
                <label>
                  First Name<span className="required">*</span>
                </label>
                <input
                  name="firstName"
                  onChange={handleChange}
                  value={formData.firstName}
                  required
                />
              </div>
              <div>
                <label>
                  Last Name<span className="required">*</span>
                </label>
                <input
                  required
                  name="lastName"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </div>

              <div>
                <label>
                  Employee Code<span className="required">*</span>
                </label>
                <input
                  required
                  placeholder="Auto Generated"
                  name="employeeCode"
                  value={formData.employeeCode}
                  disabled
                />
              </div>
              <div>
                <label>
                  Employee Level<span className="required">*</span>
                </label>
                <select
                  required
                  name="employeeLevel"
                  onChange={handleChange}
                  value={formData.employeeLevel}
                >
                  <option value="">Select level</option>
                  {levels.map((lvl) => (
                    <option key={lvl._id} value={lvl.level}>
                      {lvl.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>
                  Employee Email ID<span className="required">*</span>
                </label>
                <input
                  required
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div>
                <label>
                  Phone Number<span className="required">*</span>
                </label>
                <input
                  required
                  name="phoneNumber"
                  onChange={handleChange}
                  value={formData.phoneNumber}
                />
              </div>

              <div>
                <label>
                  WhatsApp Number<span className="required">*</span>
                </label>
                <input
                  required
                  name="whatsappNumber"
                  onChange={handleChange}
                  value={formData.whatsappNumber}
                />
              </div>
              <div>
                <label>
                  Gender<span className="required">*</span>
                </label>
                <select
                  required
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label>
                  Marital Status<span className="required">*</span>
                </label>
                <select
                  required
                  name="maritalStatus"
                  onChange={handleChange}
                  value={formData.maritalStatus}
                >
                  <option value="">Select marital status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>

              <div>
                <label>Manager Name</label>
                <input
                  name="managerName"
                  onChange={handleChange}
                  value={formData.managerName}
                />
              </div>
              <div>
                <label>Manager Email ID</label>
                <input
                  name="managerEmail"
                  onChange={handleChange}
                  value={formData.managerEmail}
                />
              </div>
            </div>
          )}

          {/* Event Info */}
          {activeTab === "event" && (
            <div className="tab-content grid-2col">
              <div>
                <label>
                  Date of Birth<span className="required">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  value={formData.dateOfBirth || ""}
                />
              </div>
              <div>
                <label>
                  Date of Joining<span className="required">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="dateOfJoining"
                  onChange={handleChange}
                  value={formData.dateOfJoining || ""}
                />
              </div>
              <div>
                <label>Date of Anniversary</label>
                <input
                  type="date"
                  name="anniversaryDate"
                  onChange={handleChange}
                  value={formData.anniversaryDate || ""}
                />
              </div>
            </div>
          )}

          {/* Contact Info */}
          {activeTab === "contact" && (
            <div className="tab-content grid-2col">
              <div>
                <label>Primary Address</label>
                <input
                  style={{ height: "100px" }}
                  name="primaryAddress"
                  onChange={handleChange}
                  value={formData.primaryAddress}
                />
              </div>
              <div>
                <label>Secondary Address</label>
                <input
                  style={{ height: "100px" }}
                  name="secondaryAddress"
                  onChange={handleChange}
                  value={formData.secondaryAddress}
                />
              </div>
              <div>
                <label>Pincode</label>
                <input
                  name="pincode"
                  onChange={handleChange}
                  value={formData.pincode}
                />
              </div>
              <div>
                <label>City</label>
                <input
                  name="city"
                  onChange={handleChange}
                  value={formData.city}
                />
              </div>
              <div>
                <label>State</label>
                <input
                  name="state"
                  onChange={handleChange}
                  value={formData.state}
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  name="country"
                  onChange={handleChange}
                  value={formData.country}
                />
              </div>
            </div>
          )}

          {/* Dependent Info */}
          {/* {activeTab === "dependent" && (
            <div className="tab-content">
              <h4>Spouse Info</h4>
              <p></p>
              <div className="grid-2col">
                <div>
                  <label>Spouse First Name</label>
                  <input
                    style={{ width: "218%" }}
                    name="spouseFirstName"
                    onChange={handleChange}
                    value={formData.spouseFirstName}
                  />
                </div>
                <div>
                  <label>Spouse Last Name</label>
                  <input
                    style={{ width: "218%", marginLeft: "106%" }}
                    name="spouseLastName"
                    onChange={handleChange}
                    value={formData.spouseLastName}
                  />
                </div>
                <div>
                  <label>Spouse Email</label>
                  <input
                    name="spouseEmail"
                    onChange={handleChange}
                    value={formData.spouseEmail}
                  />
                </div>
                <div>
                  <label>Spouse DOB</label>
                  <input
                    type="date"
                    name="spouseDob"
                    onChange={handleChange}
                    value={formData.spouseDob}
                  />
                </div>
                <div>
                  <label>Spouse Phone</label>
                  <input
                    name="spousePhone"
                    onChange={handleChange}
                    value={formData.spousePhone}
                  />
                </div>
              </div>
              <p></p>
              <h4>Child 1 Info</h4>
              <p></p>
              <div className="grid-2col">
                <div>
                  <label>Child 1 Name</label>
                  <input
                    name="child1Name"
                    onChange={handleChange}
                    value={formData.child1Name}
                  />
                </div>
                <div>
                  <label>Child 1 Gender</label>
                  <select
                    name="child1Gender"
                    onChange={handleChange}
                    value={formData.child1Gender}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label>Child 1 DOB</label>
                  <input
                    type="date"
                    name="child1Dob"
                    onChange={handleChange}
                    value={formData.child1Dob}
                  />
                </div>
              </div>
              <p></p>
              <h4>Child 2 Info</h4>
              <p></p>
              <div className="grid-2col">
                <div>
                  <label>Child 2 Name</label>
                  <input
                    name="child2Name"
                    onChange={handleChange}
                    value={formData.child2Name}
                  />
                </div>
                <div>
                  <label>Child 2 Gender</label>
                  <select
                    name="child2Gender"
                    onChange={handleChange}
                    value={formData.child2Gender}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label>Child 2 DOB</label>
                  <input
                    type="date"
                    name="child2Dob"
                    onChange={handleChange}
                    value={formData.child2Dob}
                  />
                </div>
              </div>
              <p></p>
              <div className="form-footer">
                <button type="submit">
                  {editingId ? "Update Employee" : "Add Employee"}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          )} */}

          {activeTab === "dependent" && (
            <div className="tab-content">
              <h4>Spouse Info</h4>
              <p></p>
              <div className="grid-2col">
                <div className="spouse" style={{ width: "200%" }}>
                  <div>
                    <label>Spouse First Name</label>
                    <input
                      name="spouseFirstName"
                      onChange={handleChange}
                      value={formData.spouseFirstName}
                    />
                  </div>
                  <div>
                    <label>Spouse Last Name</label>
                    <input
                      name="spouseLastName"
                      onChange={handleChange}
                      value={formData.spouseLastName}
                    />
                  </div>
                </div>
                <div
                  className="spouse"
                  style={{ width: "200%", marginLeft: "103%" }}
                >
                  <div>
                    <label>Spouse Email</label>
                    <input
                      name="spouseEmail"
                      onChange={handleChange}
                      value={formData.spouseEmail}
                    />
                  </div>
                  <div>
                    <label>Spouse DOB</label>
                    <input
                      type="date"
                      name="spouseDob"
                      onChange={handleChange}
                      value={formData.spouseDob}
                    />
                  </div>
                </div>
                <div className="spouse" style={{ width: "200%" }}>
                  <div>
                    <label>Spouse Phone</label>
                    <input
                      name="spousePhone"
                      onChange={handleChange}
                      value={formData.spousePhone}
                    />
                  </div>
                </div>
              </div>
              <p></p>
              <h4>Child 1 Info</h4>
              <p></p>
              <div className="grid-2col">
                <div style={{ width: "200%" }}>
                  <div>
                    <label>Child 1 Name</label>
                    <input
                      name="child1Name"
                      onChange={handleChange}
                      value={formData.child1Name}
                    />
                  </div>
                  <div>
                    <label>Child 1 Gender</label>
                    <select
                      name="child1Gender"
                      onChange={handleChange}
                      value={formData.child1Gender}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div
                  className="spouse"
                  style={{ width: "200%", marginLeft: "103%" }}
                >
                  <div>
                    <label>Child 1 DOB</label>
                    <input
                      type="date"
                      name="child1Dob"
                      onChange={handleChange}
                      value={formData.child1Dob}
                    />
                  </div>
                </div>
              </div>
              <p></p>
              <h4>Child 2 Info</h4>
              <p></p>
              <div className="grid-2col">
                <div className="spouse" style={{ width: "200%" }}>
                  <div>
                    <label>Child 2 Name</label>
                    <input
                      name="child2Name"
                      onChange={handleChange}
                      value={formData.child2Name}
                    />
                  </div>
                  <div>
                    <label>Child 2 Gender</label>
                    <select
                      name="child2Gender"
                      onChange={handleChange}
                      value={formData.child2Gender}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div
                  className="spouse"
                  style={{ width: "200%", marginLeft: "103%" }}
                >
                  <div>
                    <label>Child 2 DOB</label>
                    <input
                      type="date"
                      name="child2Dob"
                      onChange={handleChange}
                      value={formData.child2Dob}
                    />
                  </div>
                </div>
              </div>
              <p></p>
              <div className="form-footer">
                <button type="submit">
                  {editingId ? "Update Employee" : "Add Employee"}
                </button>
                <button type="button" onClick={closeModal}>
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
