import React, { useState, useEffect } from "react";
import {
  getSubscriptionsApi,
  saveSubscriptionsApi,
  saveGiftPreferencesApi,
  getCustomEventsApi,
  saveCustomEventApi,
  saveSelectedEventsApi,
  getSelectedEventsApi,
  deleteCustomEvent,
  updateCustomEvent,
  getAllCalendarEventsApi,
} from "../api/endpoint";
import Select from "react-select";
import { FaEdit, FaTrash } from "react-icons/fa";

const initialPeople = ["Employee", "Spouse", "Kid - 1", "Kid - 2"];
const subTabs = [
  "Subscription",
  "Birthday",
  "Work Anniversary",
  "Wedding Anniversary",
];
const topTabs = ["Standard Subscription", "Calendar of Events", "Custom"];
const edibleGiftOptions = ["Chocolate Box", "Fruit Basket", "Cake"];
const customGiftOptions = ["Coffee Mug", "Keychain", "T-Shirt"];

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState("Standard Subscription");
  const [activeSubTab, setActiveSubTab] = useState("Subscription");
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [giftInputs, setGiftInputs] = useState({});
  const [budgetInputs, setBudgetInputs] = useState({});
  const [customEventForm, setCustomEventForm] = useState({
    date: "",
    nameOfEvent: "",
    requiredGifts: "",
    budgetPerGift: "",
    totalBudget: "",
  });
  const [customEvents, setCustomEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState([]); // ✅ Track selected events
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [birthdaySubs, setBirthdaySubs] = useState([]);
  const [workAnnSubs, setWorkAnnSubs] = useState([]);
  const [weddingAnnSubs, setWeddingAnnSubs] = useState([]);
  useEffect(() => {
    fetchEvents(); // now it works
  }, []);
  useEffect(() => {
    if (activeTopTab === "Calendar of Events") {
      fetchAllEvents();
    }
  }, [activeTopTab]);

  const fetchAllEvents = async () => {
    try {
      const data = await getAllCalendarEventsApi();
      setCalendarEvents(data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  // ✅ Handle checkbox toggle
  const handleEventSelect = (eventId) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // ✅ Save selected events
  const handleSaveSelectedEvents = async () => {
    try {
      await saveSelectedEventsApi(selectedEventIds);
      alert("Selected events saved successfully!");
      setSelectedEventIds([]); // reset
    } catch (err) {
      console.error("Error saving selected events", err);
      alert("Failed to save selected events.");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await getCustomEventsApi();
      setEvents(res.data); // adjust if API response is { message, count, data }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch events");
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event); // load event into form
    setEditModalOpen(true); // open modal
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteCustomEvent(id);
      await getCustomEvents();
    }
  };

  useEffect(() => {
    getSubscriptions();
    getCustomEvents();
    fetchSelectedEvents();

    if (activeTopTab === "Calendar of Events") {
      fetchAllEvents(); // 👈 call only the getAllCalendarEventsApi() version
    }
  }, [activeTopTab]);

  const fetchSelectedEvents = async () => {
    try {
      const res = await getSelectedEventsApi();
      // Map only eventId._id or eventId if not populated
      const ids = res.data.map((item) =>
        item.eventId?._id ? item.eventId._id : item.eventId
      );
      setSelectedEventIds(ids);
    } catch (err) {
      console.error("Error fetching selected events", err);
    }
  };

  const handleCustomInputChange = (e) => {
    const { name, value } = e.target;
    setCustomEventForm({ ...customEventForm, [name]: value });
  };

  const handleCustomEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCustomEventApi(customEventForm);
      alert("Custom event added!");
      setCustomEventForm({
        date: "",
        nameOfEvent: "",
        requiredGifts: "",
        budgetPerGift: "",
        totalBudget: "",
      });
      getCustomEvents();
    } catch (err) {
      console.error("Error saving custom event", err);
      alert("Failed to save event.");
    }
  };

  const getCustomEvents = async () => {
    try {
      const res = await getCustomEventsApi();
      setCustomEvents(res.data);
    } catch (err) {
      console.error("Error fetching custom events", err);
    }
  };

  const getSubscriptions = async () => {
    try {
      const res = await getSubscriptionsApi();
      setSubscriptions(res.data);
    } catch (err) {
      console.error("Error fetching subscriptions", err);
    }
  };

  const handleCheckboxChange = (person, key) => {
    const updated = [...subscriptions];
    const idx = updated.findIndex((item) => item.personType === person);

    if (idx !== -1) {
      updated[idx][key] = !updated[idx][key];
    } else {
      updated.push({
        personType: person,
        birthday: key === "birthday",
        work_anniversary: key === "work_anniversary",
        wedding_anniversary: key === "wedding_anniversary",
      });
    }

    setSubscriptions(updated);
  };

  const handleSelectChange = (person, occasion, key, value) => {
    const updated = [...subscriptions];
    const idx = updated.findIndex((item) => item.personType === person);

    if (idx !== -1) {
      updated[idx][key] = value; // now array for edibleGift/customGift
      updated[idx][occasion] = true;
    } else {
      updated.push({
        personType: person,
        [key]: value,
        [occasion]: true,
      });
    }

    setSubscriptions(updated);
  };
  const handleSave = async () => {
    try {
      const companyId = localStorage.getItem("companyId"); // ✅ get company id

      if (!companyId) {
        alert("Company ID missing — please log in again.");
        return;
      }

      // attach company to every subscription
      const updatedSubs = subscriptions.map((sub) => ({
        ...sub,
        company: companyId,
      }));

      await saveSubscriptionsApi(updatedSubs);
      alert("Subscriptions saved!");
    } catch (err) {
      console.error("Error saving subscriptions", err);
      alert("Failed to save subscriptions.");
    }
  };

  const handleNext = async () => {
    if (activeSubTab === "Subscription") {
      setActiveSubTab("Birthday");
    } else if (activeSubTab === "Birthday") {
      await saveGiftPreferences("birthday");
      setActiveSubTab("Work Anniversary");
    } else if (activeSubTab === "Work Anniversary") {
      await saveGiftPreferences("work_anniversary");
      setActiveSubTab("Wedding Anniversary");
    } else {
      await saveGiftPreferences("wedding_anniversary");
      alert("All preferences saved successfully!");
    }
  };

  const saveGiftPreferences = async (occasionType) => {
    const preferences = subscriptions
      .filter((item) => item[occasionType])
      .map((item) => ({
        occasionType,
        personType: item.personType,
        whatsapp: item.whatsapp || false,
        email: item.email || false,
        edibleGift: item.edibleGift || "",
        customGift: item.customGift || "",
      }));

    try {
      await saveGiftPreferencesApi(preferences);
      console.log(`${occasionType} preferences saved!`);
    } catch (err) {
      console.error(`Error saving ${occasionType} preferences`, err);
    }
  };

  // Group events by month
  const groupByMonth = (events) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const grouped = {};
    events.forEach((event) => {
      const date = new Date(event.eventDate);
      const monthName = months[date.getMonth()];
      if (!grouped[monthName]) grouped[monthName] = [];
      grouped[monthName].push(event);
    });
    return grouped;
  };

  // Toggle expand/collapse for month
  const toggleMonth = (month) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  // Gift input handler
  const handleGiftChange = (eventId, value) => {
    setGiftInputs((prev) => ({ ...prev, [eventId]: value }));
  };

  // Budget input handler
  const handleBudgetChange = (eventId, value) => {
    setBudgetInputs((prev) => ({ ...prev, [eventId]: value }));
  };

  const renderGiftTable = (occasionKey) => {
    return (
      <div className="subsc-gift-table-wrapper">
        <h3 className="subsc-gift-heading">{activeSubTab}</h3>
        <table className="subsc-gift-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Whatsapp</th>
              <th>Email</th>
              <th>Edible Gifts</th>
              <th>Custom Gifts</th>
            </tr>
          </thead>
          <tbody>
            {initialPeople.map((person) => {
              const row =
                subscriptions.find((s) => s.personType === person) || {};
              return (
                <tr key={person}>
                  <td>{person}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.whatsapp || false}
                      onChange={() =>
                        handleSelectChange(
                          person,
                          occasionKey,
                          "whatsapp",
                          !row.whatsapp
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.email || false}
                      onChange={() =>
                        handleSelectChange(
                          person,
                          occasionKey,
                          "email",
                          !row.email
                        )
                      }
                    />
                  </td>

                  <td>
                    <Select
                      isMulti
                      options={edibleGiftOptions.map((gift) => ({
                        value: gift,
                        label: gift,
                      }))}
                      value={(row.edibleGift || []).map((gift) => ({
                        value: gift,
                        label: gift,
                      }))}
                      onChange={(selected) =>
                        handleSelectChange(
                          person,
                          occasionKey,
                          "edibleGift",
                          selected.map((s) => s.value)
                        )
                      }
                      placeholder="Select edible gifts"
                    />
                  </td>
                  <td>
                    <Select
                      isMulti
                      options={customGiftOptions.map((gift) => ({
                        value: gift,
                        label: gift,
                      }))}
                      value={(row.customGift || []).map((gift) => ({
                        value: gift,
                        label: gift,
                      }))}
                      onChange={(selected) =>
                        handleSelectChange(
                          person,
                          occasionKey,
                          "customGift",
                          selected.map((s) => s.value)
                        )
                      }
                      placeholder="Select custom gifts"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTable = () => {
    if (activeSubTab === "Subscription") {
      return (
        <div className="subsc-table-container">
          <h1 className="subsc-title">Standard Subscription</h1>
          <table className="subsc-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Birthday</th>
                <th>Work Anniversary</th>
                <th>Wedding Anniversary</th>
              </tr>
            </thead>
            <tbody>
              {initialPeople.map((person) => {
                const row =
                  subscriptions.find((s) => s.personType === person) || {};
                return (
                  <tr key={person}>
                    <td>{person}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="subsc-checkbox"
                        checked={row.birthday || false}
                        onChange={() =>
                          handleCheckboxChange(person, "birthday")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="subsc-checkbox"
                        checked={row.work_anniversary || false}
                        onChange={() =>
                          handleCheckboxChange(person, "work_anniversary")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="subsc-checkbox"
                        checked={row.wedding_anniversary || false}
                        onChange={() =>
                          handleCheckboxChange(person, "wedding_anniversary")
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else {
      const key = activeSubTab.toLowerCase().replace(/ /g, "_");
      return renderGiftTable(key);
    }
  };

  return (
    <div className="subsc-container">
      <h2>Subscription & Event Calendar</h2>

      {/* Top Tabs */}
      <div className="subsc-top-tabs">
        {topTabs.map((tab) => (
          <div
            key={tab}
            className={`subsc-top-tab ${
              activeTopTab === tab ? "subsc-top-tab-active" : ""
            }`}
            onClick={() => setActiveTopTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      {activeTopTab === "Standard Subscription" && (
        <>
          <div className="subsc-sub-tabs">
            {subTabs.map((tab) => (
              <div
                key={tab}
                className={`subsc-sub-tab ${
                  activeSubTab === tab ? "subsc-sub-tab-active" : ""
                }`}
                onClick={() => setActiveSubTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="subsc-content">{renderTable()}</div>

          <div className="subsc-buttons" style={{ marginTop: "20px" }}>
            {activeSubTab !== "Wedding Anniversary" && (
              <button className="subsc-next-btn" onClick={handleNext}>
                Next
              </button>
            )}
            {activeSubTab === "Subscription" && (
              <button className="subsc-save-btn" onClick={handleSave}>
                Save
              </button>
            )}
            {activeSubTab === "Wedding Anniversary" && (
              <button className="subsc-save-btn" onClick={handleNext}>
                Save
              </button>
            )}
          </div>
        </>
      )}

      {activeTopTab === "Calendar of Events" && (
        <div className="calendar-events-container">
          <h1 className="calendar-events-title">Event Calendar</h1>
          {Object.keys(groupByMonth(calendarEvents)).length === 0 ? (
            <p>No events found.</p>
          ) : (
            <>
              {Object.entries(groupByMonth(calendarEvents)).map(
                ([month, events]) => (
                  <div key={month} className="month-section">
                    <div
                      className="month-header"
                      onClick={() => toggleMonth(month)}
                    >
                      <h3>
                        {month} ({events.length})
                      </h3>
                      <span>{expandedMonth === month ? "▲" : "▼"}</span>
                    </div>

                    {expandedMonth === month && (
                      <div className="event-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Event Name</th>
                              <th>Gift Proposal</th>
                              <th>Budget</th>
                              <th>Select</th>
                            </tr>
                          </thead>
                          <tbody>
                            {events.map((event) => (
                              <tr key={event._id}>
                                <td>
                                  {new Date(event.eventDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "short",
                                    }
                                  )}
                                </td>
                                <td>{event.eventName}</td>
                                <td>
                                  <input
                                    type="text"
                                    value={giftInputs[event._id] || ""}
                                    onChange={(e) =>
                                      handleGiftChange(
                                        event._id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter gift proposal"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={budgetInputs[event._id] || ""}
                                    onChange={(e) =>
                                      handleBudgetChange(
                                        event._id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter budget"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedEventIds.includes(
                                      event._id
                                    )}
                                    onChange={() =>
                                      handleEventSelect(event._id)
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Save Selected Events Button */}
              <button
                className="save-selected-events-btn"
                onClick={handleSaveSelectedEvents}
                disabled={selectedEventIds.length === 0}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  background: "#2b6cb0",
                  color: "white",
                  border: "none",
                  fontSize: "18px",
                  borderRadius: "5px",
                  cursor:
                    selectedEventIds.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                Save Selected Events
              </button>
            </>
          )}
        </div>
      )}

      {activeTopTab === "Custom" && (
        <div className="custom-container">
          <div className="custom-box">
            <form className="custom-form" onSubmit={handleCustomEventSubmit}>
              <h1 className="custom-title">Add Custom Event</h1>
              <div className="custom-row">
                <input
                  type="date"
                  name="date"
                  value={customEventForm.date}
                  onChange={handleCustomInputChange}
                  placeholder="Date"
                  className="custom-input"
                />
                <input
                  type="text"
                  name="nameOfEvent"
                  value={customEventForm.nameOfEvent}
                  onChange={handleCustomInputChange}
                  placeholder="Name Of The Event"
                  className="custom-input"
                />
              </div>

              <div className="custom-row">
                <input
                  type="number"
                  name="budgetPerGift"
                  value={customEventForm.budgetPerGift}
                  onChange={handleCustomInputChange}
                  placeholder="Budget per gift"
                  className="custom-input"
                />
                <input
                  type="number"
                  name="totalBudget"
                  value={customEventForm.totalBudget}
                  onChange={handleCustomInputChange}
                  placeholder="Total Budget"
                  className="custom-input"
                />
              </div>
              <textarea
                name="requiredGifts"
                value={customEventForm.requiredGifts}
                onChange={handleCustomInputChange}
                placeholder="Required Gifts"
                className="custom-textarea"
              />
              <div className="btncus">
                <button type="submit" className="custom-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="custom-events-list">
            <h1 className="custom-events-title">Custom Events</h1>
            <div className="custom-events-wrapper">
              <table className="custom-events-table">
                <thead>
                  <tr>
                    <th>Select</th> {/* ✅ New column */}
                    <th>Date</th>
                    <th>Name</th>
                    <th>Gifts</th>
                    <th>Per Gift Budget</th>
                    <th>Total Budget</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customEvents.map((event) => (
                    <tr key={event._id}>
                      <td>
                        <input
                          type="checkbox"
                          // disabled={selectedEventIds.includes(event._id)}
                          checked={selectedEventIds.includes(event._id)}
                          onChange={() => handleEventSelect(event._id)}
                        />
                      </td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.nameOfEvent}</td>
                      <td>{event.requiredGifts}</td>
                      <td>₹{event.budgetPerGift}</td>
                      <td>₹{event.totalBudget}</td>
                      <td>
                        {/* Edit button */}
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(event)}
                        >
                          <FaEdit />
                        </button>

                        {/* Delete button */}
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(event._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* ✅ Save button for selected events */}
            {customEvents.length > 0 && (
              <button
                className="custom-save-selected-btn"
                onClick={handleSaveSelectedEvents}
                disabled={selectedEventIds.length === 0}
                style={{
                  color: "white",
                  marginTop: "15px",
                  width: "20%",
                  fontSize: "18px",
                  marginLeft: "40%",
                  background: "#2b6cb0",
                }}
              >
                Save Selected Events
              </button>
            )}

            {editModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Edit Event</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateCustomEvent(editingEvent._id, editingEvent);
                      // fetchEvents();
                      await getCustomEvents();
                      setEditModalOpen(false); // close modal
                    }}
                  >
                    <label>Date:</label>
                    <input
                      className="input-custom"
                      type="date"
                      value={
                        new Date(editingEvent.date).toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          date: e.target.value,
                        })
                      }
                    />

                    <label>Name of Event:</label>
                    <input
                      className="input-custom"
                      type="text"
                      value={editingEvent.nameOfEvent}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          nameOfEvent: e.target.value,
                        })
                      }
                    />

                    <label>Required Gifts:</label>
                    <input
                      className="input-custom"
                      type="text"
                      value={editingEvent.requiredGifts}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          requiredGifts: e.target.value,
                        })
                      }
                    />

                    <label>Budget Per Gift:</label>
                    <input
                      className="input-custom"
                      type="number"
                      value={editingEvent.budgetPerGift}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          budgetPerGift: e.target.value,
                        })
                      }
                    />

                    <label>Total Budget:</label>
                    <input
                      className="input-custom"
                      type="number"
                      value={editingEvent.totalBudget}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          totalBudget: e.target.value,
                        })
                      }
                    />

                    <div className="modal-actions">
                      <button
                        style={{ backgroundColor: "#1e3a8a" }}
                        type="submit"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="cancle-btn"
                        onClick={() => setEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
