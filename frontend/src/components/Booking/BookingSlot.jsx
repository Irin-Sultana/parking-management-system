const BookingSlot = ({ slot, onBook }) => (
  <div style={{ border: '1px solid gray', padding: 10 }}>
    <h4>{slot.type} | {slot.status}</h4>
    {slot.status === 'available' && <button onClick={() => onBook(slot.id)}>Book Now</button>}
  </div>
);