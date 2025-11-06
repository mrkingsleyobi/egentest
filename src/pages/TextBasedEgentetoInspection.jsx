import React, { useState } from 'react';
import { analyzePersonality } from '../utils/egentetoAnalyzer';
import '../styles/EgentetoInspectionPage.css';

const TextBasedEgentetoInspection = () => {
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspectionResults, setInspectionResults] = useState(null);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleAnalyze = () => {
    if (!userInput.trim()) return;

    setIsProcessing(true);

    try {
      // Process text using the analyzer
      const results = analyzePersonality(userInput);
      setInspectionResults(results);
    } catch (error) {
      console.error('Error analyzing personality:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setInspectionResults(null);
    setUserInput('');
  };

  // Show results if processing is complete
  if (inspectionResults && !isProcessing) {
    return (
      <div className="egenteto-inspection-page">
        <div className="inspection-container">
          <header className="inspection-header">
            <div className="logo">
              <h1>Teto-Egen</h1>
            </div>
          </header>

          <main className="inspection-main">
            <div className="results-content">
              <h2 className="inspection-title">Your Personality Type Analysis</h2>
              <p className="inspection-description">Based on your text input analysis</p>

              <div className="results-card">
                <h3 className="results-type-name">{inspectionResults.personalityType}</h3>

                <div className="confidence-meter">
                  <span className="confidence-label">Analysis Completed</span>
                </div>

                <div className="results-section">
                  <h4>Core Traits</h4>
                  <div className="traits-grid">
                    {Object.entries(inspectionResults.traits).map(([key, trait]) => (
                      <div key={key} className="trait-card">
                        <h4>{trait.name}</h4>
                        <div className="trait-progress">
                          <div
                            className="trait-progress-fill"
                            style={{ width: `${trait.score}%` }}
                          ></div>
                        </div>
                        <span className="trait-score">{trait.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="results-section">
                  <h4>Career Compatibility</h4>
                  <ul className="strengths-list">
                    {inspectionResults.compatibility.careers.map((career, index) => (
                      <li key={index} className="strength-item">{career}</li>
                    ))}
                  </ul>
                </div>

                <div className="results-section">
                  <h4>Relationship Compatibility</h4>
                  <ul className="growth-list">
                    {inspectionResults.compatibility.relationships.map((relationship, index) => (
                      <li key={index} className="growth-item">{relationship}</li>
                    ))}
                  </ul>
                </div>

                <div className="results-section">
                  <h4>Growth Opportunities</h4>
                  <div className="growth-tags">
                    {inspectionResults.compatibility.growth.map((area, index) => (
                      <span key={index} className="growth-tag">{area}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="navigation-buttons">
                <button
                  className="btn-secondary"
                  onClick={handleRetake}
                >
                  Retake Assessment
                </button>
                <button className="btn-primary">
                  View Full Report
                </button>
              </div>
            </div>
          </main>

          <footer className="inspection-footer">
            <p className="footer-text">Teto-Egen Personality Insights • Scientifically Validated</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="egenteto-inspection-page">
      <div className="inspection-container">
        {/* Header */}
        <header className="inspection-header">
          <div className="logo">
            <h1>Teto-Egen</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="inspection-main">
          {isProcessing ? (
            <div className="processing-state">
              <div className="spinner"></div>
              <h2>Analyzing Your Input</h2>
              <p>Processing your personality insights...</p>
            </div>
          ) : (
            <div className="inspection-content">
              <h2 className="inspection-title">Personality Type Analysis</h2>
              <p className="inspection-description">Share your thoughts, experiences, or recent decisions for personality analysis</p>

              <div className="question-section">
                <div className="input-group">
                  <label htmlFor="user-input">
                    Describe your thoughts, experiences, or recent decisions:
                  </label>
                  <textarea
                    id="user-input"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Share your experiences, challenges, recent decisions, or general thoughts about yourself..."
                    rows={8}
                  />
                </div>

                <div className="navigation-buttons">
                  <button
                    className="btn-primary"
                    onClick={handleAnalyze}
                    disabled={!userInput.trim()}
                  >
                    Analyze Personality
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="inspection-footer">
          <p className="footer-text">Teto-Egen Personality Insights • Scientifically Validated</p>
        </footer>
      </div>
    </div>
  );
};

export default TextBasedEgentetoInspection;