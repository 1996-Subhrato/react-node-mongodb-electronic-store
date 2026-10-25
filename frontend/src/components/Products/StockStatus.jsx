import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const StockStatus = ({ stock }) => {
    let status = {
        label: 'In Stock',
        color: '#2D6A4F',
        icon: <CheckCircle size={14} />,
        class: 'in-stock'
    };

    if (stock <= 0) {
        status = {
            label: 'Out of Stock',
            color: '#D00000',
            icon: <XCircle size={14} />,
            class: 'out-of-stock'
        };
    } else if (stock <= 10) {
        const stockDisplay = `${stock} units`;
        status = {
            label: `Only ${stockDisplay} left!`,
            color: '#F9A825',
            icon: <AlertTriangle size={14} />,
            class: 'low-stock'
        };
    }

    return (
        <div className={`stock-status ${status.class}`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            color: status.color,
            fontSize: '0.85rem',
            fontWeight: '600'
        }}>
            {status.icon} {status.label}
        </div>
    );
};

export default StockStatus;
