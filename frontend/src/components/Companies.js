import React, { useEffect, useState } from "react";
import {
  getAllCompaniesAPI,
  createCompanyAPI,
  getNextCustomerIdAPI,
  updateCompanyAPI,
  deleteCompanyAPI,
  getCompanyByIdAPI,
  getCurrentUserAPI,
  getCompanyTypes,
  getCountries,
  getIndustries,
} from "../api/endpoint";
import { FaEye, FaEdit, FaTrash, FaFilter, FaArrowLeft } from "react-icons/fa";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [companyTypes, setCompanyTypes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [formData, setFormData] = useState({
    country: "",
    customerName: "",
    companyType: "",
    industry: "",
    gstrNumber: "",
    isActive: true,
    address: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    pointOfContact: {
      name: "",
      email: "",
      phone: "",
      roleInApp: "",
      designation: "",
      customerId: "",
    },
  });
  const clearFilters = () => {
    setFilterType("");
    setFilterCity("");
    setFilterStatus("");
  };

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      const data = await getIndustries();
      console.log("Industries from API:", data); // 👈 for debugging
      setIndustries(data);
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      const data = await getCompanyTypes();
      console.log("Company types:", data); // 👈 Check in console
      setCompanyTypes(data);
    };
    fetchCompanyTypes();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompaniesAPI();
      setCompanies(res.data);
    } catch (error) {
      console.error("Failed to fetch companies", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await getCurrentUserAPI();
      console.log("Fetched user role:", userRole);
      console.log("User response:", res.data); // 👈 Add this line

      // If your response is an array of users
      if (Array.isArray(res.data) && res.data.length > 0) {
        setUserRole(res.data[0].role); // ✅ Correct way
      }

      // If response is an object (alternative path)
      else if (res.data && res.data.role) {
        setUserRole(res.data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [key]: value },
      });
    } else if (name.includes("pointOfContact.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        pointOfContact: { ...formData.pointOfContact, [key]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateCompanyAPI(formData._id, formData);
      } else {
        await createCompanyAPI(formData);
      }
      setShowForm(false);
      setEditMode(false);
      setFormData({
        country: "",
        customerName: "",
        companyType: "",
        industry: "",
        gstrNumber: "",
        question: "", // ✅ new field

        isActive: true,
        address: {
          street1: "",
          street2: "",
          city: "",
          state: "",
          postalCode: "",
        },
        pointOfContact: {
          name: "",
          email: "",
          phone: "",
          roleInApp: "",
          designation: "",
          customerId: "",
        },
      });
      fetchCompanies();
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await getCompanyByIdAPI(id);
      setFormData(data);
      setEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCompanyAPI(id);
      fetchCompanies();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredCompanies = companies
    .filter((company) =>
      company.customerName?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((company) =>
      filterType ? company.companyType === filterType : true
    )
    .filter((company) =>
      filterCity ? company.address.city === filterCity : true
    )
    .filter((company) =>
      filterStatus === "true"
        ? company.isActive === true
        : filterStatus === "false"
        ? company.isActive === false
        : true
    );

  return (
    <div className="companies-container">
      {!showForm ? (
        <>
          <div className="companies-header">
            <div>
              <h1>Companies</h1>
              <p>Manage company registrations and details</p>
            </div>

            {/* <div
              className="user-role-badge"
              style={{ fontWeight: 600, color: "#2563eb", fontSize: "14px" }}
            >
              {userRole && <span>👤 Role: {userRole}</span>}
            </div> */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* <button
                className="add-company-btn"
                onClick={() => setShowForm(true)}
              >
                + Add Company
              </button> */}

              <button
                className="add-company-btn"
                onClick={async () => {
                  try {
                    const res = await getNextCustomerIdAPI();
                    const nextId = res.nextCustomerId;
                    setFormData((prev) => ({
                      ...prev,
                      pointOfContact: {
                        ...prev.pointOfContact,
                        customerId: nextId,
                      },
                    }));
                    setShowForm(true);
                  } catch (error) {
                    console.error("Failed to fetch next customer ID", error);
                    setShowForm(true);
                  }
                }}
              >
                + Add Company
              </button>
            </div>
          </div>

          <div className="company-management-box">
            <h2>Company Management</h2>
            <p>Manage all registered companies and their details</p>
            <p></p>
            <p></p>
            <div className="search-filter">
              <input
                type="text"
                placeholder="🔍 Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="filters">
                <div>
                  <FaFilter /> Filters:
                </div>

                {/* Company Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {Array.from(new Set(companies.map((c) => c.companyType))).map(
                    (type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>

                {/* City Filter */}
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {Array.from(
                    new Set(companies.map((c) => c.address.city))
                  ).map((city, idx) => (
                    <option key={idx} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                <button className="clear-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            <table className="company-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>COMPANY NAME</th>
                  <th>COMPANY TYPE</th>
                  <th>INDUSTRY</th>
                  <th>CITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company, index) => (
                  <tr key={company._id}>
                    <td>{index + 1}</td>
                    <td>{company.customerName}</td>
                    <td>{company.companyType}</td>
                    <td>{company.industry}</td>
                    <td>{company.address?.city}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          company.isActive ? "active" : "inactive"
                        }`}
                      >
                        {company.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ display: "flex" }}>
                      <button
                        className="icon-btn"
                        style={{ color: "black" }}
                        onClick={() => handleEdit(company._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={{ color: "black" }}
                        className="icon-btn"
                        onClick={() => handleDelete(company._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="company-form">
          <div style={{ display: "flex" }}>
            <button
              className="back-btn"
              onClick={() => {
                setShowForm(false);
                setEditMode(false);
              }}
            >
              <FaArrowLeft /> Back
            </button>
            <div style={{ display: "block", marginLeft: "10%" }}>
              <h2>Customer Onboarding</h2>
              <p>Complete company registration and setup</p>
            </div>
          </div>
          <div className="form-section">
            <h3>Company Information</h3>
            <div className="form-grid">
              <div>
                {/* <label>
                  Country<span className="required">*</span>
                </label> */}
                <select
                  style={{ width: "103%" }}
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleFormChange}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="customerName"
                placeholder="Company Name"
                value={formData.customerName}
                onChange={handleFormChange}
              />
              <div>
                {/* <label>
                  Company Type<span className="required">*</span>
                </label> */}
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select type</option>
                  {companyTypes.map((type) => (
                    <option key={type._id} value={type.companyType}>
                      {type.companyType}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {/* <label>
        Industry<span className="required">*</span>
      </label> */}
                <select
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleFormChange}
                >
                  <option value="">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind._id} value={ind.industryName}>
                      {ind.industryName}
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="gstrNumber"
                placeholder="GSTR Number"
                value={formData.gstrNumber}
                onChange={handleFormChange}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                />{" "}
                Active
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Address Information</h3>
            <div className="form-grid">
              <input
                name="address.street1"
                placeholder="Street 1"
                value={formData.address.street1}
                onChange={handleFormChange}
              />
              <input
                name="address.street2"
                placeholder="Street 2"
                value={formData.address.street2}
                onChange={handleFormChange}
              />
              <input
                name="address.city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleFormChange}
              />
              <input
                name="address.state"
                placeholder="State"
                value={formData.address.state}
                onChange={handleFormChange}
              />
              <input
                name="address.postalCode"
                placeholder="Postal Code"
                value={formData.address.postalCode}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Point of Contact</h3>
            <div className="form-grid">
              <input
                name="pointOfContact.name"
                placeholder="Contact Name"
                value={formData.pointOfContact.name}
                onChange={handleFormChange}
              />
              <input
                name="pointOfContact.email"
                placeholder="Email"
                value={formData.pointOfContact.email}
                onChange={handleFormChange}
              />
              <input
                name="pointOfContact.phone"
                placeholder="Phone"
                value={formData.pointOfContact.phone}
                onChange={handleFormChange}
              />
              <input
                name="pointOfContact.roleInApp"
                placeholder="Role in App"
                value={formData.pointOfContact.roleInApp}
                onChange={handleFormChange}
              />
              <input
                name="pointOfContact.designation"
                placeholder="Designation"
                value={formData.pointOfContact.designation}
                onChange={handleFormChange}
              />
              {/* <input
                name="pointOfContact.customerId"
                placeholder="Customer ID"
                value={formData.pointOfContact.customerId}
                onChange={handleFormChange}
              /> */}
              <select
                name="question"
                value={formData.question}
                onChange={handleFormChange}
              >
                <option value="">Select Question Type</option>
                <option value="categories of list">Categories of List</option>
                <option value="all employees">All Employees</option>
              </select>

              <input
                name="pointOfContact.customerId"
                placeholder="Customer ID"
                value={formData.pointOfContact.customerId}
                readOnly
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
            </div>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            {editMode ? "Update Company" : "Submit Onboarding"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Companies;
