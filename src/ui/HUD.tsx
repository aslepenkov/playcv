import React from 'react';
import { Season } from '../time/SeasonCycle';
import { Sun, Moon } from 'lucide-react';

interface HUDProps {
  season: Season;
  isNight: boolean;
  onMobileMove?: (dx: number, dy: number) => void;
  onMobileInteract?: () => void;
  isNearPOI?: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  season,
  isNight,
  onMobileMove,
  onMobileInteract,
  isNearPOI
}) => {
  return (
    <>
      {/* Top Left Status Badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          backgroundColor: 'rgba(16, 18, 34, 0.85)',
          border: '2px solid #3a86ff',
          borderRadius: '8px',
          padding: '10px 16px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold' }}>
          {isNight ? <Moon size={18} color="#00f5d4" /> : <Sun size={18} color="#ffbe0b" />}
          <span>{isNight ? 'NIGHT' : 'DAY'}</span>
        </div>
        <div style={{ width: '1px', height: '16px', backgroundColor: '#3a86ff' }} />
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffbe0b' }}>
          🌿 {season.toUpperCase()}
        </div>
      </div>

      {/* Top Right Controls Guide */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(16, 18, 34, 0.85)',
          border: '1px solid #2a2e56',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#cbd5e1',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 1000
        }}
      >
        <div><strong>ARROWS / WASD</strong> : WALK</div>
        <div><strong>ENTER / TAP</strong> : EXPLORE</div>
      </div>

      {/* Mobile Virtual D-Pad */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          zIndex: 1000
        }}
      >
        <button
          onTouchStart={() => onMobileMove?.(0, 1)}
          onTouchEnd={() => onMobileMove?.(0, 0)}
          onMouseDown={() => onMobileMove?.(0, 1)}
          onMouseUp={() => onMobileMove?.(0, 0)}
          style={btnStyle}
        >
          ▲
        </button>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onTouchStart={() => onMobileMove?.(-1, 0)}
            onTouchEnd={() => onMobileMove?.(0, 0)}
            onMouseDown={() => onMobileMove?.(-1, 0)}
            onMouseUp={() => onMobileMove?.(0, 0)}
            style={btnStyle}
          >
            ◄
          </button>
          <button
            onTouchStart={() => onMobileMove?.(1, 0)}
            onTouchEnd={() => onMobileMove?.(0, 0)}
            onMouseDown={() => onMobileMove?.(1, 0)}
            onMouseUp={() => onMobileMove?.(0, 0)}
            style={btnStyle}
          >
            ►
          </button>
        </div>
        <button
          onTouchStart={() => onMobileMove?.(0, -1)}
          onTouchEnd={() => onMobileMove?.(0, 0)}
          onMouseDown={() => onMobileMove?.(0, -1)}
          onMouseUp={() => onMobileMove?.(0, 0)}
          style={btnStyle}
        >
          ▼
        </button>
      </div>

      {/* Mobile Action Button */}
      {isNearPOI && (
        <button
          onClick={onMobileInteract}
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '24px',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#ffbe0b',
            color: '#050510',
            border: '3px solid #ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 0 15px rgba(255, 190, 11, 0.8)',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          ENTER
        </button>
      )}
    </>
  );
};

const btnStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  backgroundColor: 'rgba(24, 27, 52, 0.85)',
  border: '2px solid #3a86ff',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none'
};
