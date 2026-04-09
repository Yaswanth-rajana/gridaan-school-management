📚 Gridaan - School Management System
A Complete Full-Stack Web Application for School Operations Management
📋 Project Overview
A production-ready school management system that allows administrators to manage students and assign tasks/homework. Built with the MERN stack (MongoDB, Express.js, React, Node.js) with a focus on clean architecture, security, and user experience.

🎯 Key Features
Authentication

Admin login with JWT-based authentication

Protected routes and API endpoints

Token expiry handling (7 days)

Student Management

✅ Add new students

✅ Edit student details

✅ Delete students (cascade deletes all their tasks)

✅ View list of students with pagination

✅ Search students by name or class

✅ Sort by newest first

Task Management

✅ Assign tasks/homework to students

✅ Mark tasks as completed

✅ View all tasks with student details

✅ Filter tasks by status (pending/completed)

✅ View tasks by specific student with summary

🛠️ Tech Stack
Category	Technology	Version
Frontend	React	18.x
React Router DOM	6.x
Axios	1.x
Backend	Node.js	18.x+
Express.js	4.x
MongoDB	6.x+
Mongoose	7.x
Authentication	JSON Web Tokens (JWT)	9.x
bcryptjs	2.x
Development	Vite	5.x
Nodemon	3.x
📁 Project Structure

Gridaan/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login & token verification
│   │   ├── studentController.js     # Student CRUD operations
│   │   └── taskController.js        # Task management
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── models/
│   │   ├── User.js                  # Admin user schema
│   │   ├── Student.js               # Student schema
│   │   └── Task.js                  # Task schema
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── students.js              # Student routes
│   │   └── tasks.js                 # Task routes
│   ├── seed/
│   │   └── adminSeed.js             # Default admin creator
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore file
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx            # Admin login page
│   │   │   ├── Dashboard.jsx        # Main dashboard layout
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── StudentList.jsx      # Student management UI
│   │   │   ├── StudentForm.jsx      # Add/Edit student modal
│   │   │   ├── TaskList.jsx         # Task management UI
│   │   │   └── TaskForm.jsx         # Assign task modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   ├── studentService.js    # Student API calls
│   │   │   └── taskService.js       # Task API calls
│   │   ├── App.jsx                  # Routing & providers
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   └── package.json
│
└── README.md
🚀 Setup Instructions
Prerequisites
Node.js (v18 or higher)

MongoDB (local or MongoDB Atlas cloud account)

Git

Step 1: Clone the Repository
bash
git clone https://github.com/yourusername/gridaan-school-management.git
cd gridaan-school-management
Step 2: Backend Setup
bash
cd backend
npm install
Create a .env file in the backend/ folder:

env
PORT=5001
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key_change_this_to_something_secure
Getting MongoDB URI:

Local MongoDB: mongodb://localhost:27017/school_management

MongoDB Atlas: Create a free cluster → Get connection string → Replace password

Step 3: Seed Default Admin
bash
node seed/adminSeed.js
You should see:


✅ Admin created successfully!
📝 Username: admin
📝 Password: admin123
Step 4: Start Backend Server

npm run dev
Server runs at: http://localhost:5001

Verify with: http://localhost:5001/api/health

Step 5: Frontend Setup
Open a new terminal:


cd frontend
npm install
Step 6: Start Frontend

npm run dev
Frontend runs at: http://localhost:5173

🔐 Default Admin Credentials
Field	Value
Username	admin
Password	admin123
⚠️ Important: Change these credentials in production!

📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/login	Admin login
GET	/api/auth/verify	Verify JWT token
Students
Method	Endpoint	Description
GET	/api/students	Get all students (paginated, searchable)
POST	/api/students	Add new student
PUT	/api/students/:id	Update student
DELETE	/api/students/:id	Delete student (cascade tasks)
Query Parameters for GET /api/students:

page (default: 1) - Page number

limit (default: 10, max: 50) - Items per page

search (optional) - Search by name or class

Tasks
Method	Endpoint	Description
GET	/api/tasks	Get all tasks (paginated, filterable)
POST	/api/tasks	Assign task to student
PATCH	/api/tasks/:id/complete	Mark task as completed
GET	/api/tasks/student/:studentId	Get tasks for specific student
DELETE	/api/tasks/:id	Delete task
Query Parameters for GET /api/tasks:

page (default: 1) - Page number

limit (default: 10, max: 50) - Items per page

status (optional) - Filter by pending or completed

studentId (optional) - Filter by specific student

