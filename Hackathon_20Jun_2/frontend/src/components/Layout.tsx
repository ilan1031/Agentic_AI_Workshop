import React, { ReactNode } from 'react';
import Head from 'next/head';
import { FiHome, FiFileText, FiRefreshCw, FiActivity, FiSettings, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const router = useRouter();

  const navItems = [
    { path: '/', name: 'Dashboard', icon: FiHome },
    { path: '/invoices/list', name: 'Invoices', icon: FiFileText },
    { path: '/reconcile/upload', name: 'Reconcile', icon: FiRefreshCw },
    { path: '/agents/status', name: 'Agents', icon: FiActivity },
  ];

  // Active for exact or subroutes
  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      <Head>
        <title>{title} | Smart Reconciliation</title>
        <meta name="description" content="AI-powered financial reconciliation system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}>
                <FiRefreshCw size={24} color="white" />
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1a202c',
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Smart Reconciliation
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{
                background: 'transparent',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '12px',
                color: '#718096',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiSettings size={20} />
              </button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiUser size={16} color="white" />
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1a202c'
                }}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <nav style={{
          background: 'white',
          width: '280px',
          minHeight: 'calc(100vh - 70px)',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
          display: 'none'
        }} className="hidden md:block">
          <div style={{ padding: '2rem 1.5rem' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item) => (
                <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      background: isActive(item.path) 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'transparent',
                      color: isActive(item.path) ? 'white' : '#718096',
                      boxShadow: isActive(item.path) 
                        ? '0 8px 24px rgba(102, 126, 234, 0.3)' 
                        : 'none'
                    }}
                  >
                    <item.icon size={20} />
                    <span style={{
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          zIndex: 100
        }} className="md:hidden">
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.75rem 0'
          }}>
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  color: isActive(item.path) ? '#667eea' : '#718096',
                  background: isActive(item.path) 
                    ? 'rgba(102, 126, 234, 0.1)' 
                    : 'transparent',
                  fontWeight: isActive(item.path) ? 700 : 500
                }}
              >
                <item.icon size={20} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '0',
          marginBottom: '80px'
        }} className="md:mb-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        padding: '2rem 0',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            textAlign: 'center'
          }} className="md:flex-row md:justify-between md:text-left">
            <p style={{
              fontSize: '0.9rem',
              color: '#718096',
              margin: 0
            }}>
              © {new Date().getFullYear()} Smart Reconciliation System. All rights reserved.
            </p>
            <nav style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a href="#" style={{
                fontSize: '0.9rem',
                color: '#718096',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}>
                Privacy Policy
              </a>
              <a href="#" style={{
                fontSize: '0.9rem',
                color: '#718096',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}>
                Terms of Service
              </a>
              <a href="#" style={{
                fontSize: '0.9rem',
                color: '#718096',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}>
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;