import React, { useState, useEffect } from "react";
import {
  registerUserApi,
  getUsersApi,
  getAllCompaniesApi,
  updateUserApi,
  deleteUserApi,
  getCalendarEvents,
  getHrCustomEventsApi,
  createHrCustomEventApi,
} from "../api/endpoint";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiUsers, FiGift, FiCalendar } from "react-icons/fi"; // for tabs
import Swal from "sweetalert2";

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState("administrators");
  const [calendarEvents, setCalendarEvents] = useState([]); // ✅ for Excel events
  const [customForm, setCustomForm] = useState({
    eventName: "",
    eventDate: "",
    description: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobilenumber: "",
    role: "",
    companyId: "",
  });
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (activeTab === "events") {
      fetchCalendarEvents();
    }
  }, [activeTab]);
  const fetchCalendarEvents = async () => {
    try {
      const res = await getCalendarEvents();
      setCalendarEvents(res);
    } catch (err) {
      console.error("Failed to fetch calendar events:", err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsersApi();
      setUsers(res);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompaniesApi();
      setCompanies(res);
    } catch (err) {
      console.error("Failed to fetch companies:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUserApi(formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
      });
      fetchUsers();
      setFormData({
        name: "",
        username: "",
        email: "",
        mobilenumber: "",
        role: "",
        companyId: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit User",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${user.name}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <input id="swal-username" class="swal2-input" placeholder="Username" value="${user.username}">
        <input id="swal-mobile" class="swal2-input" placeholder="Mobile" value="${user.mobilenumber}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById("swal-name").value,
          email: document.getElementById("swal-email").value,
          username: document.getElementById("swal-username").value,
          mobilenumber: document.getElementById("swal-mobile").value,
        };
      },
    });

    if (formValues) {
      try {
        const res = await updateUserApi(user.id, formValues);
        Swal.fire("Updated!", res.message, "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to update user", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await deleteUserApi(id);
        Swal.fire("Deleted!", res.message, "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete user", "error");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#B22222", marginBottom: "4px" }}>Admin Panel</h2>
      <p style={{ color: "#666" }}>
        Manage administrators, catalog, and event calendar
      </p>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2px",
          margin: "20px 0",
          background: "#f1f6fb",
          borderRadius: "12px",
          padding: "5px",
        }}
      >
        <TabButton
          label="Administrators"
          icon={<FiUsers />}
          active={activeTab === "administrators"}
          onClick={() => setActiveTab("administrators")}
        />
        <TabButton
          label="Catalog"
          icon={<FiGift />}
          active={activeTab === "catalog"}
          onClick={() => setActiveTab("catalog")}
        />
        <TabButton
          label="Events Calendar"
          icon={<FiCalendar />}
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "administrators" && (
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left Card */}
          <div style={leftCardStyle}>
            <h3 style={{ color: "#005f8f", marginBottom: "15px" }}>
              Add New Administrator
            </h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label>Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <label>Username:</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <label>Mobile Number:</label>
              <input
                name="mobilenumber"
                value={formData.mobilenumber}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="Operation Manager">Operation Manager</option>
                <option value="HR">HR</option>
              </select>
              <label>Company:</label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">-- Select Company --</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.customerName}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>

          {/* Right Card */}
          <div style={rightCardStyle}>
            <h3 style={{ marginBottom: "15px", color: "black" }}>
              Current Administrators
            </h3>
            {users.length === 0 ? (
              <p style={{ color: "#999" }}>No administrators found.</p>
            ) : (
              users.map((user) => (
                <div key={user.id} style={userCardStyle}>
                  <div>
                    <h4 style={{ margin: "0 0 5px 0" }}>{user.name}</h4>
                    <p style={{ margin: "0", color: "#555" }}>{user.email}</p>
                    <p style={{ margin: "0", color: "#555" }}>
                      {user.mobilenumber}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      marginLeft: "30%",
                      gap: "10%",
                    }}
                  >
                    <span style={activeBadge}>Active</span>
                    <button onClick={() => handleEdit(user)} style={editBtn}>
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={deleteBtn}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "catalog" && (
        <div style={rightCardStyle}>
          <h3 style={{ marginBottom: "15px" }}>Catalog</h3>
          <p style={{ color: "#555" }}>
            Here you can manage your catalog (placeholder UI).
          </p>
        </div>
      )}

      {/* ✅ Events Calendar */}
      {activeTab === "events" && (
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Default Calendar Events */}
          <div style={leftCardStyle}>
            <h3 style={{ color: "rgb(91 33 182 / var(--tw-text-opacity, 1))" }}>
              Default Calendar Events
            </h3>
            <button
              onClick={fetchCalendarEvents}
              style={{
                color: "black",
                background: "#f1e7ff",
                border: "1px solid #ccc",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              📑 View Excel Data
            </button>
            {calendarEvents.length > 0 ? (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Scope</th>
                    <th>Category</th>
                    <th>Suggested Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarEvents.map((e, i) => (
                    <tr key={i}>
                      <td>{e.eventName}</td>
                      <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                      <td>{e.scope}</td>
                      <td>{e.category}</td>
                      <td>{e.suggestedActivities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p
                style={{
                  color: "rgb(91 33 182 / var(--tw-text-opacity, 1))",
                }}
              >
                Click to view the complete event calendar data
              </p>
            )}
          </div>

          {/* Add Custom Event */}
          <div style={rightCardStyle}>
            <h3 style={{ color: "#d35400" }}>Add Custom Event</h3>
            <p></p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await createHrCustomEventApi(customForm);
                  Swal.fire(
                    "Success",
                    "Event created successfully!",
                    "success"
                  );
                  setCustomForm({
                    eventName: "",
                    eventDate: "",
                    description: "",
                  });
                } catch (err) {
                  Swal.fire(
                    "Error",
                    err.message || "Failed to add event",
                    "error"
                  );
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="Enter event name"
                value={customForm.eventName}
                onChange={(e) =>
                  setCustomForm({ ...customForm, eventName: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="date"
                value={customForm.eventDate}
                onChange={(e) =>
                  setCustomForm({ ...customForm, eventDate: e.target.value })
                }
                required
                style={inputStyle}
              />
              <textarea
                placeholder="Enter event description"
                value={customForm.description}
                onChange={(e) =>
                  setCustomForm({ ...customForm, description: e.target.value })
                }
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>
                + Add Custom Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Tab Button Component
const TabButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: active ? "white" : "transparent",
      color: active ? "black" : "#555",
      fontWeight: active ? "bold" : "normal",
      cursor: "pointer",
    }}
  >
    {icon} {label}
  </button>
);

// ✅ Styles
const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  outline: "none",
  fontSize: "16px",
};
const buttonStyle = {
  marginTop: "10px",
  padding: "10px",
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};
const leftCardStyle = {
  flex: 1,
  background: "#e6f2ff",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};
const rightCardStyle = {
  flex: 1,
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  background: "linear-gradient(135deg, #fff7e0, #ffe5b4)", // ✅ soft yellow gradient
  border: "1px solid #f5c06b",
};
const userCardStyle = {
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "10px",
  display: "flex",
  color: "black",
  marginBottom: "10px",
  background: "#fafafa",
};
const activeBadge = {
  background: "#d4edda",
  color: "#155724",
  padding: "2px 6px",
  borderRadius: "5px",
  fontSize: "12px",
  height: "29%",
  marginTop: "10%",
};
const editBtn = {
  marginRight: "10px",
  padding: "5px 10px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  maxWidth: "30%",
  height: "70%",
  borderRadius: "4px",
  cursor: "pointer",
};
const deleteBtn = {
  padding: "5px 10px",
  background: "#dc3545",
  maxWidth: "30%",
  height: "70%",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};
export default AdminScreen;
