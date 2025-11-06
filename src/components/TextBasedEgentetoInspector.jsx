import React, { useState } from 'react';
import { analyzePersonality } from '../utils/egentetoAnalyzer';

const TextBasedEgentetoInspector = () => {
  const [userInput, setUserInput] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = () => {
    if (!userInput.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      try {
        const results = analyzePersonality(userInput);
        setAnalysisResults(results);
      } catch (err) {
        setError('Error analyzing text. Please try again.');
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const handleReset = () => {
    setUserInput('');
    setAnalysisResults(null);
    setError(null);
  };

  return (
    <div className="text-inspector-container">
      <div className="text-inspector-card">
        <h2 className="inspector-title">Text-Based Personality Analysis</h2>
        <p className="inspector-description">
          Share your thoughts, experiences, or describe yourself to discover your Teto-Egen personality type through text analysis.
        </p>

        {!analysisResults ? (
          <div className="input-section">
            <textarea
              className="text-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your personality, experiences, or thoughts... (e.g., 'I enjoy analyzing data and solving complex problems. I prefer working independently and value logical decision-making.')"
              rows={8}
              disabled={isAnalyzing}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="input-actions">
              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !userInput.trim()}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Personality'}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-section">
            <div className="results-header">
              <h3 className="results-title">Your Personality Profile</h3>
              <button className="btn-secondary" onClick={handleReset}>
                Analyze New Text
              </button>
            </div>

            <div className="personality-type-card">
              <h4 className="type-name">{analysisResults.personalityType}</h4>
              <div className="traits-grid">
                {Object.entries(analysisResults.traits).map(([traitKey, trait]) => (
                  <div key={traitKey} className="trait-item">
                    <span className="trait-label">{trait.name}</span>
                    <div className="trait-meter">
                      <div
                        className="trait-fill"
                        style={{ width: `${trait.score}%` }}
                      ></div>
                    </div>
                    <span className="trait-percentage">{trait.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="compatibility-section">
              <h4>Compatibility Insights</h4>
              <div className="insights-grid">
                <div className="insight-card">
                  <h5>Career Recommendations</h5>
                  <ul>
                    {analysisResults.compatibility.careers.slice(0, 3).map((career, index) => (
                      <li key={index}>{career}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-card">
                  <h5>Relationship Compatibility</h5>
                  <ul>
                    {analysisResults.compatibility.relationships.slice(0, 2).map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-card">
                  <h5>Growth Opportunities</h5>
                  <ul>
                    {analysisResults.compatibility.growth.slice(0, 3).map((opportunity, index) => (
                      <li key={index}>{opportunity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextBasedEgentetoInspector;