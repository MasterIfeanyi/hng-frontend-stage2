// src/pages/InvoiceList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../utils/storage';

const InvoiceList = () => {
    const [invoices] = useState(() => getInvoices() || []);


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
        switch (status) {
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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: '0 0 5px 0' }}>📋 Invoices</h1>
                    <p style={{ color: '#888EB0', margin: 0 }}>
                        {invoices.length === 0
                            ? 'No invoices'
                            : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link to="/invoice/new">
                    <button style={{
                        padding: '12px 24px',
                        backgroundColor: '#7C5DFA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>➕</span> New Invoice
                    </button>
                </Link>
            </div>

            {invoices.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px'
                }}>
                    <p style={{ color: '#888EB0', fontSize: '18px' }}>📭 No invoices yet</p>
                    <p style={{ color: '#7E88C3' }}>Click "New Invoice" to create your first one!</p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    {invoices.map((invoice) => {
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
                                    padding: '16px 24px',
                                    borderBottom: '1px solid #DFE3FA',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFE'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                                >
                                    <div style={{ fontWeight: 'bold', minWidth: '100px' }}>
                                        #{invoice.id}
                                    </div>

                                    <div style={{ color: '#7E88C3', minWidth: '120px' }}>
                                        Due {formatDate(invoice.invoiceDate)}
                                    </div>

                                    <div style={{ color: '#858BB2', minWidth: '150px' }}>
                                        {invoice.clientName}
                                    </div>

                                    <div style={{ fontWeight: 'bold', fontSize: '18px', minWidth: '100px', textAlign: 'right' }}>
                                        ${invoice.total.toFixed(2)}
                                    </div>

                                    <div style={{
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.text,
                                        padding: '8px 20px',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        minWidth: '80px',
                                        textAlign: 'center',
                                        marginLeft: '20px'
                                    }}>
                                        {statusStyle.label}
                                    </div>

                                    <div style={{ marginLeft: '20px', color: '#7C5DFA' }}>
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