import React from 'react';

const boxStyle: React.CSSProperties = {
  border: '2px solid #45a29e',
  borderRadius: '8px',
  padding: '12px',
  margin: '12px',
  width: '180px',
  textAlign: 'center',
  backgroundColor: '#0b0c10',
  color: '#66fcf1',
  fontFamily: 'monospace',
  fontSize: '14px',
  boxShadow: '0 0 10px #45a29e',
};

const arrowStyle: React.CSSProperties = {
  fontSize: '24px',
  color: '#45a29e',
  margin: '0 8px',
  userSelect: 'none',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  padding: '20px',
  backgroundColor: '#1f2833',
  borderRadius: '12px',
  boxShadow: '0 0 20px #0b0c10',
  maxWidth: '100%',
  overflowX: 'auto',
};

const ProjectFlowDiagram: React.FC = () => {
  return (
    <div style={containerStyle} aria-label="Project flow diagram">
      <div style={boxStyle}>
        <div>Frontend UI</div>
        <div style={{ fontSize: '12px', marginTop: '6px' }}>
          React Chat Interface<br />
          System Flow Widget
        </div>
      </div>
      <div style={arrowStyle} aria-hidden="true">➡️</div>
      <div style={boxStyle}>
        <div>Rasa Backend</div>
        <div style={{ fontSize: '12px', marginTop: '6px' }}>
          Intent Classification<br />
          Random Forest ML<br />
          Custom Actions
        </div>
      </div>
      <div style={arrowStyle} aria-hidden="true">➡️</div>
      <div style={boxStyle}>
        <div>LLaMA Agent</div>
        <div style={{ fontSize: '12px', marginTop: '6px' }}>
          Fallback Response<br />
          Language Model API
        </div>
      </div>
      <div style={arrowStyle} aria-hidden="true">⬅️</div>
      <div style={boxStyle}>
        <div>Database</div>
        <div style={{ fontSize: '12px', marginTop: '6px' }}>
          Reservations Storage<br />
          Booking Data
        </div>
      </div>
    </div>
  );
};

export default ProjectFlowDiagram;
