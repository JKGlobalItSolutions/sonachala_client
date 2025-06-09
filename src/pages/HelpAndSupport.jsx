import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Placeholder components for each tab
const ContactCustomerService = () => (
  <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>
      Contact Customer Service
    </h1>
    <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
      Get in touch with our customer service team for assistance.
    </p>
    {/* Add your contact form or customer service information here */}
  </div>
);

const SafetyResourceCenter = () => (
  <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>
      Safety Resource Center
    </h1>
    <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
      Learn about our safety measures and guidelines.
    </p>
    {/* Add your safety resources and information here */}
  </div>
);

const DisputeResolution = () => (
  <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>
      Dispute Resolution
    </h1>
    <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
      Find information on how to resolve disputes and issues.
    </p>
    {/* Add your dispute resolution process and guidelines here */}
  </div>
);

// Main HelpAndSupport Component
const HelpAndSupport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'contactCustomerService');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width <= 1024 && width > 768);
      if (width > 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menu items for Help and Support
  const menuItems = [
    { id: 'contactCustomerService', icon: '🎧', label: 'Contact Customer Service' },
    { id: 'safetyResourceCenter', icon: '🛡️', label: 'Safety Resource Center' },
    { id: 'disputeResolution', icon: '⚖️', label: 'Dispute Resolution' },
  ];

  const handleBack = () => {
    navigate('/profile');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
      }}>
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {(isMobile || isTablet) && (
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              marginRight: '16px',
            }}
          >
            ☰
          </button>
        )}
      <div className="container mt-3 ">
      <nav aria-label="breadcrumb">
          <ol
            className="breadcrumb"
            style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex' }}
          >
            <li className="breadcrumb-item">
              <Link to="/profile" style={{ color: "red", textDecoration: "none", marginRight: "8px" }}>
                Profile
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: "#333" }}>
              Help and Support
            </li>
          </ol>
        </nav>
      </div>
      </div>

      <div className="container" style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: isMobile ? '100%' : isTablet ? '250px' : '280px',
          backgroundColor: 'white',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '20px 0',
          position: (isMobile || isTablet) ? 'fixed' : 'static',
          height: (isMobile || isTablet) ? '100%' : 'auto',
          overflowY: 'auto',
          transition: 'transform 0.3s ease-in-out',
          transform: (isMobile || isTablet) && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          zIndex: 999,
        }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <div
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile || isTablet) setIsSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  color: activeTab === item.id ? 'red' : '#333',
                  backgroundColor: activeTab === item.id ? '#f5f5f5' : 'transparent',
                  fontWeight: activeTab === item.id ? '500' : 'normal',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '50%'
                }}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {index < menuItems.length - 1 && (
                <div style={{
                  height: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  margin: '0'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: isMobile ? '16px' : isTablet ? '24px' : '32px 48px',
          backgroundColor: 'white'
        }}>
          {activeTab === 'contactCustomerService' && <ContactCustomerService />}
          {activeTab === 'safetyResourceCenter' && <SafetyResourceCenter />}
          {activeTab === 'disputeResolution' && <DisputeResolution />}
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;

