import React from "react";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, Admin</h1>
        </header>

        <section className="dashboard-cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>1,245</p>
          </div>
          <div className="card">
            <h3>Monthly Revenue</h3>
            <p>₹1,75,000</p>
          </div>
          <div className="card">
            <h3>Performance</h3>
            <p>98%</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
