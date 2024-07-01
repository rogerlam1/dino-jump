// AlertDialog.js
import React from 'react';
import PropTypes from 'prop-types';
import './AlertDialog.css'; // Add CSS for AlertDialog here

export const AlertDialog = ({ open, children }) => {
  if (!open) return null;

  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog-content">
        {children}
      </div>
    </div>
  );
};

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export const AlertDialogContent = ({ children }) => (
  <div className="alert-dialog-content-inner">
    {children}
  </div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="alert-dialog-header">
    {children}
  </div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="alert-dialog-title">
    {children}
  </h2>
);

export const AlertDialogDescription = ({ children }) => (
  <p className="alert-dialog-description">
    {children}
  </p>
);