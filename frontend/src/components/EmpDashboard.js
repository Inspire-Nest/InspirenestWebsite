// import React, { useEffect, useState } from "react";
// import { getEmployeesByCompanyApi } from "../api/endpoint";

// const EmpDashboard = () => {
//   const [employeeCount, setEmployeeCount] = useState(0);
//   const [completedEvents, setCompletedEvents] = useState(0);
//   const [pendingEvents, setPendingEvents] = useState(0);
//   const [totalEvents, setTotalEvents] = useState(0);

//   const [weeklyCompleted, setWeeklyCompleted] = useState(0);
//   const [weeklyPending, setWeeklyPending] = useState(0);
//   const [weeklyTotal, setWeeklyTotal] = useState(0);

//   const [weeklyBirthdays, setWeeklyBirthdays] = useState(0);
//   const [weeklyWorkAnn, setWeeklyWorkAnn] = useState(0);
//   const [weeklyWeddingAnn, setWeeklyWeddingAnn] = useState(0);

//   const [todayCompleted, setTodayCompleted] = useState(0);
//   const [todayPending, setTodayPending] = useState(0);
//   const [todayTotal, setTodayTotal] = useState(0);

//   const [todayBirthdays, setTodayBirthdays] = useState(0);
//   const [todayWorkAnn, setTodayWorkAnn] = useState(0);
//   const [todayWeddingAnn, setTodayWeddingAnn] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const companyId = localStorage.getItem("companyId");
//   const currentYear = new Date().getFullYear();

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         setLoading(true);
//         const employees = await getEmployeesByCompanyApi(companyId);
//         const today = new Date();

//         // Start and end of the current week
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay());
//         weekStart.setHours(0, 0, 0, 0);

//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 6);
//         weekEnd.setHours(23, 59, 59, 999);

//         // Employees joined in current year
//         const currentYearEmployees = employees.filter((emp) => {
//           if (!emp.dateOfJoining) return false;
//           const joinYear = new Date(emp.dateOfJoining).getFullYear();
//           return joinYear === currentYear;
//         });
//         setEmployeeCount(currentYearEmployees.length);

//         // --- Initialize counters ---
//         let completed = 0,
//           pending = 0,
//           weekComp = 0,
//           weekPend = 0,
//           weekTot = 0,
//           todayComp = 0,
//           todayPend = 0,
//           todayTot = 0;

//         // extra event counts
//         let weekBday = 0,
//           weekWork = 0,
//           weekWedding = 0,
//           todayBday = 0,
//           todayWork = 0,
//           todayWedding = 0;

//         // ✅ Process each employee’s events
//         employees.forEach((emp) => {
//           const events = [
//             { type: "birthday", date: emp.dateOfBirth },
//             { type: "wedding", date: emp.anniversaryDate },
//             { type: "work", date: emp.dateOfJoining },
//           ];

//           events.forEach(({ type, date }) => {
//             if (!date) return;
//             const eventDate = new Date(date);
//             eventDate.setFullYear(currentYear); // normalize year

//             if (eventDate.getFullYear() === currentYear) {
//               // ---- Yearly summary ----
//               if (eventDate < today) completed++;
//               else pending++;

//               // ---- Weekly summary ----
//               if (eventDate >= weekStart && eventDate <= weekEnd) {
//                 weekTot++;
//                 if (eventDate < today) weekComp++;
//                 else weekPend++;

//                 // Type-specific weekly counts
//                 if (type === "birthday") weekBday++;
//                 if (type === "wedding") weekWedding++;
//                 if (type === "work") weekWork++;
//               }

//               // ---- Today's summary ----
//               if (
//                 eventDate.getDate() === today.getDate() &&
//                 eventDate.getMonth() === today.getMonth()
//               ) {
//                 todayTot++;
//                 if (eventDate < today) todayComp++;
//                 else todayPend++;

//                 // Type-specific today's counts
//                 if (type === "birthday") todayBday++;
//                 if (type === "wedding") todayWedding++;
//                 if (type === "work") todayWork++;
//               }
//             }
//           });
//         });

//         // ✅ Update yearly summary
//         setCompletedEvents(completed);
//         setPendingEvents(pending);
//         setTotalEvents(completed + pending);

