import { useState } from 'react';

export default function ComingSoonPopup() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      zIndex: 9999,
      textAlign: 'center',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <p>🚧 Bookings Coming Soon! 🚧</p>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: 'white',
          color: 'black',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#ddd'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
      >
        Close
      </button>
    </div>
  );
}
