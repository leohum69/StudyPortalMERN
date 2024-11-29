import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import StudentProfile from "./components/StudentProfile";
import StudentDashboard from "./components/StudentDashboard"; 
import "./App.css";
// import StudentAttendance from "./components/StudentAttendance"; 
// import StudentCourses from "./components/StudentCourses"; 
// import StudentAssignments from "./components/StudentAssignments"; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Student-related routes */}
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        {/* <Route path="/student-attendance" element={<StudentAttendance />} /> */}
        {/* <Route path="/student-courses" element={<StudentCourses />} /> */}
        {/* <Route path="/student-assignments" element={<StudentAssignments />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
