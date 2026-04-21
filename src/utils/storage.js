// src/utils/storage.js

const STORAGE_KEY = 'invoices';

// Get all invoices from localStorage
export const getInvoices = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Return empty array if nothing stored yet
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse invoices:', error);
    return [];
  }
};

// Save all invoices to localStorage
export const saveInvoices = (invoices) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

// Add a single invoice
export const addInvoice = (invoice) => {
  const invoices = getInvoices();
  invoices.push(invoice);
  saveInvoices(invoices);
  return invoice;
};

// Get a single invoice by ID
export const getInvoiceById = (id) => {
  const invoices = getInvoices();
  return invoices.find(inv => inv.id === id);
};

// Update an existing invoice
export const updateInvoice = (id, updatedData) => {
  const invoices = getInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  
  if (index !== -1) {
    invoices[index] = { ...invoices[index], ...updatedData };
    saveInvoices(invoices);
    return invoices[index];
  }
  return null;
};

// Delete an invoice
export const deleteInvoice = (id) => {
  const invoices = getInvoices();
  const filtered = invoices.filter(inv => inv.id !== id);
  saveInvoices(filtered);
  return filtered;
};