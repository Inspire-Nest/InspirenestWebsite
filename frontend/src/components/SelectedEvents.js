import React, { useEffect, useState } from "react";
import {
  getSelectedEventsApi,
  getAllCalendarSelectedEventsApi,
} from "../api/endpoint";

const SelectedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch both APIs simultaneously
        const [selectedEvents, calendarEvents] = await Promise.all([
          getSelectedEventsApi(),
          getAllCalendarSelectedEventsApi(),
        ]);

        // Combine both results
        const mergedEvents = [...selectedEvents, ...calendarEvents];
        setEvents(mergedEvents);
      } catch (err) {
        console.error(err);
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
            <th>Gift Proposal</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((item) => (
              <tr key={item._id}>
                {/* Event Name */}
                <td>
                  {item.eventId?.nameOfEvent || item.eventId?.eventName || "-"}
                </td>

                {/* Date */}
                <td>
                  {item.eventId?.date
                    ? new Date(item.eventId.date).toLocaleDateString()
                    : item.eventId?.eventDate || "-"}
                </td>

                {/* Gift Proposal */}
                <td>
                  {item.giftProposal ||
                    item.eventId?.giftProposal ||
                    item.eventId?.requiredGifts ||
                    "-"}
                </td>

                {/* Budget */}
                <td>
                  {item.budget
                    ? `₹${item.budget}`
                    : item.eventId?.budgetPerGift
                    ? `₹${item.eventId.budgetPerGift}`
                    : item.eventId?.totalBudget
                    ? `₹${item.eventId.totalBudget}`
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedEvents;
