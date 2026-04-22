// src/pages/InvoiceList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../utils/storage';
import StatusFilter from '../components/StatusFilter';
import Button from '../components/ui/Button';

const InvoiceList = () => {
  const [allInvoices] = useState(() => getInvoices() || []);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInvoices = filterStatus === 'all'
  ? allInvoices
  : allInvoices.filter(inv => inv.status === filterStatus);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return { bg: 'rgba(51, 214, 159, 0.1)', text: '#33D69F', label: 'Paid' };
      case 'pending':
        return { bg: 'rgba(255, 143, 0, 0.1)', text: '#FF8F00', label: 'Pending' };
      case 'draft':
        return { bg: 'var(--social-bg)', text: 'var(--text)', label: 'Draft' };
      default:
        return { bg: 'var(--social-bg)', text: 'var(--text)', label: status };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>Invoices</h1>
          <p style={{ color: 'var(--text)', margin: 0, fontSize: '14px' }}>
            {filteredInvoices.length === 0 
              ? 'No invoices' 
              : `There are ${filteredInvoices.length} total invoice${filteredInvoices.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <StatusFilter 
            currentFilter={filterStatus} 
            onFilterChange={handleFilterChange} 
          />
          
          <Link to="/invoice/new" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ borderRadius: '50px', padding: '10px 18px 10px 10px' }}>
              <span style={{ 
                backgroundColor: '#fff', 
                color: 'var(--accent)', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '16px',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>+</span> 
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: 'var(--bg)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          {allInvoices.length === 0 ? (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>There is nothing here</h2>
              <p style={{ color: 'var(--text)' }}>Create an invoice by clicking the <br/><b>New Invoice</b> button and get started</p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>No matching invoices</h2>
              <p style={{ color: 'var(--text)' }}>
                Try changing your filter from "{filterStatus}"
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {filteredInvoices.map((invoice) => {
            const statusStyle = getStatusColor(invoice.status);
            return (
              <Link 
                key={invoice.id} 
                to={`/invoice/${invoice.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                >
                  <div style={{ fontWeight: 'bold', minWidth: '100px', color: 'var(--text-h)' }}>
                    <span style={{ color: 'var(--text)' }}>#</span>{invoice.id.slice(-6)}
                  </div>
                  
                  <div style={{ color: 'var(--text)', minWidth: '120px' }}>
                    Due {formatDate(invoice.invoiceDate)}
                  </div>
                  
                  <div style={{ color: 'var(--text)', minWidth: '150px' }}>
                    {invoice.clientName}
                  </div>
                  
                  <div style={{ fontWeight: 'bold', fontSize: '20px', minWidth: '100px', textAlign: 'right', color: 'var(--text-h)' }}>
                    ${invoice.total.toFixed(2)}
                  </div>
                  
                  <div style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                    padding: '12px 0',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    minWidth: '104px',
                    textAlign: 'center',
                    marginLeft: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: statusStyle.text 
                    }}></span>
                    {statusStyle.label}
                  </div>
                  
                  <div style={{ marginLeft: '24px', color: 'var(--accent)', fontWeight: 'bold' }}>
                    ›
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;