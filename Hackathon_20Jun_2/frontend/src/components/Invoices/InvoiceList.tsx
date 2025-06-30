import React from 'react';
import { FiEdit, FiTrash2, FiEye, FiMoreVertical } from 'react-icons/fi';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow } from '@chakra-ui/react';
import { format } from 'date-fns';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: 'paid' | 'pending' | 'draft';
}

interface InvoiceListProps {
  invoices: Invoice[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onView, onEdit, onDelete }) => {
  
  const getStatusBadge = (status: string) => {
    const baseStyle: React.CSSProperties = {
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'capitalize',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem'
    };
    
    const statusDotStyle: React.CSSProperties = {
      width: '8px',
      height: '8px',
      borderRadius: '50%'
    };

    switch (status) {
      case 'paid': 
        return (
          <span style={{...baseStyle, background: '#d4edda', color: '#155724'}}>
            <span style={{...statusDotStyle, background: '#28a745' }}></span>
            Paid
          </span>
        );
      case 'pending': 
        return (
          <span style={{...baseStyle, background: '#fff3cd', color: '#856404'}}>
            <span style={{...statusDotStyle, background: '#ffc107' }}></span>
            Pending
          </span>
        );
      case 'draft': 
        return (
          <span style={{...baseStyle, background: '#e2e3e5', color: '#383d41'}}>
            <span style={{...statusDotStyle, background: '#6c757d' }}></span>
            Draft
          </span>
        );
      default: 
        return <span style={baseStyle}>Unknown</span>;
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px'
      }}>
        <thead style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <tr>
            {['Invoice #', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map(header => (
              <th key={header} style={{
                padding: '1rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#718096',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice._id} className="group" style={{
              borderBottom: '1px solid #f1f5f9',
              transition: 'background-color 0.2s ease',
            }}>
              <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#2d3748' }}>{invoice.invoiceNumber}</td>
              <td style={{ padding: '1rem 1.5rem', color: '#4a5568' }}>{invoice.customerName}</td>
              <td style={{ padding: '1rem 1.5rem', color: '#4a5568' }}>{format(new Date(invoice.date), 'MMM dd, yyyy')}</td>
              <td style={{ padding: '1rem 1.5rem', color: '#1a202c', fontWeight: 600 }}>₹{invoice.total.toLocaleString('en-IN')}</td>
              <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(invoice.status)}</td>
              <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                <Popover>
                  <PopoverTrigger>
                    <button style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }} className="hover:bg-gray-100">
                      <FiMoreVertical size={20} color="#718096" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent width="150px" _focus={{boxShadow: 'none'}}>
                    <PopoverArrow />
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      padding: '0.5rem',
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0'
                    }}>
                      {onView && (
                        <button onClick={() => onView(invoice._id)} className="popover-menu-item">
                          <FiEye size={16} /> View
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(invoice._id)} className="popover-menu-item">
                          <FiEdit size={16} /> Edit
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(invoice._id)} className="popover-menu-item text-red-600">
                          <FiTrash2 size={16} /> Delete
                        </button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .popover-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
          transition: background-color 0.2s ease;
        }
        .popover-menu-item:hover {
          background-color: #f1f5f9;
        }
        .popover-menu-item.text-red-600:hover {
          background-color: #fee2e2;
          color: #991b1b;
        }
        tr:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default InvoiceList;