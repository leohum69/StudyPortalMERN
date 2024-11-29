const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Student = require("./models/student");
const Courses = require("./models/courses");
const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());


const SECRET_KEY = "lalaleo";


mongoose.connect("mongodb://localhost:27017/study", { useNewUrlParser: true});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });



const teacherSchema = {
    username: String,
    password: String
};

const Teacher = mongoose.model("teacher", teacherSchema, "teacher");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" });
    }

   
    req.user = user;
    next(); 
  });
};





app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  // console.log(role);
  // console.log(username);
  // console.log(password);
  try {
    let user;
    
    if (role === "Student") {
      user = await Student.findOne({ username, password });
    } else if (role === "Teacher") {
      user = await Teacher.findOne({ username, password });
    } else {
      return res.status(400).send({ message: "Choose a role first" });
    }

    if (user) {
      const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY, 
        { expiresIn: "1h" } 
      );

      // console.log("Generated Token:", token);

      return res.status(200).json({ message: "Login successful",token, role });
    } else {
      return res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});


  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  
  app.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      let user;
      if (role === "Student") {
        user = await Student.findOne({ username });
      } else if (role === "Teacher") {
        user = await Teacher.findOne({ username });
      }else{
        return res.status(400).send({ message: "Choose a role First" });
      }
  
      if (user) {
        return res.status(400).send({ message: "Username is already taken" });
      }
  
      if (role === "Student") {
        const newStudent = new Student({ username, password });
        await newStudent.save();
      } else if (role === "Teacher") {
        const newTeacher = new Teacher({ username, password });
        await newTeacher.save();
      }
      
      const token = jwt.sign(
        { username: username, role: role },
        SECRET_KEY, 
        { expiresIn: "1h" } 
      );
      // console.log(token);
      res.status(201).send({ message: "Signup successful",token, role });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  });
  
  app.post('/forgot-password', async (req, res) => {
    const { username, newPassword } = req.body;
    
    const student = await Student.findOne({ username });
    const teacher = await Teacher.findOne({ username });
  
    if (student || teacher) {
      const user = student || teacher;
      user.password = newPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully!' });
    }
  
    return res.status(404).json({ message: 'User not found.' });
  });


  app.post("/save-profile", authenticateJWT, upload.single("profilePicture"), async (req, res) => {
    const { name, age, courses } = req.body;
    const { file } = req;
  
    try {
      const username = req.user.username; 
      // console.log(username); 
  
   
      let student = await Student.findOne({ username });
  
    
      student.name = name;
      student.age = age;
      student.courses = Array.isArray(courses) ? courses : JSON.parse(courses); 
      if (file) {
        student.profilePicture = file.path; 
      }
  
      await student.save();
  
      res.status(200).send({ message: "Profile saved successfully", student });
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).send({ message: "Server error" });
    }
  });

  app.get('/profile', authenticateJWT, async (req, res) => {
    try {
      const username = req.user.username;
      const student = await Student.findOne({ username });
  
      if (!student) {
        return res.status(404).send({ message: "Student not found" });
      }
  
      if (!student.name || !student.age || !student.courses) {
        return res.status(400).send({ message: "Profile is incomplete" });
      }

      res.status(200).send({
        userProfile: {
          name: student.name,
          age: student.age,
          profilePicture: student.profilePicture,
          courses: student.courses,
        }
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).send({ message: "Server error" });
    }
  });

  app.get('/profile-picture', authenticateJWT, async (req, res) => {
    try {
      const username = req.user.username;
      const student = await Student.findOne({ username });
  
      if (!student) {
        return res.status(404).send({ message: "Student not found" });
      }
  
      if (!student.name || !student.age || !student.courses) {
        return res.status(400).send({ message: "Profile is incomplete" });
      }
  
      
      const profilePicturePath = path.join(__dirname, student.profilePicture); 
  
      if (fs.existsSync(profilePicturePath)) {
        const imageBuffer = fs.readFileSync(profilePicturePath);
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': imageBuffer.length,
        });
        res.end(imageBuffer);
      } else {
        res.status(404).send({ message: "Profile picture not found" });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).send({ message: "Server error" });
    }
  });


  app.get('/courses', async (req, res) => {
    try {
      // Retrieve all courses from the database
      const courses = await Courses.find({}, 'name'); // Retrieve only the 'name' field
      
      // Map the course documents to an array of names
      const courseNames = courses.map(course => course.name);
      
      // Send the array of course names as a response
      res.json(courseNames);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to retrieve courses' });
    }
  });

  app.post('/courses', authenticateJWT, async (req, res) => {
    const { courses } = req.body;  
    const { username, role } = req.user; 
    // console.log(courses);
  
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).send({ message: 'Please provide a valid array of course names' });
    }
  
    try {
      for (const courseName of courses) {
        // Find the course document by name
        const course = await Courses.findOne({ name: courseName });
  
        if (!course) {
          return res.status(404).send({ message: `Course ${courseName} not found` });
        }
  
        if (role === 'Student') {

          if (!course.students.includes(username)) {
            course.students.push(username);
          }
        } else if (role === 'Teacher') {
          if (course.teacher !== username) {
            course.teacher = username;
          }
        } else {
          return res.status(403).send({ message: 'Unauthorized role' });
        }
        await course.save();
      }

      res.status(200).send({ message: 'Courses updated successfully' });
    } catch (error) {
      console.error('Error updating courses:', error);
      res.status(500).send({ message: 'Failed to update courses' });
    }
  });




app.listen(8080, function() {
  console.log('Server started on port 8080');
});