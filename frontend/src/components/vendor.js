import React, { useState, useEffect } from "react";
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getCurrentUserAPI,
} from "../api/endpoint";
import { Edit, Visibility, Delete, Email, Phone } from "@mui/icons-material";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    vendorType: "",
    vendorName: "",
    contactNo: "",
    mobileNo: "",
    email: "",
    gstNumber: "",
    address: {
      address1: "",
      address2: "",
      townOrVillage: "",
      city: "",
      state: "",
      pincode: "",
      gpsLocationLink: "",
    },
    managerDetails: {
      name: "",
      phone: "",
      email: "",
    },
    storeDetails: {
      generalContact: "",
    },
    headOffice: {
      address: "",
      phone: "",
      email: "",
      contactPerson: "",
      contactDesignation: "",
      contactPhone: "",
      contactEmail: "",
    },
    remark: "",
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNo: "",
      ifscCode: "",
      bankBranch: "",
      bankAddress: "",
    },
  });

  useEffect(() => {
    fetchVendors();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await getCurrentUserAPI();
      if (Array.isArray(res.data) && res.data.length > 0) {
        setUserRole(res.data[0].role);
      } else if (res.data && res.data.role) {
        setUserRole(res.data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchVendors = async () => {
    const data = await getVendors();
    setVendors(data);
  };

  const handleFormChange = (e, section, field) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleAddVendor = () => {
    setEditingVendor(null);
    setFormData({
      vendorType: "",
      vendorName: "",
      contactNo: "",
      mobileNo: "",
      email: "",
      gstNumber: "",
      address: {
        address1: "",
        address2: "",
        townOrVillage: "",
        city: "",
        state: "",
        pincode: "",
        gpsLocationLink: "",
      },
      managerDetails: {
        name: "",
        phone: "",
        email: "",
      },
      storeDetails: {
        generalContact: "",
      },
      headOffice: {
        address: "",
        phone: "",
        email: "",
        contactPerson: "",
        contactDesignation: "",
        contactPhone: "",
        contactEmail: "",
      },
      remark: "",
      bankDetails: {
        accountHolderName: "",
        bankName: "",
        accountNo: "",
        ifscCode: "",
        bankBranch: "",
        bankAddress: "",
      },
    });
    setShowForm(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setShowForm(true);
  };

  const handleDeleteVendor = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await deleteVendor(id);
      fetchVendors();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingVendor) {
      await updateVendor(editingVendor._id, formData);
    } else {
      await createVendor(formData);
    }
    setShowForm(false);
    fetchVendors();
  };

  // Stats for cards
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;
  const totalOrders = vendors.reduce((sum, v) => sum + (v.orders || 0), 0);

  return (
    <div className="vendor-container">
      <div style={{ display: "flex", gap: "40%" }}>
        <div style={{ display: "block" }}>
          <h1 style={{ color: "#92400e" }}>Vendor Management</h1>
          <p style={{ color: "#92400e" }}>
            Manage your vendor relationships and partnerships
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="vendor-cards">
        <div className="card card-blue">
          <div className="card-title">Total Vendors</div>
          <div className="card-value">{totalVendors}</div>
        </div>
        <div className="card card-green">
          <div className="card-title">Active Vendors</div>
          <div className="card-value">{activeVendors}</div>
        </div>
        <div className="card card-purple">
          <div className="card-title">Total Orders</div>
          <div className="card-value">{totalOrders}</div>
        </div>
      </div>

      {/* Directory */}
      <div className="vendor-directory">
        <div className="directory-header">
          <div className="left-section">
            <h3 style={{ fontSize: "25px", fontWeight: "600" }}>
              Vendor Directory
            </h3>
            <h5 style={{ color: "#676666ff", fontSize: "16px" }}>
              All registered vendors and their details
            </h5>
          </div>
          <button className="add-vendor-btn" onClick={handleAddVendor}>
            + Add Vendor
          </button>
        </div>

        <table className="vendor-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Contact</th>
              <th>Rating</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id}>
                <td>
                  <strong>{vendor.vendorName}</strong>
                  <br />
                  <span>
                    {vendor.address.city}, {vendor.address.state}
                  </span>
                </td>
                <td>{vendor.vendorType}</td>
                <td>
                  <Email fontSize="small" /> {vendor.email} <br />
                  <Phone fontSize="small" /> {vendor.mobileNo}
                </td>
                <td>⭐ {vendor.rating || "4.5"}</td>
                <td>{vendor.orders || 0}</td>
                <td>
                  <span className={`status ${vendor.status || "active"}`}>
                    {vendor.status || "Active"}
                  </span>
                </td>

                <td>
                  <Edit
                    style={{ fontSize: "30px", cursor: "pointer" }}
                    onClick={() => handleEditVendor(vendor)}
                  />
                  <Delete
                    style={{ fontSize: "30px", cursor: "pointer" }}
                    onClick={() => handleDeleteVendor(vendor._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Vendor Form Modal */}
      {showForm && (
        <div className="vendor-form-modal">
          <div className="vendor-form">
            <h2>{editingVendor ? "Edit Vendor" : "Add Vendor"}</h2>
            <form onSubmit={handleSubmit}>
              {/* Vendor Info */}
              <h3>Vendor Info</h3>
              <div style={{ display: "flex", gap: "15px" }}>
                <div>
                  <input
                    type="text"
                    placeholder="Vendor Name"
                    value={formData.vendorName}
                    onChange={(e) => handleFormChange(e, null, "vendorName")}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Vendor Type"
                    value={formData.vendorType}
                    onChange={(e) => handleFormChange(e, null, "vendorType")}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact No"
                    value={formData.contactNo}
                    onChange={(e) => handleFormChange(e, null, "contactNo")}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Mobile No"
                    value={formData.mobileNo}
                    onChange={(e) => handleFormChange(e, null, "mobileNo")}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleFormChange(e, null, "email")}
                    required
                  />

                  <input
                    type="text"
                    placeholder="GST Number"
                    value={formData.gstNumber}
                    onChange={(e) => handleFormChange(e, null, "gstNumber")}
                    required
                  />
                </div>
              </div>
              {/* Address */}
              <h3>Address</h3>
              <div style={{ display: "flex", gap: "15px" }}>
                <div>
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={formData.address.address1}
                    onChange={(e) => handleFormChange(e, "address", "address1")}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    value={formData.address.address2}
                    onChange={(e) => handleFormChange(e, "address", "address2")}
                  />
                  <input
                    type="text"
                    placeholder="Town / Village"
                    value={formData.address.townOrVillage}
                    onChange={(e) =>
                      handleFormChange(e, "address", "townOrVillage")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) => handleFormChange(e, "address", "city")}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) => handleFormChange(e, "address", "state")}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.address.pincode}
                    onChange={(e) => handleFormChange(e, "address", "pincode")}
                    required
                  />
                  <input
                    type="text"
                    placeholder="GPS Location Link"
                    value={formData.address.gpsLocationLink}
                    onChange={(e) =>
                      handleFormChange(e, "address", "gpsLocationLink")
                    }
                  />
                </div>
              </div>
              {/* Manager Details */}
              <h3>Manager Details</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Manager Name"
                  value={formData.managerDetails.name}
                  onChange={(e) =>
                    handleFormChange(e, "managerDetails", "name")
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Manager Phone"
                  value={formData.managerDetails.phone}
                  onChange={(e) =>
                    handleFormChange(e, "managerDetails", "phone")
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Manager Email"
                  value={formData.managerDetails.email}
                  onChange={(e) =>
                    handleFormChange(e, "managerDetails", "email")
                  }
                  required
                />
              </div>
              {/* Store Details */}
              <h3>Store Details</h3>
              <input
                type="text"
                placeholder="General Contact"
                value={formData.storeDetails.generalContact}
                onChange={(e) =>
                  handleFormChange(e, "storeDetails", "generalContact")
                }
                required
              />

              {/* Head Office */}
              <h3>Head Office</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <input
                    type="text"
                    placeholder="Head Office Address"
                    value={formData.headOffice.address}
                    onChange={(e) =>
                      handleFormChange(e, "headOffice", "address")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Head Office Phone"
                    value={formData.headOffice.phone}
                    onChange={(e) => handleFormChange(e, "headOffice", "phone")}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Head Office Email"
                    value={formData.headOffice.email}
                    onChange={(e) => handleFormChange(e, "headOffice", "email")}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Person"
                    value={formData.headOffice.contactPerson}
                    onChange={(e) =>
                      handleFormChange(e, "headOffice", "contactPerson")
                    }
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Contact Designation"
                    value={formData.headOffice.contactDesignation}
                    onChange={(e) =>
                      handleFormChange(e, "headOffice", "contactDesignation")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={formData.headOffice.contactPhone}
                    onChange={(e) =>
                      handleFormChange(e, "headOffice", "contactPhone")
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    value={formData.headOffice.contactEmail}
                    onChange={(e) =>
                      handleFormChange(e, "headOffice", "contactEmail")
                    }
                    required
                  />
                  <textarea
                    placeholder="Remark"
                    value={formData.remark}
                    onChange={(e) => handleFormChange(e, null, "remark")}
                  />
                </div>
              </div>
              {/* Bank Details */}
              <h3>Bank Details</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    value={formData.bankDetails.accountHolderName}
                    onChange={(e) =>
                      handleFormChange(e, "bankDetails", "accountHolderName")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={formData.bankDetails.bankName}
                    onChange={(e) =>
                      handleFormChange(e, "bankDetails", "bankName")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Account No"
                    value={formData.bankDetails.accountNo}
                    onChange={(e) =>
                      handleFormChange(e, "bankDetails", "accountNo")
                    }
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) =>
                      handleFormChange(e, "bankDetails", "ifscCode")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Bank Branch"
                    value={formData.bankDetails.bankBranch}
                    onChange={(e) =>
                      handleFormChange(e, "bankDetails", "bankBranch")
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Bank Address"
                    value={formData.bankDetails.bankAddress}
                    onChange={(e) =>
                      handleFormChange(e, "bankDetails", "bankAddress")
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit">
                  {editingVendor ? "Update Vendor" : "Add Vendor"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
