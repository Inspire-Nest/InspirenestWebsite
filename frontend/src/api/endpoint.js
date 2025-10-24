import axios from "axios";

const API_URL = "http://localhost:5000/api"; // update with your backend URL
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendOtpRequestApi = async (email) => {
  const response = await axios.post(`${API_URL}/otp-login`, { email });
  return response.data;
};

export const verifyOtpApi = async (email, otp) => {
  const response = await axios.post(`${API_URL}/otp-verify`, { email, otp });
  return response.data;
};

// CREATE a new company
export const createCompanyApi = async (companyData) => {
  const response = await axios.post(`${API_URL}/create`, companyData);
  return response.data;
};

// READ all companies
export const getAllCompaniesApi = async () => {
  const response = await axios.get(`${API_URL}/company/`);
  return response.data;
};

// READ a single company by ID
export const getCompanyByIdApi = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// UPDATE a company
export const updateCompanyApi = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// DELETE a company
export const deleteCompanyApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const createCompanyAPI = (data) =>
  axios.post(`${API_URL}/company/create`, data);
export const getAllCompaniesAPI = () => axios.get(`${API_URL}/company/`);
export const getCompanyByIdAPI = (id) => axios.get(`${API_URL}/company/${id}`);
export const updateCompanyAPI = (id, data) =>
  axios.put(`${API_URL}/company/${id}`, data);
export const deleteCompanyAPI = (id) =>
  axios.delete(`${API_URL}/company/${id}`);

// ✅ 👤 Get current logged-in user profile
export const getCurrentUserAPI = () => axios.get(`${API_URL}/user/`);

// Create individual employee
export const createEmployeeApi = async (employeeData) => {
  const response = await axios.post(`${API_URL}/create`, employeeData);
  return response.data;
};

// ✅ API function (no changes)
export const getEmployeesByCompanyApi = async (companyId) => {
  const response = await axios.get(
    `${API_URL}/employees/companies/${companyId}`
  );
  return response.data; // returns actual data from backend
};

