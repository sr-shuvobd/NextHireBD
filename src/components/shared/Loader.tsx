import React from 'react';

const Loader = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: fullScreen ? '80vh' : '300px',
      width: '100%',
    }}>
      <div className="loader-spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(139, 92, 246, 0.2)',
        borderTop: '4px solid #8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>
        Loading data...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
