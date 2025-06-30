import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { FiUpload, FiFileText, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { reconciliationService } from '../../services/reconciliationService';
import { toast } from 'react-hot-toast';

const ReconcileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Uploading file...');
    try {
      const response = await reconciliationService.runFullReconciliation(file, (progress) => {
        toast.loading(`Processing... ${progress.progress}%`, { id: toastId });
      });
      toast.success('File uploaded and reconciliation started!', { id: toastId });
      // Assuming the response contains a jobId or similar to track the process
      // router.push(`/agents/status?jobId=${response.jobId}`);
    } catch (error) {
      toast.error('Failed to upload file. Please try again.', { id: toastId });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Reconcile Transactions">
      <div style={{
        backgroundColor: '#f7fafc',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          maxWidth: '600px', 
          width: '100%',
          textAlign: 'center', 
        }}>
          {/* Header Section */}
          <div style={{ 
            marginBottom: '2rem',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}>
              <FiUpload size={36} color="white" />
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '0.5rem',
            }}>
              Reconcile Transactions
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Upload your bank statements to automatically match transactions with invoices.
            </p>
          </div>

          {/* Upload Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            padding: '2.5rem',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ cursor: 'pointer', display: 'block' }}>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragOver ? '2px dashed #667eea' : '2px dashed #e2e8f0',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    background: isDragOver ? 'rgba(102, 126, 234, 0.05)' : '#f8fafc',
                  }}
                >
                  {file ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '12px',
                    }}>
                      <FiCheckCircle size={24} color="#22c55e" />
                      <div>
                        <p style={{ fontWeight: 600, color: '#1a202c', margin: 0, fontSize: '1rem' }}>
                          {file.name}
                        </p>
                        <p style={{ color: '#22c55e', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                          Ready to upload
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '50%',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                      }}>
                        <FiUpload size={28} color="#5a67d8" />
                      </div>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#2d3748',
                        margin: '0 0 0.25rem 0'
                      }}>
                        Drag & drop a file or <span style={{color: '#5a67d8'}}>browse</span>
                      </h3>
                      <p style={{ color: '#718096', margin: 0 }}>
                        Supports: CSV, XLSX, XLS
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600,
                cursor: (!file || isLoading) ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                opacity: (!file || isLoading) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              {isLoading && <FiLoader className="animate-spin" />}
              {isLoading ? 'Uploading...' : 'Upload & Reconcile'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReconcileUploadPage;