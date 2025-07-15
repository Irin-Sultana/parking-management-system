import React, { useEffect, useState } from "react";
import axios from './utils/axiosInstance';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProfilePage from './pages/ProfilePage';
import VehicleList from './pages/VehicleList';
import InvoiceHistory from './pages/InvoiceHistory';
import ParkingHistory from './pages/ParkingHistory';
import ParkingSlotSearch from './pages/ParkingSlotSearch';
import PaymentPage from './pages/PaymentPage';

import './App.css'; // Optional: for global styles

function App() {
  const [slots, setSlots] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3001/api/parking")
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, [refresh]);

  const handlePark = () => {
    const vehicleId = "CAR-" + Date.now();
    axios.post("http://localhost:3001/api/parking/park", { vehicleId })
      .then(res => {
        alert(`Parked ${vehicleId} in slot ${res.data.slot.id}`);
        setRefresh(!refresh);
      })
      .catch(err => alert(err.response.data.error));
  };

  const handleUnpark = (id) => {
    axios.post(`http://localhost:3001/api/parking/unpark/${id}`)
      .then(res => {
        alert(`Unparked slot ${id}`);
        setRefresh(!refresh);
      })
      .catch(err => alert(err.response.data.error));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/invoices" element={<InvoiceHistory />} />
        <Route path="/history" element={<ParkingHistory />} />
        <Route path="/slots" element={<ParkingSlotSearch />} />
        <Route path="/payment" element={<PaymentPage />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;