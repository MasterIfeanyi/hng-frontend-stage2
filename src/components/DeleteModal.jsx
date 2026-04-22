// src/components/DeleteModal.jsx
import { useEffect, useRef } from 'react';
import Button from './ui/Button';

const DeleteModal = ({ isOpen, onClose, onConfirm, invoiceId }) => {
  const modalRef = useRef(null);

  // Trap focus inside modal
  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before modal opened
      const previousFocus = document.activeElement;
      
      return () => {
        // Restore focus when modal closes
        previousFocus?.focus();
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      // Trap focus - Tab key
      if (e.key === 'Tab' && isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 999
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg)',
          borderRadius: '12px',
          padding: '40px',
          zIndex: 1000,
          maxWidth: '480px',
          width: '90%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 
          id="modal-title"
          style={{ 
            margin: '0 0 16px 0',
            fontSize: '28px',
            color: 'var(--text-h)',
            fontWeight: 'bold'
          }}
        >
          Confirm Deletion
        </h2>
        
        <p style={{ 
          color: 'var(--text)', 
          marginBottom: '32px',
          lineHeight: '1.6',
          fontSize: '14px'
        }}>
          Are you sure you want to delete invoice #{invoiceId?.slice(-6)}? 
          This action cannot be undone.
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '16px'
        }}>
          <Button
            variant="secondary"
            onClick={onClose}
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          
          <Button
            variant="danger"
            onClick={() => {
              onConfirm(invoiceId);
              onClose();
            }}
            aria-label="Confirm deletion"
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;