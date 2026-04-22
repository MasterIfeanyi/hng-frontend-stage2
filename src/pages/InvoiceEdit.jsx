// src/pages/InvoiceEdit.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoiceById, updateInvoice } from '../utils/storage.js';

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Load invoice data
  // ✅ Lazy initializer: runs once on mount, no effect needed
  const [formData, setFormData] = useState(() => {
    const invoice = getInvoiceById(id);
    return (invoice && invoice.status !== 'paid') ? invoice : null;
  });

  // Validation rules (same as create form)
  const validate = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.clientEmail) {
      newErrors.clientEmail = 'Email is required';
    } else if (!emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }
    
    const hasValidItem = formData.items.some(item => item.name.trim() !== '');
    if (!hasValidItem) {
      newErrors.items = 'At least one invoice item is required';
    }
    
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allTouched = {};
      Object.keys(formData).forEach(key => { allTouched[key] = true; });
      setTouched(allTouched);
      return;
    }
    
    // Calculate total
    const total = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    // Update invoice
    const updatedInvoice = {
      ...formData,
      total
    };
    
    updateInvoice(id, updatedInvoice);
    navigate(`/invoice/${id}`);
  };

  if (!formData) {
    return <div>Loading...</div>;
  }


  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>✏️ Edit Invoice #{id.slice(-6)}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Client Information Section */}
        <fieldset style={styles.fieldset}>
          <legend>👤 Client Information</legend>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Client Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.clientName && touched.clientName ? '#EC5757' : '#DFE3FA'
              }}
            />
            {errors.clientName && touched.clientName && (
              <span style={styles.error}>{errors.clientName}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Client Email *</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.clientEmail && touched.clientEmail ? '#EC5757' : '#DFE3FA'
              }}
            />
            {errors.clientEmail && touched.clientEmail && (
              <span style={styles.error}>{errors.clientEmail}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </fieldset>
        
        {/* Invoice Details */}
        <fieldset style={styles.fieldset}>
          <legend>📅 Invoice Details</legend>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Terms</label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="NET_7">Net 7 Days</option>
                <option value="NET_15">Net 15 Days</option>
                <option value="NET_30">Net 30 Days</option>
              </select>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </fieldset>
        
        {/* Item List */}
        <fieldset style={styles.fieldset}>
          <legend>📦 Items *</legend>
          
          {formData.items.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              <div style={{ flex: 3 }}>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  style={styles.input}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  style={styles.input}
                  min="1"
                />
                {errors[`item_${index}_quantity`] && (
                  <span style={styles.errorSmall}>Must be &gt; 0</span>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  style={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
              
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={styles.iconButton}
                disabled={formData.items.length === 1}
              >
                🗑️
              </button>
            </div>
          ))}
          
          {errors.items && (
            <span style={styles.error}>{errors.items}</span>
          )}
          
          <button type="button" onClick={addItem} style={styles.addButton}>
            + Add New Item
          </button>
        </fieldset>
        
        {/* Form Actions */}
        <div style={styles.actions}>
          <button 
            type="button" 
            onClick={() => navigate(`/invoice/${id}`)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            style={styles.saveButton}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles (same as create form)
const styles = {
  fieldset: {
    border: '1px solid #DFE3FA',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#FFFFFF'
  },
  formGroup: {
    marginBottom: '15px',
    flex: 1
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#7E88C3'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #DFE3FA',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  row: {
    display: 'flex',
    gap: '15px'
  },
  itemRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  error: {
    color: '#EC5757',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  errorSmall: {
    color: '#EC5757',
    fontSize: '10px',
    display: 'block'
  },
  addButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#F9FAFE',
    color: '#7E88C3',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '30px'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#F9FAFE',
    color: '#7E88C3',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#7C5DFA',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '10px'
  }
};

export default InvoiceEdit;