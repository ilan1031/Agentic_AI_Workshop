import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import InvoiceList from '../../components/Invoices/InvoiceList';
import { FiPlus, FiDownload, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { invoiceService } from '../../services/invoiceService';
const { getInvoices } = invoiceService;

const InvoiceListPage: React.FC = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        setError('Failed to fetch invoices. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);

  const handleCreateInvoice = () => {
    router.push('/invoices/create');
  };

  const renderLoading = () => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0',
    }}>
      <div className="animate-pulse">
        <div style={{ height: '24px', width: '40%', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '2rem' }}></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ height: '40px', backgroundColor: '#f7fafc', borderRadius: '8px', marginBottom: '1rem' }}></div>
        ))}
      </div>
    </div>
  );

  const renderError = () => (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0',
    }}>
      <FiAlertTriangle size={48} color="#dd6b20" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>Could not load invoices</h2>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
        }}>
        Reload Page
      </button>
    </div>
  );
  
  return (
    <Layout title="Invoices">
      <div style={{ padding: '2rem 1.5rem', backgroundColor: '#f7fafc', minHeight: 'calc(100vh - 80px)' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: 0
            }}>
              Invoice Management
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              margin: '0.25rem 0 0 0'
            }}>
              Browse, manage, and export your invoices.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
              color: '#4a5568',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }} className="hover:bg-gray-50 hover:border-gray-300">
              <FiDownload /> Export
            </button>
            <button 
              onClick={handleCreateInvoice}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}>
              <FiPlus /> Create Invoice
            </button>
          </div>
        </div>
        
        {loading ? renderLoading() : error ? renderError() : (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 700, margin: 0}}>All Invoices</h3>
              <div style={{ position: 'relative', width: '300px' }}>
                <FiSearch style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#a0aec0'}} />
                <input type="text" placeholder="Search invoices..." style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }} />
              </div>
            </div>
            <InvoiceList 
              invoices={invoices} 
              onView={(id) => router.push(`/invoices/${id}`)}
              onEdit={(id) => router.push(`/invoices/${id}/edit`)}
              onDelete={async (id) => {
                // Mock delete
                setInvoices(invoices.filter(invoice => invoice._id !== id));
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceListPage;