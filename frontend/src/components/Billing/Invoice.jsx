const Invoice = ({ booking }) => {
  const duration = (new Date(booking.exitTime) - new Date(booking.entryTime)) / 3600000;
  const amount = duration * 2;

  return (
    <div>
      <h3>Invoice</h3>
      <p>Vehicle ID: {booking.vehicleId}</p>
      <p>Duration: {duration.toFixed(2)} hours</p>
      <p>Total: ${amount.toFixed(2)}</p>
    </div>
  );
};