import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        width: '100%',
        maxWidth: '62rem',
        zIndex: 10000,
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 2rem',
          borderBottom: '2px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.625rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Body */}
        <div style={{ 
          padding: '2rem 2rem 1.75rem 2rem'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;