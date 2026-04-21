// src/pages/InvoiceList.jsx
import { Link } from 'react-router-dom';

const InvoiceList = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📋 Invoices</h2>
        <Link to="/invoice/new">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#7C5DFA',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            New Invoice
          </button>
        </Link>
      </div>
      
      <p>No invoices yet. Click "New Invoice" to create one!</p>
      
      {/* Temporary test link */}
      <Link to="/invoice/test123">
        <button style={{ marginTop: '20px', padding: '10px' }}>
          👀 View Test Invoice (Checkpoint Test)
        </button>
      </Link>
    </div>
  );
};

export default InvoiceList;