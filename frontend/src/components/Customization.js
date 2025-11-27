import React, { useState, useEffect } from "react";
import {
  uploadTemplateApi,
  getTemplatesApi,
  uploadLogoApi,
} from "../api/endpoint";

const Customization = () => {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [showUpload, setShowUpload] = useState(false); // template modal
  const [eventType, setEventType] = useState("");

  // Logo upload state
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplatesApi();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // Template upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !image || !eventType) {
      alert("Please provide template name, event type, and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("eventType", eventType);
    formData.append("image", image); // must match Multer

    try {
      const data = await uploadTemplateApi(formData);
      alert(data.message);
      setName("");
      setImage(null);
      setEventType("");
      setShowUpload(false);
      fetchTemplates();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  // Logo upload
  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoImage) {
      alert("Select a logo to upload");
      return;
    }

    const formData = new FormData();
    formData.append("logo", logoImage); // must match Multer

    try {
      const data = await uploadLogoApi(formData);
      alert(data.message);
      setLogoImage(null);
      setShowLogoUpload(false);
      fetchTemplates(); // refresh templates to see logo applied
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Logo upload failed!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "black", fontSize: "30px", fontWeight: "600" }}>
        🎨 Customization
      </h3>

      {/* Buttons */}
      <div
        style={{
          marginBottom: "20px",
          marginTop: "10px",
          marginLeft: "60%",
          display: "flex",
        }}
      >
        <button
          onClick={() => setShowUpload(true)}
          style={{ marginRight: "10px" }}
        >
          Upload Template
        </button>
        <button onClick={() => setShowLogoUpload(true)}>Upload Logo</button>
      </div>

      {/* Template Upload Modal */}
      {showUpload && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "500px",
            }}
          >
            <h4>Upload New Template</h4>
            <form onSubmit={handleUpload} style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Template Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "10px", width: "100%" }}
              />
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{ marginBottom: "10px", width: "100%", color: "black" }}
              >
                <option value="">Select Event Type</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding Anniversary">Wedding Anniversary</option>
                <option value="Work Anniversary">Work Anniversary</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ marginBottom: "10px", width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <button type="submit">Upload</button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  style={{ background: "#9ca3af", color: "#fff" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logo Upload Modal */}
      {showLogoUpload && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h4>Upload Logo</h4>
            <form onSubmit={handleLogoUpload} style={{ marginTop: "10px" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoImage(e.target.files[0])}
                style={{ marginBottom: "10px", width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <button type="submit">Upload Logo</button>
                <button
                  type="button"
                  onClick={() => setShowLogoUpload(false)}
                  style={{ background: "#9ca3af", color: "#fff" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display Templates (simplified rows) */}
      <div style={{ marginTop: "20px" }}>
        {["Birthday", "Wedding Anniversary", "Work Anniversary"].map((type) => (
          <div key={type} style={{ marginBottom: "30px" }}>
            <h4 style={{ marginBottom: "10px" }}>{type}</h4>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {templates
                .filter((tpl) => tpl.eventType === type)
                .slice(0, 5)
                .map((tpl) => (
                  <div
                    key={tpl._id}
                    style={{
                      textAlign: "center",
                      flex: "0 0 calc(20% - 16px)",
                    }}
                  >
                    <img
                      src={`http://localhost:5000${tpl.image}?t=${Date.now()}`} // force reload
                      // src={`http://localhost:5000${tpl.image}`}
                      alt={tpl.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                    <p style={{ marginTop: "5px" }}>{tpl.name}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customization;
