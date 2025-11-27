import React, { useState, useEffect } from "react";
import {
  getSubscriptionsApi,
  saveSubscriptionsApi,
  saveGiftPreferencesApi,
  getCustomEventsApi,
  saveCustomEventApi,
  saveCalendarSelectedEventsApi,
  saveSelectedEventsApi,
  getSelectedEventsApi,
  deleteCustomEvent,
  updateCustomEvent,
  getAllCalendarEventsApi,
  getEmployeeLevels,
  getEdibleGifts,
  getCustomGifts,
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
  const [levels, setLevels] = useState([]); // store fetched levels
  const [selectedLevel, setSelectedLevel] = useState(null); // selected level
  const [customEvents, setCustomEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState([]); // ✅ Track selected events
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 🎁 Separate states for gift preferences
  const [birthdayPrefs, setBirthdayPrefs] = useState({});
  const [workAnnPrefs, setWorkAnnPrefs] = useState({});
  const [weddingAnnPrefs, setWeddingAnnPrefs] = useState({});
  const levelOptions = [
    { value: "L1", label: "L1" },
    { value: "L2", label: "L2" },
    { value: "L3", label: "L3" },
  ];
  const [edibleGiftOptions, setEdibleGiftOptions] = useState([]);
  const [customGiftOptions, setCustomGiftOptions] = useState([]);

  // persons enabled based on Standard Subscription
  const getEnabledPersons = (occasionType) => {
    return subscriptions
      .filter((sub) => sub[occasionType] === true)
      .map((sub) => sub.personType);
  };
  const resetGiftPreferences = () => {
    setBirthdayPrefs({});
    setWorkAnnPrefs({});
    setWeddingAnnPrefs({});
    setActiveSubTab("Birthday"); // go back to first gift tab
  };

  useEffect(() => {
    const fetchGifts = async () => {
      const edibleData = await getEdibleGifts();
      const customData = await getCustomGifts();

      // Convert backend data → dropdown label/value format
      setEdibleGiftOptions(
        edibleData.map((gift) => ({
          value: gift._id, // actual DB id
          label: `${gift.description} (${gift.eat_id})`, // display
          description: gift.description,
          eat_id: gift.eat_id,
        }))
      );

      setCustomGiftOptions(
        customData.map((gift) => ({
          value: gift._id,
          label: `${gift.description} (${gift.custom_id})`,
          description: gift.description,
          custom_id: gift.custom_id,
        }))
      );
    };

    fetchGifts();
  }, []);
  useEffect(() => {
    const fetchLevels = async () => {
      const data = await getEmployeeLevels(); // call API
      // Transform the backend data into { value, label } format for <Select>
      const options = data.map((item) => ({
        value: item.level,
        label: `Level ${item.level}`,
      }));
      setLevels(options);
    };

    fetchLevels();
  }, []);

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

  const handleSaveCustomSelectedEvents = async () => {
    try {
      await saveSelectedEventsApi(selectedEventIds);
      alert("Custom selected events saved successfully!");
      setSelectedEventIds([]); // reset
    } catch (err) {
      console.error("Error saving custom selected events", err);
      alert("Failed to save custom selected events.");
    }
  };

  const handleSaveCalendarSelectedEvents = async () => {
    try {
      const selectedEventsData = selectedEventIds.map((id) => ({
        eventId: id,
        giftProposal: giftInputs[id] || "",
        budget: budgetInputs[id] || "",
      }));

      // ✅ Pass to API
      await saveCalendarSelectedEventsApi(selectedEventsData);

      alert("✅ Calendar events saved successfully!");
      setSelectedEventIds([]);
    } catch (err) {
      console.error("Error saving selected calendar events", err);
      alert("Failed to save calendar events.");
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
        [key]: true,
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

      // ✅ ensure correct occasion flag is set
      if (occasion === "birthday") updated[idx].birthday = true;
      if (occasion === "work_anniversary") updated[idx].work_anniversary = true;
      if (occasion === "wedding_anniversary")
        updated[idx].wedding_anniversary = true;
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

  // ✅ Handle next navigation
  // const handleNext = async () => {
  //   if (activeSubTab === "Subscription") setActiveSubTab("Birthday");
  //   else if (activeSubTab === "Birthday") {
  //     await saveGiftPreferences("birthday");
  //     setActiveSubTab("Work Anniversary");
  //   } else if (activeSubTab === "Work Anniversary") {
  //     await saveGiftPreferences("work_anniversary");
  //     setActiveSubTab("Wedding Anniversary");
  //   } else {
  //     await saveGiftPreferences("wedding_anniversary");
  //     alert("🎉 All preferences saved successfully!");
  //   }
  // };

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
      // Last tab
      await saveGiftPreferences("wedding_anniversary");

      // 🎉 Reset all 3 tabs for new level selection
      resetGiftPreferences();

      alert(
        "🎉 All gift preferences saved for this level! You can now select a new level."
      );
    }
  };

  const saveGiftPreferences = async (occasionType) => {
    let dataToSave;
    if (occasionType === "birthday") dataToSave = birthdayPrefs;
    else if (occasionType === "work_anniversary") dataToSave = workAnnPrefs;
    else dataToSave = weddingAnnPrefs;

    if (!selectedLevel) {
      alert("Please select subscription level before saving.");
      return;
    }

    const payload = Object.entries(dataToSave).map(([personType, prefs]) => ({
      occasionType,
      personType,
      whatsapp: prefs.whatsapp || false,
      email: prefs.email || false,
      edibleGift: prefs.edibleGift || [],
      customGift: prefs.customGift || [],
      // level: selectedLevel,
      level: selectedLevel?.value || selectedLevel, // ✅ FIX
    }));

    try {
      await saveGiftPreferencesApi(payload);
      alert(`${occasionType.replace("_", " ")} preferences saved!`);
    } catch (err) {
      console.error("Error saving preferences", err);
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
  const handleCalenderGiftChange = (eventId, value) => {
    setGiftInputs((prev) => ({
      ...prev,
      [eventId]: value,
    }));
  };
  // ✅ Gift preferences (separated by occasion)
  const handleGiftChange = (occasion, person, key, value) => {
    let stateUpdater;
    let currentPrefs;

    if (occasion === "birthday") {
      currentPrefs = { ...birthdayPrefs };
      stateUpdater = setBirthdayPrefs;
    } else if (occasion === "work_anniversary") {
      currentPrefs = { ...workAnnPrefs };
      stateUpdater = setWorkAnnPrefs;
    } else {
      currentPrefs = { ...weddingAnnPrefs };
      stateUpdater = setWeddingAnnPrefs;
    }

    if (!currentPrefs[person]) currentPrefs[person] = {};
    currentPrefs[person][key] = value;
    stateUpdater(currentPrefs);
  };

  // Budget input handler
  const handleBudgetChange = (eventId, value) => {
    setBudgetInputs((prev) => ({
      ...prev,
      [eventId]: value,
    }));
  };

  // ✅ Render Gift Table
  const renderGiftTable = (occasionType, prefs) => (
    <div className="subsc-gift-table-wrapper">
      {/* ✅ Place dropdown ABOVE the table title */}

      {/* {activeSubTab !== "Subscription" && (
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <h3 className="subsc-gift-heading">{activeSubTab}</h3>

          <Select
            style={{ width: 150 }}
            options={levels} // ✅ dynamic options from DB
            value={selectedLevel}
            onChange={(val) => setSelectedLevel(val)}
            // value={
            //   selectedLevel
            //     ? { value: selectedLevel, label: `Level ${selectedLevel}` }
            //     : null
            // }
            // onChange={(val) => setSelectedLevel(val)}
            placeholder="Select Level"
          />
        </div>
      )} */}

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
        {/* <tbody>
          {initialPeople.map((person) => { */}
        <tbody>
          {getEnabledPersons(
            occasionType === "birthday"
              ? "birthday"
              : occasionType === "work_anniversary"
              ? "work_anniversary"
              : "wedding_anniversary"
          ).map((person) => {
            const row = prefs[person] || {};
            const isWhatsappSelected = row.whatsapp;
            const isEmailSelected = row.email;
            const hasEdibleGift = row.edibleGift && row.edibleGift.length > 0;
            const hasCustomGift = row.customGift && row.customGift.length > 0;

            return (
              <tr key={person}>
                <td>{person}</td>

                {/* ✅ Whatsapp */}
                <td className={isWhatsappSelected ? "selected-cell" : ""}>
                  <input
                    type="checkbox"
                    checked={isWhatsappSelected || false}
                    onChange={(e) =>
                      handleGiftChange(
                        occasionType,
                        person,
                        "whatsapp",
                        e.target.checked
                      )
                    }
                  />
                </td>

                {/* ✅ Email */}
                <td className={isEmailSelected ? "selected-cell" : ""}>
                  <input
                    type="checkbox"
                    checked={isEmailSelected || false}
                    onChange={(e) =>
                      handleGiftChange(
                        occasionType,
                        person,
                        "email",
                        e.target.checked
                      )
                    }
                  />
                </td>

                {/* ✅ Edible Gifts */}
                <td className={hasEdibleGift ? "selected-cell" : ""}>
                  <Select
                    className="gift-select"
                    isMulti
                    options={edibleGiftOptions}
                    value={(row.edibleGift || []).map((g) => ({
                      value: g.id,
                      label: `${g.description} (${g.eat_id})`,
                      id: g.id,
                      eat_id: g.eat_id,
                      description: g.description,
                    }))}
                    onChange={(selected) =>
                      handleGiftChange(
                        occasionType,
                        person,
                        "edibleGift",
                        selected.map((s) => ({
                          id: s.value,
                          eat_id: s.eat_id,
                          description: s.description,
                        }))
                      )
                    }
                    placeholder="Select edible gifts"
                  />
                </td>

                {/* ✅ Custom Gifts */}
                <td className={hasCustomGift ? "selected-cell" : ""}>
                  <Select
                    className="gift-select"
                    isMulti
                    options={customGiftOptions}
                    value={(row.customGift || []).map((g) => ({
                      value: g.id,
                      label: `${g.description} (${g.custom_id})`,
                      id: g.id,
                      custom_id: g.custom_id,
                      description: g.description,
                    }))}
                    onChange={(selected) =>
                      handleGiftChange(
                        occasionType,
                        person,
                        "customGift",
                        selected.map((s) => ({
                          id: s.value,
                          custom_id: s.custom_id,
                          description: s.description,
                        }))
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

  // ✅ Main render table switch
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
                        checked={row.birthday || false}
                        onChange={() =>
                          handleCheckboxChange(person, "birthday")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.work_anniversary || false}
                        onChange={() =>
                          handleCheckboxChange(person, "work_anniversary")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
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
    } else if (activeSubTab === "Birthday")
      return renderGiftTable("birthday", birthdayPrefs);
    else if (activeSubTab === "Work Anniversary")
      return renderGiftTable("work_anniversary", workAnnPrefs);
    else return renderGiftTable("wedding_anniversary", weddingAnnPrefs);
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
          {/* Level Dropdown under Sub Tabs */}
          {activeSubTab !== "Subscription" && (
            <div
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <Select
                style={{ width: 180 }}
                options={levels}
                value={selectedLevel}
                onChange={(val) => setSelectedLevel(val)}
                placeholder="Select Level"
              />
            </div>
          )}
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
                                      handleCalenderGiftChange(
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
                onClick={handleSaveCalendarSelectedEvents}
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
                onClick={handleSaveCustomSelectedEvents}
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
