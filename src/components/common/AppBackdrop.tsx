import React from 'react';

interface AppBackdropProps {
  className?: string;
}

export const AppBackdrop: React.FC<AppBackdropProps> = ({ className = '' }) => {
  return (
    <div aria-hidden="true" className={`app-backdrop ${className}`}>
      <div
        className="app-backdrop__blob"
        style={{ width: '45vw', height: '45vw', top: '-12%', left: '-8%', background: 'radial-gradient(circle at center, #4f46e5, transparent 70%)' }}
      />
      <div
        className="app-backdrop__blob"
        style={{ width: '38vw', height: '38vw', top: '28%', right: '-10%', background: 'radial-gradient(circle at center, #22d3ee, transparent 70%)', animationDelay: '-6s' }}
      />
      <div
        className="app-backdrop__blob"
        style={{ width: '40vw', height: '40vw', bottom: '-14%', left: '22%', background: 'radial-gradient(circle at center, #818cf8, transparent 70%)', animationDelay: '-12s' }}
      />
    </div>
  );
};