//         // ✅ Weekly summary
//         setWeeklyCompleted(weekComp);
//         setWeeklyPending(weekPend);
//         setWeeklyTotal(weekTot);
//         setWeeklyBirthdays(weekBday);
//         setWeeklyWeddingAnn(weekWedding);
//         setWeeklyWorkAnn(weekWork);

//         // ✅ Today summary
//         setTodayCompleted(todayComp);
//         setTodayPending(todayPend);
//         setTodayTotal(todayTot);
//         setTodayBirthdays(todayBday);
//         setTodayWeddingAnn(todayWedding);
//         setTodayWorkAnn(todayWork);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch employee/event data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (companyId) fetchEmployeeData();
//   }, [companyId]);

//   return (
//     <div style={styles.container}>
//       <h1 style={{ color: "black" }}>Dashboard</h1>

//       {/* === Yearly Summary === */}
//       <h2 style={styles.title}>Yearly Summary ({currentYear})</h2>
//       <div style={styles.cardWrapper}>
//         <DashboardCard
//           title={`Employees Joined (${currentYear})`}
//           count={employeeCount}
//           color="#007bff"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Completed Events"
//           count={completedEvents}
//           color="#28a745"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Pending Events"
//           count={pendingEvents}
//           color="#ffc107"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Total Events"
//           count={totalEvents}
//           color="#6f42c1"
//           loading={loading}
//           error={error}
//         />
//       </div>

//       {/* === Weekly Breakdown === */}
//       <h2 style={styles.title}>Weekly Breakdown</h2>
//       <div style={styles.cardWrapper}>
//         <DashboardCard
//           title="Weekly Completed"
//           count={weeklyCompleted}
//           color="#28a745"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Weekly Pending"
//           count={weeklyPending}
//           color="#ffc107"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Weekly Total"
//           count={weeklyTotal}
//           color="#6f42c1"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Weekly Birthdays"
//           count={weeklyBirthdays}
//           color="#17a2b8"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Weekly Work Anniversaries"
//           count={weeklyWorkAnn}
//           color="#20c997"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Weekly Wedding Anniversaries"
//           count={weeklyWeddingAnn}
//           color="#e83e8c"
//           loading={loading}
//           error={error}
//         />
//       </div>

//       {/* === Today's Breakdown === */}
//       <h2 style={styles.title}>Today's Breakdown</h2>
//       <div style={styles.cardWrapper}>
//         <DashboardCard
//           title="Today's Completed"
//           count={todayCompleted}
//           color="#28a745"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Today's Pending"
//           count={todayPending}
//           color="#ffc107"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Today's Total"
//           count={todayTotal}
//           color="#6f42c1"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Today's Birthdays"
//           count={todayBirthdays}
//           color="#17a2b8"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Today's Work Anniversaries"
//           count={todayWorkAnn}
//           color="#20c997"
//           loading={loading}
//           error={error}
//         />
//         <DashboardCard
//           title="Today's Wedding Anniversaries"
//           count={todayWeddingAnn}
//           color="#e83e8c"
//           loading={loading}
//           error={error}
//         />
//       </div>
//     </div>
//   );
// };

// // ✅ Reusable Card Component
// const DashboardCard = ({ title, count, loading, color, error }) => (
//   <div style={{ ...styles.card, borderTop: `5px solid ${color}` }}>
//     {loading ? (
//       <p>Loading...</p>
//     ) : error ? (
//       <p style={styles.error}>{error}</p>
//     ) : (
//       <>
//         <h3 style={styles.cardTitle}>{title}</h3>
//         <p style={{ ...styles.count, color }}>{count}</p>
//       </>
//     )}
//   </div>
// );

// export default EmpDashboard;

// // ✅ Styles
// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "40px",
//     backgroundColor: "#f8f9fa",
//     minHeight: "100vh",
//   },
//   title: {
//     fontSize: "22px",
//     marginTop: "40px",
//     marginBottom: "20px",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   cardWrapper: {
//     display: "flex",
//     gap: "25px",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     marginBottom: "30px",
//   },
//   card: {
//     width: "260px",
//     backgroundColor: "#fff",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     borderRadius: "12px",
//     textAlign: "center",
//     padding: "25px 20px",
//     transition: "transform 0.2s ease-in-out",
//   },
//   cardTitle: {
//     fontSize: "18px",
//     color: "#555",
//   },
//   count: {
//     fontSize: "40px",
//     fontWeight: "bold",
//     marginTop: "10px",
//   },
//   error: {
//     color: "red",
//   },
// };

