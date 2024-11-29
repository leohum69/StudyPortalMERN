import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import axios from "axios";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios.get("http://localhost:8080/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.userProfile) {
          setProfile(response.data.userProfile);
        } else {
          alert("Profile data not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("An error occurred while fetching the profile.");
      }
    } else {
      alert("User is not authenticated.");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []); 

  return (
    <div className="student-dashboard">
      <StudentNavbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome to the Dashboard</h1>
        {profile ? (
          <div className="profile-details">
            <h2 className="profile-title">Profile Details</h2>
            <p className="profile-info">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="profile-info">
              <strong>Age:</strong> {profile.age}
            </p>
            <p className="profile-info">
              <strong>Courses:</strong> {profile.courses?.join(", ")}
            </p>
            {profile.profilePicture && (
              <img
                className="profile-picture"
                src={`http://localhost:8080/${profile.profilePicture}`}
                alt="Profile"
              />
            )}
          </div>
        ) : (
          <p className="loading-message">Loading profile data...</p>
        )}
      </div>
    </div>
  );  
};

export default StudentDashboard;
