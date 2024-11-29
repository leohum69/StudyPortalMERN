import React from "react";
import StudentNavbar from './StudentNavbar';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <StudentNavbar />
      <h1>Student Dashboard</h1>
      <p>Welcome to your dashboard. Here you can see your latest activities and updates.</p>
    </div>
  );
};

export default StudentDashboard;