import React, { useEffect, useState } from "react";
import { getEmployeesByCompanyApi } from "../api/endpoint";
import {
  FaUsers,
  FaCalendarCheck,
  FaClock,
  FaGift,
  FaBirthdayCake,
  FaRing,
  FaBriefcase,
} from "react-icons/fa";

const EmpDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [completedEvents, setCompletedEvents] = useState(0);
  const [pendingEvents, setPendingEvents] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const [weeklyCompleted, setWeeklyCompleted] = useState(0);
  const [weeklyPending, setWeeklyPending] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [weeklyBirthdays, setWeeklyBirthdays] = useState(0);
  const [weeklyWorkAnn, setWeeklyWorkAnn] = useState(0);
  const [weeklyWeddingAnn, setWeeklyWeddingAnn] = useState(0);

  const [todayCompleted, setTodayCompleted] = useState(0);
  const [todayPending, setTodayPending] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayBirthdays, setTodayBirthdays] = useState(0);
  const [todayWorkAnn, setTodayWorkAnn] = useState(0);
  const [todayWeddingAnn, setTodayWeddingAnn] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const companyId = localStorage.getItem("companyId");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const employees = await getEmployeesByCompanyApi(companyId);
        const today = new Date();

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const currentYearEmployees = employees.filter((emp) => {
          if (!emp.dateOfJoining) return false;
          const joinYear = new Date(emp.dateOfJoining).getFullYear();
          return joinYear === currentYear;
        });
        setEmployeeCount(currentYearEmployees.length);

        let completed = 0,
          pending = 0,
          weekComp = 0,
          weekPend = 0,
          weekTot = 0,
          todayComp = 0,
          todayPend = 0,
          todayTot = 0,
          weekBday = 0,
          weekWork = 0,
          weekWedding = 0,
          todayBday = 0,
          todayWork = 0,
          todayWedding = 0;

        employees.forEach((emp) => {
          const events = [
            { type: "birthday", date: emp.dateOfBirth },
            { type: "wedding", date: emp.anniversaryDate },
            { type: "work", date: emp.dateOfJoining },
          ];

          events.forEach(({ type, date }) => {
            if (!date) return;
            const eventDate = new Date(date);
            eventDate.setFullYear(currentYear);

            if (eventDate.getFullYear() === currentYear) {
              if (eventDate < today) completed++;
              else pending++;

              if (eventDate >= weekStart && eventDate <= weekEnd) {
                weekTot++;
                if (eventDate < today) weekComp++;
                else weekPend++;
                if (type === "birthday") weekBday++;
                if (type === "wedding") weekWedding++;
                if (type === "work") weekWork++;
              }

              if (
                eventDate.getDate() === today.getDate() &&
                eventDate.getMonth() === today.getMonth()
              ) {
                todayTot++;
                if (eventDate < today) todayComp++;
                else todayPend++;
                if (type === "birthday") todayBday++;
                if (type === "wedding") todayWedding++;
                if (type === "work") todayWork++;
              }
            }
          });
        });

        setCompletedEvents(completed);
        setPendingEvents(pending);
        setTotalEvents(completed + pending);
        setWeeklyCompleted(weekComp);
        setWeeklyPending(weekPend);
        setWeeklyTotal(weekTot);
        setWeeklyBirthdays(weekBday);
        setWeeklyWeddingAnn(weekWedding);
        setWeeklyWorkAnn(weekWork);
        setTodayCompleted(todayComp);
        setTodayPending(todayPend);
        setTodayTotal(todayTot);
        setTodayBirthdays(todayBday);
        setTodayWeddingAnn(todayWedding);
        setTodayWorkAnn(todayWork);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employee/event data");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchEmployeeData();
  }, [companyId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Employee Dashboard</h1>

      {/* === Yearly Summary === */}
      <SectionTitle title={`Yearly Summary (${currentYear})`} />
      <div style={styles.cardWrapper}>
        <DashboardCard
          title="Employees Onboard"
          count={employeeCount}
          color="#007bff"
          icon={<FaUsers />}
        />
        <DashboardCard
          title="Completed Events"
          count={completedEvents}
          color="#28a745"
          icon={<FaCalendarCheck />}
        />
        <DashboardCard
          title="Pending Events"
          count={pendingEvents}
          color="#ffc107"
          icon={<FaClock />}
        />
        <DashboardCard
          title="Total Events"
          count={totalEvents}
          color="#6f42c1"
          icon={<FaGift />}
        />
      </div>

      {/* === Weekly Breakdown === */}
      <SectionTitle title="Weekly Breakdown" />
      <div style={styles.cardWrapper}>
        <DashboardCard
          title="Weekly Completed"
          count={weeklyCompleted}
          color="#28a745"
          icon={<FaCalendarCheck />}
        />
        <DashboardCard
          title="Weekly Pending"
          count={weeklyPending}
          color="#ffc107"
          icon={<FaClock />}
        />
        <DashboardCard
          title="Weekly Total"
          count={weeklyTotal}
          color="#6f42c1"
          icon={<FaGift />}
        />
        <DashboardCard
          title="Weekly Birthdays"
          count={weeklyBirthdays}
          color="#17a2b8"
          icon={<FaBirthdayCake />}
        />
        <DashboardCard
          title="Weekly Work Anniversaries"
          count={weeklyWorkAnn}
          color="#20c997"
          icon={<FaBriefcase />}
        />
        <DashboardCard
          title="Weekly Wedding Anniversaries"
          count={weeklyWeddingAnn}
          color="#e83e8c"
          icon={<FaRing />}
        />
      </div>

      {/* === Today's Breakdown === */}
      <SectionTitle title="Today's Breakdown" />
      <div style={styles.cardWrapper}>
        <DashboardCard
          title="Today's Completed"
          count={todayCompleted}
          color="#28a745"
          icon={<FaCalendarCheck />}
        />
        <DashboardCard
          title="Today's Pending"
          count={todayPending}
          color="#ffc107"
          icon={<FaClock />}
        />
        <DashboardCard
          title="Today's Total"
          count={todayTotal}
          color="#6f42c1"
          icon={<FaGift />}
        />
        <DashboardCard
          title="Today's Birthdays"
          count={todayBirthdays}
          color="#17a2b8"
          icon={<FaBirthdayCake />}
        />
        <DashboardCard
          title="Today's Work Anniversaries"
          count={todayWorkAnn}
          color="#20c997"
          icon={<FaBriefcase />}
        />
        <DashboardCard
          title="Today's Wedding Anniversaries"
          count={todayWeddingAnn}
          color="#e83e8c"
          icon={<FaRing />}
        />
      </div>
    </div>
  );
};

