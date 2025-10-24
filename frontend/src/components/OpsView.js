// src/components/OpsView.js
import React, { useEffect, useState } from "react";
import { checkUpcomingEventsApi } from "../api/endpoint";
import { Button, Table, Input, Select, Space } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

const OpsView = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    occasion: "All",
    relation: "All",
  });

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await checkUpcomingEventsApi();
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Handle Search
  const handleSearch = (value) => {
    setSearch(value);
    applyFilters({ ...filters }, value);
  };

  // Handle Filter Change
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters, search);
  };

  // Unified Filter Logic
  const applyFilters = (updatedFilters, searchValue) => {
    let filtered = [...events];

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

    setFilteredEvents(filtered);
  };

  // CSV Export
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

  // Refresh single event after generating image
  const handleGenerateImage = async (eventId) => {
    // Fetch latest data for this event
    try {
      const updatedEvents = await checkUpcomingEventsApi();
      setEvents(updatedEvents || []);
      setFilteredEvents(updatedEvents || []);
    } catch (error) {
      console.error("Error refreshing event:", error);
    }
  };

  // Table Columns
  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : "-",
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
      title: "Email",
 dataIndex: "emailStatus",    },
    {
      title: "WhatsApp",
      dataIndex: "whatsappStatus",
    },
    // { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: () => (
        <Button icon={<EyeOutlined />} type="default" shape="circle" />
      ),
    },
  ];

  return (
    <div className="ops-view-container">
      <h2 style={{ color: "black" }}>Ops View List</h2>
      <p style={{ color: "black" }}>Manage events for the next 7 days</p>

      <div className="ops-filters">
        <Space wrap>
          {/* Occasion Filter */}
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

          {/* Relation Filter */}
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

          {/* Search box */}
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />

          {/* Download button */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={downloadCSV}
          >
            Download Data
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filteredEvents}
        columns={columns}
        rowKey={(row) => row._id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OpsView;
