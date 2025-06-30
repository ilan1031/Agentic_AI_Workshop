import React, { useState } from 'react';
import AgentStatus from '../../components/Agents/AgentStatus';
import { agentService, AgentResult } from '../../services/agentService';
import { FileUploadProgress } from '../../types';
import { 
  FiUpload, 
  FiFileText, 
  FiCheckCircle, 
  FiPlay, 
  FiZap, 
  FiAlertTriangle,
  FiLoader,
  FiDownload,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi';
import Layout from '../../components/Layout';
import { toast } from 'react-hot-toast';

export default function AgentStatusPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [results, setResults] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<FileUploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleJsonInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
    try {
      if (event.target.value.trim()) {
        const parsedTransactions = JSON.parse(event.target.value);
        setTransactions(parsedTransactions);
        setError(null);
        toast.success(`Loaded ${parsedTransactions.length} transactions`);
      }
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const handleAgentAction = async (action: Function, agentName: string, ...args: any[]) => {
    try {
      setLoading(true);
      setActiveAgent(agentName);
      setError(null);
      const toastId = toast.loading(`${agentName} is processing...`);
      
      const result = await action(...args);
      setResults(result);
      
      toast.success(`${agentName} completed successfully!`, { id: toastId });
    } catch (err: any) {
      setError(`Failed to perform ${agentName}: ${err.message}`);
      toast.error(`${agentName} failed: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  const testIndividualAgent = async (agentName: string) => {
    const testData = [
      {
        transaction_id: "TXN001",
        date: "2024-01-15",
        amount: 1500.00,
        currency: "USD",
        party: "Test Vendor",
        reference: "INV-2024-001",
        category: "Services",
        status: "pending"
      }
    ];

    try {
      setLoading(true);
      setActiveAgent(agentName);
      setError(null);
      const toastId = toast.loading(`Testing ${agentName}...`);
      
      let result;
      switch (agentName) {
        case 'Transaction Extractor':
          if (!selectedFile) {
            toast.error('Please select a file first');
            return;
          }
          result = await agentService.extractTransactions(selectedFile);
          break;
        case 'Invoice Matcher':
          result = await agentService.matchInvoices(testData);
          break;
        case 'Categorizer':
          result = await agentService.categorizeTransactions(testData);
          break;
        case 'Discrepancy Detector':
          result = await agentService.detectDiscrepancies(testData);
          break;
        case 'Reconciliation Approver':
          result = await agentService.reconcileTransactions(testData);
          break;
        default:
          throw new Error('Unknown agent');
      }
      
      setResults(result);
      toast.success(`${agentName} test completed!`, { id: toastId });
    } catch (err: any) {
      setError(`Test failed for ${agentName}: ${err.message}`);
      toast.error(`${agentName} test failed: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  const downloadResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded successfully!');
  };

  return (
    <Layout title="Agent Management">
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
              Agent Management
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              margin: '0.25rem 0 0 0'
            }}>
              Monitor and interact with AI agents for transaction processing
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
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
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Agent Status */}
        <div style={{ marginBottom: '2rem' }}>
          <AgentStatus refreshInterval={30000} />
        </div>
        
        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* File Upload & JSON Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* File Upload */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '1rem'
              }}>
                File Upload
              </h3>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f8fafc'
                }}
              />
              {selectedFile && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '8px'
                }}>
                  <FiCheckCircle size={16} color="#22c55e" />
                  <span style={{ color: '#22c55e', fontSize: '0.875rem' }}>
                    Selected: {selectedFile.name}
                  </span>
                </div>
              )}
            </div>

            {/* JSON Input */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '1rem'
              }}>
                JSON Input for Agents
              </h3>
              <textarea
                value={jsonInput}
                onChange={handleJsonInputChange}
                placeholder="Paste transaction JSON here..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  resize: 'vertical'
                }}
              />
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  color: '#ef4444',
                  fontSize: '0.875rem'
                }}>
                  <FiAlertTriangle size={14} />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Agent Actions */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '1.5rem'
            }}>
              Agent Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Individual Agent Tests */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.75rem' }}>
                  Test Individual Agents
                </h4>
                {['Transaction Extractor', 'Invoice Matcher', 'Categorizer', 'Discrepancy Detector', 'Reconciliation Approver'].map(agent => (
                  <button
                    key={agent}
                    onClick={() => testIndividualAgent(agent)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      background: activeAgent === agent ? 'rgba(102, 126, 234, 0.1)' : 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontWeight: 500,
                      color: activeAgent === agent ? '#5a67d8' : '#4a5568',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: loading && activeAgent !== agent ? 0.5 : 1
                    }}
                  >
                    <span>{agent}</span>
                    {activeAgent === agent ? <FiLoader className="animate-spin" /> : <FiPlay size={16} />}
                  </button>
                ))}
              </div>

              {/* Workflow Actions */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.75rem' }}>
                  Workflow Actions
                </h4>
                
                <button
                  onClick={() => handleAgentAction(agentService.extractTransactions, 'Transaction Extractor', selectedFile, setProgress)}
                  disabled={!selectedFile || loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: (!selectedFile || loading) ? 'not-allowed' : 'pointer',
                    opacity: (!selectedFile || loading) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Extract Transactions</span>
                  <FiFileText size={16} />
                </button>
                
                <button
                  onClick={() => handleAgentAction(agentService.matchInvoices, 'Invoice Matcher', transactions)}
                  disabled={transactions.length === 0 || loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: (transactions.length === 0 || loading) ? 'not-allowed' : 'pointer',
                    opacity: (transactions.length === 0 || loading) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Match Invoices</span>
                  <FiCheckCircle size={16} />
                </button>
                
                <button
                  onClick={() => handleAgentAction(agentService.runFullReconciliation, 'Full Reconciliation', selectedFile, setProgress)}
                  disabled={!selectedFile || loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: (!selectedFile || loading) ? 'not-allowed' : 'pointer',
                    opacity: (!selectedFile || loading) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Full Reconciliation</span>
                  <FiZap size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {results && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1a202c',
                margin: 0
              }}>
                Results
              </h3>
              <button
                onClick={downloadResults}
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#5a67d8',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiDownload size={16} />
                Download
              </button>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'auto',
              border: '1px solid #e2e8f0'
            }}>
              <pre style={{
                fontSize: '0.875rem',
                color: '#4a5568',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}>
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}