// ✅ Section Title Component
const SectionTitle = ({ title }) => (
  <h2 style={styles.title}>
    <span style={{ borderBottom: "3px solid #007bff", paddingBottom: 5 }}>
      {title}
    </span>
  </h2>
);

// ✅ Reusable Card Component
const DashboardCard = ({ title, count, color, icon }) => (
  <div
    style={{
      ...styles.card,
      background: `linear-gradient(135deg, ${color} 0%, ${lightenColor(
        color,
        40
      )} 100%)`,
    }}
  >
    <div style={styles.iconWrapper}>{icon}</div>
    <div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.count}>{count}</p>
    </div>
  </div>
);

// ✅ Helper: lighten color dynamically
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export default EmpDashboard;

// ✅ Styles
const styles = {
  container: {
    background: "linear-gradient(180deg, #f4f7fb 0%, #e9eff5 100%)",
    minHeight: "100vh",
    padding: "40px 20px",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontWeight: "700",
    fontSize: "30px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "40px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#222",
  },
  cardWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
    justifyContent: "center",
  },
  card: {
    width: "200px",
    minHeight: "150px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    color: "white",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  iconWrapper: {
    fontSize: "40px",
    opacity: 0.9,
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
  },
  count: {
    fontSize: "36px",
    fontWeight: "bold",
    margin: "5px 0 0",
  },
};
