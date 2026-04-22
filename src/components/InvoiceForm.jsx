// src/components/InvoiceForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInvoice } from '../utils/storage';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

const InvoiceForm = () => {
    const navigate = useNavigate();

    // State for form fields
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        description: '',
        city: '',
        country: '',
        postalCode: '',
        address: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        paymentTerms: 'NET_30',
        items: [{ name: '', quantity: 1, price: 0 }]
    });

    // State for validation errors
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation rules
    const validate = () => {
        const newErrors = {};

        // Client name required
        if (!formData.clientName.trim()) {
            newErrors.clientName = 'Client name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.clientEmail) {
            newErrors.clientEmail = 'Email is required';
        } else if (!emailRegex.test(formData.clientEmail)) {
            newErrors.clientEmail = 'Please enter a valid email address';
        }

        // At least one item with name
        const hasValidItem = formData.items.some(item => item.name.trim() !== '');
        if (!hasValidItem) {
            newErrors.items = 'At least one invoice item is required';
        }

        // Validate each item
        formData.items.forEach((item, index) => {
            if (item.name.trim()) {
                if (item.quantity <= 0) {
                    newErrors[`item_${index}_quantity`] = 'Quantity must be positive';
                }
                if (item.price < 0) {
                    newErrors[`item_${index}_price`] = 'Price must be positive';
                }
            }
        });

        return newErrors;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    // Handle item changes
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = field === 'name' ? value : parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    // Add new item row
    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', quantity: 1, price: 0 }]
        }));
    };

    // Remove item row
    const removeItem = (index) => {
        if (formData.items.length > 1) {
            const updatedItems = formData.items.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, items: updatedItems }));
        }
    };

    // Handle form submission
    const handleSubmit = (status) => {
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Mark all fields as touched to show errors
            const allTouched = {};
            Object.keys(formData).forEach(key => { allTouched[key] = true; });
            setTouched(allTouched);
            return;
        }

        // Calculate total
        const total = formData.items.reduce((sum, item) => {
            return sum + (item.quantity * item.price);
        }, 0);

        // Create invoice object
        const invoice = {
            id: `INV-${Date.now()}`,
            ...formData,
            total,
            status: status, // 'draft' or 'pending'
            createdAt: new Date().toISOString()
        };

        addInvoice(invoice);

        // Navigate back to list
        navigate('/');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '32px', color: 'var(--text-h)' }}>New Invoice</h2>

            <div style={{ 
                backgroundColor: 'var(--bg)', 
                borderRadius: '12px', 
                padding: '32px', 
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)' 
            }}>
                {/* Client Information Section */}
                <fieldset style={styles.fieldset}>
                    <legend style={styles.legend}>Bill To</legend>

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <Input
                                label="Client Name *"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                error={touched.clientName && errors.clientName}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <Input
                                label="Client Email *"
                                type="email"
                                name="clientEmail"
                                value={formData.clientEmail}
                                onChange={handleChange}
                                error={touched.clientEmail && errors.clientEmail}
                            />
                        </div>
                    </div>

                    <Input
                        label="Street Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <Input
                                label="Postal Code"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <Input
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Invoice Details */}
                <fieldset style={styles.fieldset}>
                    <legend style={styles.legend}>Invoice Details</legend>

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <Input
                                label="Invoice Date"
                                type="date"
                                name="invoiceDate"
                                value={formData.invoiceDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px', display: 'block' }}>Payment Terms</label>
                            <select
                                name="paymentTerms"
                                value={formData.paymentTerms}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg)',
                                    color: 'var(--text-h)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    fontFamily: 'var(--sans)'
                                }}
                            >
                                <option value="NET_7">Net 7 Days</option>
                                <option value="NET_15">Net 15 Days</option>
                                <option value="NET_30">Net 30 Days</option>
                            </select>
                        </div>
                    </div>

                    <Textarea
                        label="Project Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g., Website Redesign"
                        rows={3}
                    />
                </fieldset>

                {/* Item List */}
                <fieldset style={styles.fieldset}>
                    <legend style={styles.legend}>Item List</legend>

                    {formData.items.map((item, index) => (
                        <div key={index} style={styles.itemRow}>
                            <div style={{ flex: 3 }}>
                                <Input
                                    label={index === 0 ? "Item Name" : null}
                                    placeholder="Item Name"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                    style={{ marginBottom: '8px' }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <Input
                                    label={index === 0 ? "Qty." : null}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    min="1"
                                    style={{ marginBottom: '8px' }}
                                    error={errors[`item_${index}_quantity`]}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <Input
                                    label={index === 0 ? "Price" : null}
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                    step="0.01"
                                    min="0"
                                    style={{ marginBottom: '8px' }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                {index === 0 && <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px', display: 'block' }}>Total</label>}
                                <div style={{ 
                                    padding: '12px 16px', 
                                    color: 'var(--text)', 
                                    fontWeight: 'bold', 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    height: '42px',
                                    boxSizing: 'border-box'
                                }}>
                                    ${(item.quantity * item.price).toFixed(2)}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', paddingTop: index === 0 ? '24px' : '0' }}>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: formData.items.length === 1 ? 'not-allowed' : 'pointer',
                                        color: formData.items.length === 1 ? 'var(--border)' : '#EC5757',
                                        fontSize: '20px',
                                        padding: '10px'
                                    }}
                                    disabled={formData.items.length === 1}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}

                    {errors.items && (
                        <span style={{ color: '#EC5757', fontSize: '12px', display: 'block', marginBottom: '16px' }}>{errors.items}</span>
                    )}

                    <Button 
                        variant="secondary" 
                        fullWidth 
                        onClick={addItem}
                        style={{ marginTop: '16px' }}
                    >
                        + Add New Item
                    </Button>
                </fieldset>

                {/* Form Actions */}
                <div style={styles.actions}>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                    >
                        Discard
                    </Button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            variant="secondary"
                            onClick={() => handleSubmit('draft')}
                            style={{ backgroundColor: 'var(--social-bg)', color: 'var(--text)' }}
                        >
                            Save as Draft
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => handleSubmit('pending')}
                        >
                            Save & Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles object to keep the JSX clean
const styles = {
    fieldset: {
        border: 'none',
        padding: '0',
        marginBottom: '40px',
        marginInline: '0'
    },
    legend: {
        color: 'var(--accent)',
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '16px',
        padding: '0'
    },
    formGroup: {
        flex: 1
    },
    row: {
        display: 'flex',
        gap: '24px',
        width: '100%'
    },
    itemRow: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border)'
    }
};

export default InvoiceForm;