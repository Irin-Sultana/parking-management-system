import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/invoices?userId=${user._id}`);
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoices();
  }, [user._id]);

  const handlePayInvoice = async (invoiceId) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/invoices/${invoiceId}/pay`);
      alert('Payment processed successfully!');
      // Refresh invoices
      const res = await axios.get(`http://localhost:5000/api/invoices?userId=${user._id}`);
      setInvoices(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <div className="billing">
      <h2>Billing</h2>
      <div className="invoices-list">
        {invoices.length === 0 ? (
          <p>No invoices found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>{invoice.status}</td>
                  <td>
                    {invoice.status === 'UNPAID' && (
                      <button 
                        onClick={() => handlePayInvoice(invoice._id)}
                        disabled={loading}
                      >
                        Pay Now
                      </button>
                    )}
                    <button onClick={() => window.print(invoice._id)}>Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Billing;