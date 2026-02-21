# 📌 TaskFlow – Full Stack Project Management System

TaskFlow is a full-stack web application that allows users to create projects and manage tasks. It includes user authentication and project-based task tracking.

---

## 🚀 Features

- User Signup and Login
- JWT-based Authentication
- Create and Manage Projects
- Add, Update and Delete Tasks
- Task Status and Priority Handling
- Protected Backend Routes using Middleware

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Context API
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

git clone <your-repo-link>  
cd TaskFlow_project

---

### 2️⃣ Backend Setup

cd backend  
npm install  
npm start  

Make sure MongoDB is running locally or update the connection string.

---

### 3️⃣ Frontend Setup

cd frontend/taskflow  
npm install  
npm run dev  

---

## 🔐 Authentication

The application uses JWT (JSON Web Token) for authentication.  
Protected routes are secured using middleware in the backend.

---

## 📌 Future Improvements

- Support for multiple users per project with role-based access control (Admin / Member / Viewer)
- Granular permission handling using backend middleware
- Real-time task updates using WebSockets (e.g., Socket.io)
- Collaborative project workspace with concurrent user support
- Deployment to cloud platforms (Render / Vercel)
