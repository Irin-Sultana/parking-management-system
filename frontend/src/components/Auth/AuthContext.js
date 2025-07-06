import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ParkingSlots = () => {
  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/parking-slots');
        setSlots(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const filteredSlots = slots.filter(slot => {
    if (filter === 'all') return true;
    return slot.status === filter.toUpperCase();
  });

  const handleBookSlot = async (slotId) => {
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        slotId,
        userId: user._id
      });
      alert('Slot booked successfully!');
      // Refresh slots
      const res = await axios.get('http://localhost:5000/api/parking-slots');
      setSlots(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="parking-slots">
      <h2>Parking Slots</h2>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('available')}>Available</button>
        <button onClick={() => setFilter('occupied')}>Occupied</button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="slots-grid">
          {filteredSlots.map(slot => (
            <div key={slot._id} className={`slot-card ${slot.status.toLowerCase()}`}>
              <h3>Slot {slot.number}</h3>
              <p>Type: {slot.type}</p>
              <p>Status: {slot.status}</p>
              {slot.status === 'AVAILABLE' && (
                <button onClick={() => handleBookSlot(slot._id)}>Book Now</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParkingSlots;