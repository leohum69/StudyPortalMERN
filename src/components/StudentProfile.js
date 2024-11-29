import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    profilePicture: null,
    selectedCourses: [],
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/courses");
        
        // Check if the response is an array before using map
        if (Array.isArray(response.data)) {
          setCourses(response.data);  // Set courses if the response is an array
        } else {
          console.error("Expected an array of course names, but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

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
            // Redirect to dashboard if profile exists
            navigate("/student-dashboard", { state: { profile: response.data.userProfile } });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        alert("User is not authenticated.");
        navigate("/");
      }
    };

    fetchCourses();
    fetchProfileData();
  }, [navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("age", profileData.age);
    formData.append("courses", JSON.stringify(profileData.selectedCourses));
    if (profileData.profilePicture) {
      formData.append("profilePicture", profileData.profilePicture);
    }
    const selectedCourses = profileData.selectedCourses;

    try {
      const response = await axios.post("http://localhost:8080/save-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const coursesResponse = await axios.post(
        "http://localhost:8080/courses",
        { courses: selectedCourses },  // Array of selected courses
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include JWT token in the Authorization header
          }
        }
      );

      alert(response.data.message || "Profile saved successfully!");
      // Redirect to dashboard after profile is saved
      navigate("/student-dashboard", { state: { profile: response.data.profile } });
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile data.");
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="student-profile">
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleFormSubmit} className="profile-form">
        <label>
          Name:
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            value={profileData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="Enter your age"
          />
        </label>
        <label>
          Profile Picture (optional):
          <input
            type="file"
            onChange={(e) => handleInputChange("profilePicture", e.target.files[0])}
          />
        </label>
        <div>
          <h2>Select Courses:</h2>
          {courses.map((course) => (
            <div key={course}>
              <input
                type="checkbox"
                value={course}
                checked={profileData.selectedCourses.includes(course)}
                onChange={() => {
                  setProfileData((prev) => ({
                    ...prev,
                    selectedCourses: prev.selectedCourses.includes(course)
                      ? prev.selectedCourses.filter((c) => c !== course)
                      : [...prev.selectedCourses, course],
                  }));
                }}
              />
              <label>{course}</label>
            </div>
          ))}
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default StudentProfile;
