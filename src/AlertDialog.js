import React from 'react';

export const AlertDialog = ({ open, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px'
      }}>
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children }) => <div>{children}</div>;

export const AlertDialogHeader = ({ children }) => <div style={{ marginBottom: '10px' }}>{children}</div>;

export const AlertDialogTitle = ({ children }) => <h2 style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{children}</h2>;

export const AlertDialogDescription = ({ children }) => <p>{children}</p>;