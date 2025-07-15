# Vehicle Parking Management System

## Description
A UML-modeled parking system implemented in Node.js + React.js using Model-Driven Architecture. The system enables real-time parking slot reservations, user authentication, payment tracking, and detailed session logging. It supports multiple roles (Admin/User), invoice generation, and integrates notifications for successful bookings and errors.

> UML-modeled system with backend session control, secure authentication, and dynamic slot search using location and time filters.

This system is designed to simplify and automate parking space reservations, user profiles, payments, and booking history. It features real-time slot tracking, user authentication, invoice generation, and backend session recording — all connected to a MongoDB database.

## Features  
- User Authentication: 
    - Register and login securely via JWT.
    - Access personalized dashboards and bookings.
- Parking Management: 
    - View and book available slots
    - - Live status updates and countdown timers
- Invoice & Payment: 
    - PDF invoice generation using jsPDF
    - Invoice history and unpaid invoice tracking
    - Extend active parking sessions
- User Profile: 
    - Profile page displays MongoDB-sorted user data
    - Update contact Info or vehicle details
- Notifications: 
    - Toast alerts and modals for successful bookings and errors
- Cross-Origin Communication: 
    - CORS middleware enabled for smooth frontend-backend interaction

## Tech Stack

| Layer         | Technology                              |
|---------------|------------------------------------------|
| Frontend      | React.js, React-Router, Axios, Material UI, jsPDF                         |
| Backend       | Node.js, Express.js, Mongoose                     |
| Database      | MongoDB (Cloud or Local)               |
| Authentication| JWT-based login & role management, bcrypjs        |
| Utilities     | Dotenv, react-toastify               |
| PDF Tools   | jsPDF for invoice generation   |

## Setup Instructions

### Clone & Install
```bash

git clone https://github.com/Irin-Sultana/parking-management-system.git
cd car-park-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install 

# Environment Variables
Create a .env file in your backend directory
```Env

PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the App
```bash

# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm start
```
## Folder Structure

parking-management-system/
├── backend/
│   ├── server/
│       ├── controllers/
|       ├── middlewares/
|       ├── models/
│       ├── routes/
|       ├── utils/
│   └── index.js
|   ├── services/  
├── frontend/
|   ├── public/
│   ├── src/
|       ├── components/
|       ├── pages/
|       ├── services/
|       ├── utils/
│   └── App.jsx

## Notes
- node_modules are excluded from version control. Run npm install in both frontend and backend folders.
- MongoDB Atlas or local MongoDB server required.
- JWT token is stored in localStorage and sent in Authorization headers for protected routes.

