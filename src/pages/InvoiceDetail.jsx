// src/pages/InvoiceDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInvoiceById, updateInvoice, deleteInvoice } from '../utils/storage.js';
import DeleteModal from '../components/DeleteModal';
import Button from '../components/ui/Button';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(() => getInvoiceById(id));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!invoice) navigate('/');
    }, [id, invoice, navigate]);

    const handleMarkAsPaid = () => {
        if (invoice && invoice.status !== 'paid') {
            const updated = updateInvoice(id, { status: 'paid' });
            setInvoice(updated);
        }
    };

    const handleDelete = (invoiceId) => {
        deleteInvoice(invoiceId);
        navigate('/');
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
        switch (status) {
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

    if (!invoice) {
        return <div>Loading...</div>;
    }

    const statusStyle = getStatusColor(invoice.status);

    return (
        <>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: 'var(--text)',
                    display: 'inline-block',
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    <span style={{ color: 'var(--accent)', marginRight: '8px' }}>&lt;</span> Go back
                </Link>

                <div style={{
                    backgroundColor: 'var(--bg)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow)'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '32px'
                    }}>
                        <div>
                            <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-h)' }}>Invoice <span style={{ color: 'var(--text)' }}>#</span>{invoice.id}</h2>
                            <p style={{ color: 'var(--text)', margin: 0 }}>
                                {invoice.description || 'No description'}
                            </p>
                        </div>
                        <div style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
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
                    </div>

                    {/* Client Details */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '40px'
                    }}>
                        <div>
                            <p style={{ color: 'var(--text)', margin: '0 0 8px 0', fontSize: '13px' }}>Bill To</p>
                            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-h)', fontSize: '16px' }}>{invoice.clientName}</p>
                            <p style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>{invoice.clientEmail}</p>
                            <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.6' }}>
                                {invoice.address}<br />
                                {invoice.city}, {invoice.postalCode}<br />
                                {invoice.country}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text)', margin: '0 0 8px 0', fontSize: '13px' }}>Invoice Date</p>
                            <p style={{ fontWeight: 'bold', margin: '0 0 24px 0', color: 'var(--text-h)', fontSize: '16px' }}>
                                {formatDate(invoice.invoiceDate)}
                            </p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div style={{
                        backgroundColor: 'var(--social-bg)',
                        borderRadius: '8px',
                        padding: '32px',
                        marginBottom: '32px'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: 'var(--text)', fontSize: '12px' }}>
                                    <th style={{ textAlign: 'left', paddingBottom: '24px', fontWeight: 'normal' }}>Item Name</th>
                                    <th style={{ textAlign: 'center', paddingBottom: '24px', fontWeight: 'normal' }}>QTY.</th>
                                    <th style={{ textAlign: 'right', paddingBottom: '24px', fontWeight: 'normal' }}>Price</th>
                                    <th style={{ textAlign: 'right', paddingBottom: '24px', fontWeight: 'normal' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index} style={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
                                        <td style={{ padding: '12px 0' }}>{item.name}</td>
                                        <td style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text)' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', padding: '12px 0', color: 'var(--text)' }}>${item.price.toFixed(2)}</td>
                                        <td style={{ textAlign: 'right', padding: '12px 0' }}>
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '24px',
                            paddingTop: '24px',
                            borderTop: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <p style={{ color: 'var(--text)', margin: 0, fontSize: '14px' }}>Amount Due</p>
                                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: 'var(--text-h)' }}>
                                    ${invoice.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                        <Button
                            variant="danger"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Delete
                        </Button>

                        {invoice.status !== 'paid' && (
                            <>
                                <Link to={`/invoice/${id}/edit`} style={{ textDecoration: 'none' }}>
                                    <Button variant="secondary">
                                        Edit
                                    </Button>
                                </Link>

                                {invoice.status === 'pending' && (
                                    <Button
                                        variant="primary"
                                        onClick={handleMarkAsPaid}
                                    >
                                        Mark as Paid
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                invoiceId={invoice.id}
            />

        </>
    );
};

export default InvoiceDetail;