// Update employee by ID
export const updateEmployeeApi = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// Delete employee by ID
export const deleteEmployeeApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Bulk upload employees (Excel File Upload)
export const bulkUploadEmployeesApi = async (file, companyId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("company", companyId); // required for backend

  const response = await axios.post(`${API_URL}/bulk-upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Subscription APIs
export const getSubscriptionsApi = () => axios.get(`${API_URL}/subscription`);
export const saveSubscriptionsApi = (data) =>
  axios.post(`${API_URL}/save`, data);

// Gift Preferences APIs
export const saveGiftPreferencesApi = (data) =>
  axios.post(`${API_URL}/giftsave`, data);

export const getPreferencesByOccasionApi = (occasionType) =>
  axios.get(`${API_URL}/${occasionType}`);

// 🔽 Add these for custom events
export const getCustomEventsApi = () =>
  axios.get(`${API_URL}/get/custom-events`);
export const saveCustomEventApi = (data) =>
  axios.post(`${API_URL}/custom-events`, data);

export const fetchTemplates = async () => {
  const res = await axios.get(`${API_URL}/templates`);
  return res.data;
};

export const registerUserApi = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Get Users
export const getUsersApi = async () => {
  const response = await axios.get(`${API_URL}/user`);
  return response.data;
};

export const updateUserApi = (id, data) =>
  fetch(`${API_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deleteUserApi = (id) =>
  fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());

export const saveSelectedEventsApi = async (selectedEventIds) => {
  return await axios.post(`${API_URL}/events/save`, { selectedEventIds });
};

export const getCalendereventsApi = async () => {
  const res = await axios.get(`${API_URL}/get/manual`);
  return res.data;
};
// Get events by month
export const getCalendarEventsApi = async (month, year) => {
  const res = await axios.get(`${API_URL}/events/monthly`, {
    params: { month, year },
  });
  return res.data; // array of events
};

// Upload bulk employees
export const bulkUploadEmployees = async (file, companyId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("company", companyId); // send company id if required

  const response = await axios.post(`${API_URL}/bulk-upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 📌 CALENDAR EVENTS (Excel Uploads)
// ==========================

// ✅ Upload Excel file
export const uploadCalendarEvents = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/calendar-events/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ✅ Get all events (view uploaded Excel data)
export const getCalendarEvents = async () => {
  const response = await axios.get(`${API_URL}/calendar-events`);
  return response.data;
};

// ✅ Get event by ID
export const getCalendarEventById = async (id) => {
  const response = await axios.get(`${API_URL}/calendar-events/${id}`);
  return response.data;
};

// ✅ Update event by ID
export const updateCalendarEvent = async (id, eventData) => {
  const response = await axios.put(
    `${API_URL}/calendar-events/${id}`,
    eventData
  );
  return response.data;
};

// ✅ Delete event by ID
export const deleteCalendarEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/calendar-events/${id}`);
  return response.data;
};

// HR_CUSTOM_EVENT
// ✅ Custom Events
export const createHrCustomEventApi = async (data) => {
  const res = await axios.post(`${API_URL}/events`, data);
  return res.data;
};

export const getHrCustomEventsApi = async () => {
  const res = await axios.get(`${API_URL}/events`);
  return res.data;
};

// VENDOR
// Create Vendor
export const createVendor = async (vendorData) => {
  const response = await axios.post(`${API_URL}/vendor`, vendorData);
  return response.data;
};

// Get all Vendors
export const getVendors = async () => {
  const response = await axios.get(`${API_URL}/vendor`);
  return response.data;
};

// Get Vendor by ID
export const getVendorById = async (id) => {
  const response = await axios.get(`${API_URL}/vendor/${id}`);
  return response.data;
};

// Update Vendor
export const updateVendor = async (id, vendorData) => {
  const response = await axios.put(`${API_URL}/vendor/${id}`, vendorData);
  return response.data;
};

// Delete Vendor
export const deleteVendor = async (id) => {
  const response = await axios.delete(`${API_URL}/vendor/${id}`);
  return response.data;
};

// Update event
export const updateCustomEvent = async (id, eventData) => {
  const res = await axios.put(
    `${API_URL}/update/custom-events/${id}`,
    eventData
  );
  return res.data;
};

// Delete event
export const deleteCustomEvent = async (id) => {
  const res = await axios.delete(`${API_URL}/delete/custom-events/${id}`);
  return res.data;
};

// ✅ Upload a new template (with image)
export const uploadTemplateApi = async (formData) => {
  const response = await axios.post(`${API_URL}/templates`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ✅ Get all templates
export const getTemplatesApi = async () => {
  const response = await axios.get(`${API_URL}/templates`);
  return response.data;
};

// ✅ Get template by name
export const getTemplateByNameApi = async (name) => {
  const response = await axios.get(`${API_URL}/templates/${name}`);
  return response.data;
};

// GET: fetch selected manual events
export const getSelectedManualEventsApi = async () => {
  const response = await axios.get(`${API_URL}/manual`);
  return response.data;
};

export const getSelectedEventsApi = async () => {
  const response = await axios.get(`${API_URL}/selected-events`);
  return response.data;
};

// Upload logo
export const uploadLogoApi = async (formData) => {
  const response = await axios.post(`${API_URL}/upload/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✅ Trigger backend to check and store new upcoming events
export const checkUpcomingEventsApi = async () => {
  const response = await axios.get(`${API_URL}/events/upcoming-events`);
  return response.data.data; // your backend returns { message, total, data: [...] }
};

export const getAllCalendarEventsApi = async () => {
  const response = await axios.get(`${API_URL}/calendarevents/cal`);
  return response.data;
};

export const getNextCustomerIdAPI = async () => {
  const response = await axios.get(`${API_URL}/company/next-id`);
  return response.data;
};
