import React from 'react';
import './ConfirmationModal.css';
import { AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    confirmBtnClass = 'btn-danger' 
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass animate-fade">
                <div className="modal-header">
                    <AlertCircle size={40} className="modal-icon" />
                    <h2>{title}</h2>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button className={`btn ${confirmBtnClass}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
