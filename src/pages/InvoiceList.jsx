// src/pages/InvoiceList.jsx
import { Link } from 'react-router-dom';

const InvoiceList = () => {
  return (
    <div>
      <h2>Invoice List</h2>
      <p>No invoices yet. Checkpoint 1 success!</p>
      
      {/* Temporary link to test routing to a detail page */}
      <Link to="/invoice/test123">
        <button style={{ marginTop: '20px', padding: '10px' }}>
          👀 View Test Invoice (Checkpoint Test)
        </button>
      </Link>
    </div>
  );
};

export default InvoiceList;