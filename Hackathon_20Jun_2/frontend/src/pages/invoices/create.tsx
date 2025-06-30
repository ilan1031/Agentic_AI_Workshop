import React from 'react';
import Layout from '../../components/Layout';
import InvoiceForm from '../../components/Invoices/InvoiceForm';
import { FiFilePlus } from 'react-icons/fi';

const CreateInvoicePage: React.FC = () => {
  return (
    <Layout title="Create New Invoice">
      <div style={{ padding: '2rem 1.5rem', backgroundColor: '#f7fafc', minHeight: 'calc(100vh - 80px)' }}>
        {/* Header */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 2.5rem auto',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
          }}>
            <FiFilePlus size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#1a202c',
            margin: 0
          }}>
            Create a New Invoice
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#718096',
            margin: '0.25rem 0 0 0'
          }}>
            Fill in the details below to generate a new invoice.
          </p>
        </div>
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0',
          padding: '2rem'
        }}>
          <InvoiceForm />
        </div>
      </div>
    </Layout>
  );
};

export default CreateInvoicePage;