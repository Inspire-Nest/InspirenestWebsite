import React, { useEffect, useState } from "react";
import { getSelectedEventsApi } from "../api/endpoint";

const SelectedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getSelectedEventsApi();
        setEvents(data);
      } catch (err) {
        setError("Failed to fetch selected events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p className="selectedEvent-loading">Loading...</p>;
  if (error) return <p className="selectedEvent-error">{error}</p>;

  return (
    <div className="selectedEvent-container">
      <h2 className="selectedEvent-title">Selected Events</h2>
      <table className="selectedEvent-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Required Gifts</th>
            <th>Budget per Gift</th>
            <th>Total Budget</th>
            {/* <th>Selected At</th> */}
          </tr>
        </thead>
        <tbody>
          {events.map((item) => (
            <tr key={item._id}>
              <td>{item.eventId?.nameOfEvent}</td>
              <td>{new Date(item.eventId?.date).toLocaleDateString()}</td>
              <td>{item.eventId?.requiredGifts}</td>
              <td>₹{item.eventId?.budgetPerGift}</td>
              <td>₹{item.eventId?.totalBudget}</td>
              {/* <td>{new Date(item.selectedAt).toLocaleString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedEvents;
