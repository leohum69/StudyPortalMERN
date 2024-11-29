import React, { useState, useEffect } from "react";
import StudentNavbar from './StudentNavbar'; // Assuming you have a separate navbar for students
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    profilePicture: null,
    selectedCourses: [],
  });
  const [courses, setCourses] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null); // Define file state
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchCourses = async () => {
      // For now, you can use a static list or fetch from your backend
      const serverCourses = ["Mathematics", "Physics", "Computer Science", "Biology"];
      setCourses(serverCourses);
    };

    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Make an authenticated request to get the profile data
          const response = await axios.get("http://localhost:3000/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // If profile data is received, set it
          if (response.data) {
            setProfileData(response.data.userProfile);  // Adjust to your response structure
            setIsProfileComplete(true);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        //   alert("Unable to fetch profile data.");
        }
      } else {
        alert("User is not authenticated.");
        navigate("/");
      }
    };

    fetchCourses();
    fetchProfileData();
  }, [navigate]);

  const saveProfile = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("age", profileData.age);
    formData.append("courses", JSON.stringify(profileData.selectedCourses));
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await axios.post("http://localhost:3000/save-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure the content type is set to handle file uploads
        },
      });

      alert(response.data.message || "Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile data.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.age || profileData.selectedCourses.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await saveProfile();
      setIsProfileComplete(true);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile data.");
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "profilePicture") {
      setProfilePicture(value); // Handle profile picture
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCourseSelection = (course) => {
    setProfileData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(course)
        ? prev.selectedCourses.filter((c) => c !== course)
        : [...prev.selectedCourses, course],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file); // Store file in state
    }
  };

  console.log(profileData);

  return (
    <div className="student-profile">
      <StudentNavbar />
      <h1>Student Profile</h1>
      {isProfileComplete ? (
        <div className="profile-display">
          <h2>Welcome, {profileData.name}!</h2>
          <p><strong>Age:</strong> {profileData.age}</p>
          <p><strong>Courses:</strong> {profileData.courses?.length > 0 ? profileData.courses.join(", ") : "No courses selected"}</p>
          {profileData.profilePicture && (
            <img
                src={`http://localhost:3000/${profileData.profilePicture}`}
              alt="Profile"
              className="profile-picture"
            />
          )}
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="profile-form">
          <label>
            Name:
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
              className="input-name"
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              value={profileData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="Enter your age"
              className="input-age"
            />
          </label>
          <label>
            Profile Picture (optional):
            <input
              type="file"
              onChange={handleFileChange} // Handle file change separately
              className="input-profile-picture"
            />
          </label>
          <div className="courses-section">
            <h2>Select Courses:</h2>
            {courses.map((course) => (
              <div key={course} className="course-item">
                <input
                  type="checkbox"
                  id={course}
                  value={course}
                  checked={profileData.selectedCourses.includes(course)}
                  onChange={() => handleCourseSelection(course)}
                />
                <label htmlFor={course}>{course}</label>
              </div>
            ))}
          </div>
          <button type="submit" className="submit-button">
            Save Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentProfile;
