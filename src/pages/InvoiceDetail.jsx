// src/pages/InvoiceDetail.jsx
import { useParams, Link } from 'react-router-dom';

const InvoiceDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <Link to="/">⬅️ Go Back to List</Link>
      <h2>Invoice Detail: {id}</h2>
      <p>This is a placeholder for invoice {id}</p>
    </div>
  );
};

export default InvoiceDetail;