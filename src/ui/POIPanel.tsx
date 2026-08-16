import React from 'react';
import { POI } from '../data/types';
import { X, Calendar, Briefcase, Award, ExternalLink } from 'lucide-react';

interface POIPanelProps {
  poi: POI | null;
  onClose: () => void;
}

export const POIPanel: React.FC<POIPanelProps> = ({ poi, onClose }) => {
  if (!poi) return null;

  const { content } = poi;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 15, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          backgroundColor: '#101222',
          border: '3px solid #3a86ff',
          boxShadow: '0 0 30px rgba(58, 134, 255, 0.4)',
          borderRadius: '12px',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            backgroundColor: '#181b34',
            borderBottom: '2px solid #2a2e56',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#3a86ff',
                backgroundColor: '#0d2248',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              {poi.type}
            </span>
            <h2 style={{ fontSize: '24px', color: '#ffffff', marginTop: '8px' }}>{poi.title}</h2>
            {content.period && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
                <Calendar size={14} /> {content.period} {content.role ? `• ${content.role}` : ''}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary */}
          <div>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#cbd5e1' }}>{content.summary}</p>
          </div>

          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', color: '#ffbe0b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Key Skills & Domain Focus
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {content.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#1f2448',
                      color: '#00f5d4',
                      border: '1px solid #2a3368',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {content.achievements && content.achievements.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', color: '#ffbe0b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} /> Highlights & Milestones
              </h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {content.achievements.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '14px', color: '#cbd5e1' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects */}
          {content.projects && content.projects.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', color: '#ffbe0b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={16} /> Featured Projects
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.projects.map((proj, idx) => (
                  <div key={idx} style={{ backgroundColor: '#181b34', padding: '14px', borderRadius: '8px', borderLeft: '3px solid #ff006e' }}>
                    <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '15px' }}>{proj.title}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{proj.description}</div>
                    {proj.technologies && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        {proj.technologies.map((tech, tidx) => (
                          <span key={tidx} style={{ fontSize: '11px', color: '#fb5607', backgroundColor: '#2b1e3a', padding: '2px 6px', borderRadius: '4px' }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {content.links && content.links.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', color: '#ffbe0b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Links & External Info
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {content.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#3a86ff',
                      textDecoration: 'none',
                      fontSize: '14px',
                      backgroundColor: '#181b34',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1px solid #3a86ff'
                    }}
                  >
                    {link.label} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', backgroundColor: '#181b34', borderTop: '2px solid #2a2e56', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#3a86ff',
              color: '#ffffff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