🧪 Testing the Application
Backend Testing with cURL
1. Login:


curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
2. Get Students (with token):


curl -X GET "http://localhost:5001/api/students?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
3. Add Student:


curl -X POST http://localhost:5001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sharma","class":"10","rollNumber":"101"}'
4. Assign Task:


curl -X POST http://localhost:5001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Math Homework","studentId":"STUDENT_ID_HERE"}'
Frontend Testing
Open http://localhost:5173

Login with admin / admin123

Test all CRUD operations for students

Assign tasks to students

Mark tasks as completed

Test search and pagination

Test status filters for tasks

🔒 Security Features
Feature	Implementation
Password Hashing	bcryptjs (10 salt rounds)
JWT Authentication	7-day expiry, minimal payload
Input Sanitization	trim(), lowercase for emails
ObjectId Validation	Prevents invalid MongoDB queries
Field Whitelisting	Only allowed fields can be updated
Regex Escaping	Prevents regex injection in search
No Empty Updates	Returns error if no fields provided
CORS Enabled	Proper CORS configuration
📊 Database Schema
User (Admin)
javascript
{
  username: String (unique, lowercase, required),
  password: String (hashed, min 6 chars),
  role: String (default: "admin"),
  createdAt: Date,
  updatedAt: Date
}
Student
javascript
{
  name: String (required),
  class: String (required),
  rollNumber: String (unique, optional),
  email: String (unique, lowercase, optional),
  parentContact: String (optional),
  createdAt: Date,
  updatedAt: Date
}
Task
javascript
{
  title: String (required),
  description: String,
  studentId: ObjectId (ref: "Student", indexed),
  status: String (enum: ["pending", "completed"], default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
Relationships: One Student → Many Tasks (cascade delete)

🚨 Error Handling
Response Format
Success:

json
{
  "success": true,
  "data": { ... }
}
Error:

json
{
  "success": false,
  "message": "Error description"
}
HTTP Status Codes
Code	Meaning
200	Success
201	Created
400	Bad Request (validation error)
401	Unauthorized (invalid/missing token)
404	Not Found
500	Server Error
🎨 Frontend Features
Login Page
Username/password form

Loading state during login

Error message for invalid credentials

Auto-redirect to dashboard

Dashboard
2-column responsive layout

Left: Student management

Right: Task management

Navbar with logout button

Student Management
List view with table/grid

Search by name or class

Pagination (Previous/Next)

Add student (modal form)

Edit student (pre-filled modal)

Delete student (confirmation dialog)

Task Management
Card-based task display

Filter by status (All/Pending/Completed)

Assign task (modal with student dropdown)

Mark task as complete (one-click)

Pagination support

UX Highlights
Loading spinners for async operations

Empty states ("No students found")

Disabled buttons during API calls

Confirmation before destructive actions

Auto-refresh after CRUD operations

🚀 Deployment (Optional)
Backend Deployment (Render/Railway)
Push code to GitHub

Create account on Render.com

Connect GitHub repository

Set environment variables:

PORT=5001

MONGO_URI (use MongoDB Atlas)

JWT_SECRET

Deploy

Frontend Deployment (Netlify/Vercel)
Build the project:

bash
cd frontend
npm run build
Deploy the dist folder to Netlify or Vercel

Update api.js with production backend URL

🔧 Troubleshooting
Issue	Solution
MongoDB connection error	Check MONGO_URI in .env
JWT invalid	Regenerate JWT_SECRET
CORS error	Ensure backend is running on port 5001
Login fails	Run seed script to create admin
Frontend can't connect	Check API_URL in frontend/services/api.js
📈 Future Improvements
Backend
Refresh token mechanism

Rate limiting for login attempts

Email notifications

File attachments for tasks

Activity logging

Role-based access control (Teacher, Admin)

Frontend
Dark mode

Export reports (PDF/Excel)

Drag-and-drop task status

Real-time updates with WebSockets

Mobile-responsive improvements

Deployment
Docker containerization

CI/CD pipeline

Environment-specific configs

📝 Development Notes
Environment Variables
Backend (.env):

env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school_db
JWT_SECRET=your_jwt_secret_key_min_32_chars
Frontend API URL (in api.js):

javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
Package.json Scripts
Backend:

json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
Frontend:

json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
👨‍💻 Author
Your Name - Yaswanth Rajana


🙏 Acknowledgments
Gridaan Hiring Team for this opportunity

MongoDB Atlas for free cloud database

React and Node.js communities

📄 License
This project is for educational purposes as part of the Gridaan hiring process.