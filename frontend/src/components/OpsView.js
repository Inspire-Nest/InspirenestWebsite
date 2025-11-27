// src/components/OpsView.js
import React, { useEffect, useState } from "react";
import { openEditor, getEditorDefaults } from "@pqina/pintura";
import "@pqina/pintura/pintura.css";
import {
  checkUpcomingEventsApi,
  getEmployeeByIdApi,
  uploadEditedTemplateApi,
} from "../api/endpoint";
import {
  Button,
  Table,
  Input,
  Select,
  Space,
  DatePicker,
  Modal,
  Tabs,
} from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  InfoCircleOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);

const { Option } = Select;

const OpsView = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    occasion: "All",
    relation: "All",
  });
  const [employeeGiftData, setEmployeeGiftData] = useState(null);
  const [loadingEmployeeGifts, setLoadingEmployeeGifts] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState({
    edibleGifts: [],
    customGifts: [],
  });

  // const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Image editor states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const openImageEditor = (row) => {
    setSelectedEventId(row._id);
    setImageToEdit(`http://localhost:5000${row.templateImage}`);

    openEditor({
      src: `http://localhost:5000${row.templateImage}`,
      ...getEditorDefaults(),
      onProcess: (output) => handleEditedImage(output),
    });
  };

  const handleEditedImage = async (output) => {
    try {
      const file = await output.process();

      const formData = new FormData();
      formData.append("editedImage", file);

      await uploadEditedTemplateApi(selectedEventId, formData);

      fetchEvents();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleViewEmployee = async (employeeId) => {
    console.log("Employee ID being sent:", employeeId);

    if (!employeeId) {
      console.error("Employee ID is missing!");
      return;
    }

    try {
      const data = await getEmployeeByIdApi(employeeId);
      setSelectedEmployee(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    setFilteredEvents(events); // we keep your existing list logic untouched
  }, [events]);

  // const openModal = async (row) => {
  //   setSelectedEvent(row);
  //   setIsModalVisible(true);

  //   try {
  //     setLoadingEmployeeGifts(true);

  //     const res = await getEmployeeByIdApi(row.employeeId || row.employee?._id);

  //     setEmployeeGiftData({
  //       edibleGifts: res.edibleGifts || [],
  //       customGifts: res.customGifts || [],
  //     });

  //     setSelectedEmployee(res); // ⭐ IMPORTANT
  //   } catch (error) {
  //     console.error("Error fetching employee gifts:", error);
  //     setEmployeeGiftData({ edibleGifts: [], customGifts: [] });
  //   } finally {
  //     setLoadingEmployeeGifts(false);
  //   }
  // };

  const openModal = async (row) => {
    setSelectedEvent(row);
    setIsModalVisible(true);

    try {
      setLoadingEmployeeGifts(true);

      const employeeId = row.employeeId || row.employee?._id;

      const empDetails = await getEmployeeByIdApi(employeeId);

      setSelectedEmployee(empDetails); // store full employee details

      setEmployeeGiftData({
        edibleGifts: empDetails.edibleGifts || [],
        customGifts: empDetails.customGifts || [],
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
    } finally {
      setLoadingEmployeeGifts(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  // const fetchEvents = async () => {
  //   try {
  //     const data = await checkUpcomingEventsApi();
  //     setEvents(data || []);
  //     setFilteredEvents(data || []);
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //   }
  // };

  const fetchEvents = async () => {
    try {
      const data = await checkUpcomingEventsApi();

      // fetch edible gifts for EACH employee
      const enriched = await Promise.all(
        (data || []).map(async (event) => {
          try {
            const empId = event?.employeeId || event?.employee?._id;

            if (!empId) {
              console.warn("⚠ Missing employee ID for event:", event);
              return { ...event, edibleGifts: [], customGifts: [] };
            }

            const emp = await getEmployeeByIdApi(empId);

            return {
              ...event,
              edibleGifts: emp.edibleGifts || [],
              customGifts: emp.customGifts || [],
            };
          } catch (err) {
            console.error("Error fetching employee gifts:", err);
            return { ...event, edibleGifts: [], customGifts: [] };
          }
        })
      );

      setEvents(enriched);
      setFilteredEvents(enriched);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    applyFilters(filters, value, dateFilter, fromDate, toDate);
  };

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters, search, dateFilter, fromDate, toDate);
  };

  const applyFilters = (
    updatedFilters,
    searchValue,
    dFilter = dateFilter,
    fDate = fromDate,
    tDate = toDate
  ) => {
    let filtered = [...events];
    const today = dayjs();

    if (updatedFilters.occasion !== "All") {
      filtered = filtered.filter(
        (e) =>
          e.eventType &&
          e.eventType.toLowerCase() === updatedFilters.occasion.toLowerCase()
      );
    }

    if (updatedFilters.relation !== "All") {
      filtered = filtered.filter(
        (e) =>
          e.relation &&
          e.relation.toLowerCase() === updatedFilters.relation.toLowerCase()
      );
    }

    if (searchValue) {
      filtered = filtered.filter(
        (ev) =>
          ev.employeeName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          ev.companyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          ev.eventType?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (dFilter === "Today") {
      filtered = filtered.filter((e) =>
        dayjs(e.eventDate).isSame(today, "day")
      );
    }

    if (dFilter === "Tomorrow") {
      filtered = filtered.filter((e) =>
        dayjs(e.eventDate).isSame(today.add(1, "day"), "day")
      );
    }

    if (dFilter === "This Week") {
      filtered = filtered.filter((e) =>
        dayjs(e.eventDate).isBetween(
          today.startOf("week"),
          today.endOf("week"),
          "day",
          "[]"
        )
      );
    }

    if (dFilter === "Custom" && fDate && tDate) {
      filtered = filtered.filter((e) =>
        dayjs(e.eventDate).isBetween(fDate, tDate, "day", "[]")
      );
    }

    setFilteredEvents(filtered);
  };

  const downloadCSV = () => {
    const csvContent = [
      [
        "S.No",
        "Event Date",
        "Occasion",
        "Name of Employee",
        "Company Name",
        "Relation",
        "Email",
        "WhatsApp",
        "Gift",
        "Status",
      ].join(","),
      ...filteredEvents.map(
        (e, index) =>
          `${index + 1},${e.eventDate?.slice(0, 10) || "-"},${
            e.eventType || "-"
          },${e.employeeName || "-"},${e.companyName || "-"},${
            e.relation || "-"
          },${e.email || "-"},${e.whatsappNumber || "-"},${e.status || "-"}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "upcoming_events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateImage = async () => {
    const updatedEvents = await checkUpcomingEventsApi();
    setEvents(updatedEvents || []);
    setFilteredEvents(updatedEvents || []);
  };

  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    { title: "Occasion", dataIndex: "eventType" },
    { title: "Name of Employee", dataIndex: "employeeName" },
    { title: "Company Name", dataIndex: "companyName" },
    { title: "Relation", dataIndex: "relation" },
    {
      title: "Image",
      dataIndex: "templateImage",
      render: (img, row) =>
        img ? (
          <img
            src={`http://localhost:5000${img}`}
            alt="Template"
            width={80}
            style={{ borderRadius: 5 }}
          />
        ) : (
          <Button onClick={() => handleGenerateImage(row._id)}>Generate</Button>
        ),
    },

    {
      title: "Edit & Upload",
      render: (_, row) => (
        <Button type="link" onClick={() => openImageEditor(row)}>
          Edit & Upload
        </Button>
      ),
    },
    { title: "Email", dataIndex: "emailStatus" },
    { title: "WhatsApp", dataIndex: "whatsappStatus" },
    {
      title: "Gift",
      render: (_, row) =>
        row?.edibleGifts?.length
          ? row.edibleGifts.map((g) => g.eat_id).join(", ")
          : "-",
    },
    {
      title: "Actions",
      render: (_, row) => (
        <EyeOutlined
          style={{ fontSize: "18px", cursor: "pointer", color: "#1890ff" }}
          onClick={() => openModal(row)}
        />
      ),
    },
  ];

  return (
    <div className="ops-view-container">
      <h2 style={{ color: "black" }}>Ops View List</h2>
      <p style={{ color: "black" }}>Manage events</p>

      <Space wrap>
        {/* Filters */}
        <Select
          defaultValue="All"
          onChange={(val) => handleFilterChange("occasion", val)}
          style={{ width: 200 }}
        >
          <Option value="All">All Occasion</Option>
          <Option value="Work Anniversary">Work Anniversary</Option>
          <Option value="Wedding Anniversary">Wedding Anniversary</Option>
          <Option value="Birthday">Birthday</Option>
        </Select>

        <Select
          defaultValue="All"
          onChange={(val) => handleFilterChange("relation", val)}
          style={{ width: 180 }}
        >
          <Option value="All">All Relation</Option>
          <Option value="Employee">Employee</Option>
          <Option value="Spouse">Spouse</Option>
          <Option value="Child">Child</Option>
        </Select>

        <Select
          defaultValue="All"
          style={{ width: 160 }}
          onChange={(val) => {
            setDateFilter(val);
            applyFilters(filters, search, val, fromDate, toDate);
          }}
        >
          <Option value="All">All Dates</Option>
          <Option value="Today">Today</Option>
          <Option value="Tomorrow">Tomorrow</Option>
          <Option value="This Week">This Week</Option>
          <Option value="Custom">Custom Range</Option>
        </Select>

        {dateFilter === "Custom" && (
          <>
            <DatePicker
              placeholder="From"
              onChange={(date) => {
                setFromDate(date);
                applyFilters(filters, search, dateFilter, date, toDate);
              }}
            />

            <DatePicker
              placeholder="To"
              onChange={(date) => {
                setToDate(date);
                applyFilters(filters, search, dateFilter, fromDate, date);
              }}
            />
          </>
        )}

        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200, height: "30px", marginTop: "9px" }}
        />

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downloadCSV}
        >
          Download Data
        </Button>
      </Space>

      <Table
        dataSource={filteredEvents}
        columns={columns}
        rowKey={(row) => row._id}
        pagination={{ pageSize: 10 }}
      />

      {/* ---------------------- MODAL ---------------------- */}
      {/* ---------------- POPUP MODAL ---------------- */}
      <Modal
        title="Employee & Event Details"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={850}
        className="opsview-details-modal"
      >
        {selectedEvent && (
          <Tabs defaultActiveKey="1" tabBarStyle={{ marginBottom: 20 }}>
            {/* ===================================================
         TAB 1: EVENT INFORMATION
      =================================================== */}
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Event Information
                </span>
              }
              key="1"
            >
              <div className="tab-content">
                <p>
                  <b>Name of Employee:</b> {selectedEvent.employeeName}
                </p>
                <p>
                  <b>Occasion:</b> {selectedEvent.eventType}
                </p>
                <p>
                  <b>Event Date:</b> {selectedEvent.eventDate}
                </p>
                <p>
                  <b>Relation:</b> {selectedEvent.relation}
                </p>
                <p>
                  <b>Company:</b> {selectedEvent.companyName}
                </p>
              </div>
            </TabPane>

            {/* ===================================================
         TAB 2: DELIVERY ITEMS
      =================================================== */}
            <TabPane
              tab={
                <span>
                  <GiftOutlined style={{ marginRight: 8 }} />
                  Delivery Items
                </span>
              }
              key="2"
            >
              <div className="tab-content">
                {loadingEmployeeGifts ? (
                  <p>Loading gifts…</p>
                ) : (
                  <>
                    <p>
                      <b>Edible Gifts:</b>{" "}
                      {selectedEmployee?.edibleGifts?.length
                        ? selectedEmployee.edibleGifts
                            .map((g) => g.description || g.description)
                            .join(", ")
                        : "-"}
                    </p>

                    <p>
                      <b>Custom Gifts:</b>{" "}
                      {selectedEmployee?.customGifts?.length
                        ? selectedEmployee.customGifts
                            .map((g) => g.description)
                            .join(", ")
                        : "-"}
                    </p>
                  </>
                )}
              </div>
            </TabPane>

            {/* ===================================================
         TAB 3: EXECUTION STATUS
      =================================================== */}
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined style={{ marginRight: 8 }} />
                  Execution Status
                </span>
              }
              key="3"
            >
              <div className="tab-content">
                <p>
                  <b>Email Status:</b> {selectedEvent.emailStatus || "Not Sent"}
                </p>

                <p>
                  <b>WhatsApp Status:</b>{" "}
                  {selectedEvent.whatsappStatus || "Not Sent"}
                </p>

                <p>
                  <b>Edible Gifts:</b>{" "}
                  {selectedEmployee?.edibleGifts?.length
                    ? selectedEmployee.edibleGifts
                        .map((g) => g.description || g.eat_id)
                        .join(", ")
                    : "-"}
                </p>

                <p>
                  <b>Image:</b>{" "}
                  {selectedEvent?.templateImage ? (
                    <>
                      <span style={{ color: "green", fontWeight: 600 }}>
                        Generated
                      </span>
                      <br />
                      <img
                        className="gift-image"
                        src={`http://localhost:5000${selectedEvent.templateImage}`}
                        alt="Template"
                        width={120}
                        style={{ marginTop: 6, borderRadius: 6 }}
                      />
                    </>
                  ) : (
                    <span style={{ color: "red", fontWeight: 600 }}>
                      Pending
                    </span>
                  )}
                </p>
              </div>
            </TabPane>

            {/* ===================================================
         TAB 4: DELIVERY INFORMATION (Address)
      =================================================== */}
            <TabPane
              tab={
                <span>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  Delivery Information
                </span>
              }
              key="4"
            >
              <div className="tab-content">
                {selectedEmployee ? (
                  <>
                    <p>
                      <b>Address:</b> {selectedEmployee.primaryAddress || "-"}
                    </p>
                    <p>
                      <b>City:</b> {selectedEmployee.city || "-"}
                    </p>
                    <p>
                      <b>State:</b> {selectedEmployee.state || "-"}
                    </p>
                    <p>
                      <b>Pincode:</b> {selectedEmployee.pincode || "-"}
                    </p>
                    <p>
                      <b>Country:</b> {selectedEmployee.country || "-"}
                    </p>
                  </>
                ) : (
                  <p>Loading address...</p>
                )}
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default OpsView;
