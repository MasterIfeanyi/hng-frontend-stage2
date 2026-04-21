// src/pages/InvoiceDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInvoiceById, updateInvoice } from '../utils/storage';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(() => getInvoiceById(id));

  useEffect(() => {
    if (!invoice) navigate('/');
  }, [id, invoice, navigate]);

  const handleMarkAsPaid = () => {
    if (invoice && invoice.status !== 'paid') {
      const updated = updateInvoice(id, { status: 'paid' });
      setInvoice(updated);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return { bg: '#33D69F', text: 'white', label: 'Paid' };
      case 'pending':
        return { bg: '#FF8F00', text: 'white', label: 'Pending' };
      case 'draft':
        return { bg: '#373B53', text: '#DFE3FA', label: 'Draft' };
      default:
        return { bg: '#DFE3FA', text: '#373B53', label: status };
    }
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const statusStyle = getStatusColor(invoice.status);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ 
        textDecoration: 'none', 
        color: '#7E88C3',
        display: 'inline-block',
        marginBottom: '20px'
      }}>
        ⬅️ Go back
      </Link>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '30px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0' }}>Invoice #{invoice.id}</h2>
            <p style={{ color: '#7E88C3', margin: 0 }}>
              {invoice.description || 'No description'}
            </p>
          </div>
          <div style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            padding: '10px 25px',
            borderRadius: '6px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {statusStyle.label}
          </div>
        </div>

        {/* Client Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div>
            <p style={{ color: '#7E88C3', margin: '0 0 5px 0' }}>Bill To</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{invoice.clientName}</p>
            <p style={{ margin: '0 0 5px 0' }}>{invoice.clientEmail}</p>
            <p style={{ margin: 0 }}>
              {invoice.address}<br />
              {invoice.city}, {invoice.postalCode}<br />
              {invoice.country}
            </p>
          </div>
          <div>
            <p style={{ color: '#7E88C3', margin: '0 0 5px 0' }}>Invoice Date</p>
            <p style={{ fontWeight: 'bold', margin: '0 0 15px 0' }}>
              {formatDate(invoice.invoiceDate)}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div style={{
          backgroundColor: '#F9FAFE',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#7E88C3', fontSize: '12px' }}>
                <th style={{ textAlign: 'left', paddingBottom: '15px' }}>Item Name</th>
                <th style={{ textAlign: 'center', paddingBottom: '15px' }}>Qty</th>
                <th style={{ textAlign: 'right', paddingBottom: '15px' }}>Price</th>
                <th style={{ textAlign: 'right', paddingBottom: '15px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} style={{ fontWeight: 'bold' }}>
                  <td style={{ padding: '10px 0' }}>{item.name}</td>
                  <td style={{ textAlign: 'center', padding: '10px 0' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0' }}>${item.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0' }}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #DFE3FA'
          }}>
            <div>
              <p style={{ color: '#7E88C3', margin: '0 0 5px 0' }}>Amount Due</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                ${invoice.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {invoice.status !== 'paid' && (
            <>
              <Link to={`/invoice/${id}/edit`}>
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#F9FAFE',
                  color: '#7E88C3',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Edit
                </button>
              </Link>
              
              {invoice.status === 'pending' && (
                <button 
                  onClick={handleMarkAsPaid}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#7C5DFA',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Mark as Paid
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;