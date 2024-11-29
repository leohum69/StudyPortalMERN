import React from "react";
import { Link } from "react-router-dom";

const StudentNavbar = () => {
  return (
    <nav className="student-nav-bar">
      <Link to="/student-dashboard" className="nav-link">Dashboard</Link>
      <Link to="/student-attendance" className="nav-link">Attendance</Link>
      <Link to="/student-courses" className="nav-link">Courses</Link>
      <Link to="/student-assignments" className="nav-link">Assignments</Link>
    </nav>
  );
};

export default StudentNavbar;
