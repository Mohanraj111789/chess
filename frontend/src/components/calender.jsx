import { useState } from "react";
import "./calender.css";
import { classHistory } from "./classHistory";

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate calendar days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Format YYYY-MM-DD
  function formatDate(y, m, d) {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }

  function nextMonth() {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  }

  function prevMonth() {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  }

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(d);

  return (
    <div className="calendar-container">

      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={prevMonth}>⬅</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth}>➡</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>

        {dates.map((date, i) => {
          const fullDate =
            date ? formatDate(currentYear, currentMonth, date) : null;
          const hasClasses = fullDate && classHistory[fullDate];

          return (
            <div
              key={i}
              className={`calendar-day ${hasClasses ? "has-event" : ""}`}
              onClick={() => hasClasses && setSelectedDate(fullDate)}
            >
              {date && <span className="date-number">{date}</span>}

              {hasClasses && (
                <div className="dot"></div> // small dot like Google Calendar
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar event panel */}
      {selectedDate && (
        <div className="event-panel">
          <h3>Class History - {selectedDate}</h3>

          {classHistory[selectedDate].map((entry, index) => (
            <div className="event-card" key={index}>
              <h4>{entry.title}</h4>
              <p>{entry.desc}</p>
            </div>
          ))}

          <button className="close-btn" onClick={() => setSelectedDate(null)}>
            Close
          </button>
        </div>
      )}

    </div>
  );
}
