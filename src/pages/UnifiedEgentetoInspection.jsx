import React, { useState } from 'react';
import EgentetoInspectionPage from './EgentetoInspectionPage';
import TextBasedEgentetoInspector from '../components/TextBasedEgentetoInspector';
import './UnifiedEgentetoInspection.css';

const UnifiedEgentetoInspection = () => {
  const [inspectionMode, setInspectionMode] = useState('questionnaire'); // 'questionnaire' or 'text'

  return (
    <div className="unified-inspection-container">
      <header className="unified-header">
        <div className="logo">
          <h1>Teto-Egen</h1>
        </div>
        <div className="mode-selector">
          <div className="mode-tabs">
            <button
              className={`mode-tab ${inspectionMode === 'questionnaire' ? 'active' : ''}`}
              onClick={() => setInspectionMode('questionnaire')}
            >
              Questionnaire
            </button>
            <button
              className={`mode-tab ${inspectionMode === 'text' ? 'active' : ''}`}
              onClick={() => setInspectionMode('text')}
            >
              Text Analysis
            </button>
          </div>
          <p className="mode-description">
            {inspectionMode === 'questionnaire'
              ? 'Answer behavioral questions to discover your personality type'
              : 'Describe yourself or your experiences for personality analysis'}
          </p>
        </div>
      </header>

      <main className="unified-main">
        {inspectionMode === 'questionnaire' ? (
          <EgentetoInspectionPage />
        ) : (
          <TextBasedEgentetoInspector />
        )}
      </main>

      <footer className="unified-footer">
        <p className="footer-text">Teto-Egen Personality Insights • Scientifically Validated</p>
      </footer>
    </div>
  );
};

export default UnifiedEgentetoInspection;