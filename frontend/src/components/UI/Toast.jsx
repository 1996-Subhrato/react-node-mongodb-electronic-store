import React from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <XCircle size={20} />;
            case 'warning': return <AlertCircle size={20} />;
            case 'info': return <Info size={20} />;
            default: return <CheckCircle size={20} />;
        }
    };

    return (
        <div className={`toast-container animate-slide-in`}>
            <div className={`toast-card toast-${type} glass`}>
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-content">
                    <p>{message}</p>
                </div>
                <button className="toast-close" onClick={onClose}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
