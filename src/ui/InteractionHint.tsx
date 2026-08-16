import React from 'react';

interface InteractionHintProps {
  poiTitle: string | null;
  onInteract: () => void;
}

export const InteractionHint: React.FC<InteractionHintProps> = ({ poiTitle, onInteract }) => {
  if (!poiTitle) return null;

  return (
    <div
      onClick={onInteract}
      style={{
        position: 'absolute',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(20, 20, 35, 0.9)',
        border: '3px solid #ffbe0b',
        boxShadow: '0 0 15px rgba(255, 190, 11, 0.6)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        cursor: 'pointer',
        zIndex: 1000,
        animation: 'pulse 1.5s infinite alternate',
        textAlign: 'center'
      }}
    >
      <div>📍 {poiTitle}</div>
      <div style={{ fontSize: '13px', color: '#ffbe0b', marginTop: '4px' }}>
        [ ENTER / TAP TO EXPLORE ]
      </div>
    </div>
  );
};
