import React, { useState, useEffect } from 'react';
import egentetoInspectionService from '../services/egentetoInspectionService';
import '../styles/EgentetoInspectionPage.css';

const EgentetoInspectionPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspectionResults, setInspectionResults] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Load questions from service on component mount
  useEffect(() => {
    const inspectionQuestions = egentetoInspectionService.getQuestions();
    setQuestions(inspectionQuestions);
  }, []);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Process inspection results
      setIsProcessing(true);

      // Validate responses before processing
      const validation = egentetoInspectionService.validateResponses(selectedOptions);

      if (validation.valid) {
        // Process responses using the service
        setTimeout(() => {
          try {
            const results = egentetoInspectionService.processResponses(selectedOptions);
            setInspectionResults(results);
            setIsProcessing(false);
            // In a real app, this would navigate to results page
            console.log('Inspection completed with results:', results);
          } catch (error) {
            console.error('Error processing inspection:', error);
            setIsProcessing(false);
          }
        }, 2000);
      } else {
        console.error('Validation failed:', validation.message);
        setIsProcessing(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Show loading state while questions are loading
  if (!questions || questions.length === 0) {
    return (
      <div className="egenteto-inspection-page">
        <div className="inspection-container">
          <div className="processing-state">
            <div className="spinner"></div>
            <h2>Loading Inspection Questions</h2>
            <p>Please wait while we prepare your assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];
  const progressPercentage = (currentStep / questions.length) * 100;

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
              <h2 className="inspection-title">Your Personality Type Verification</h2>
              <p className="inspection-description">Based on your behavioral analysis responses</p>

              <div className="results-card">
                <h3 className="results-type-name">{inspectionResults.typeDetails.name}</h3>
                <p className="results-type-description">{inspectionResults.typeDetails.description}</p>

                <div className="confidence-meter">
                  <span className="confidence-label">Confidence Level:</span>
                  <span className="confidence-value">{inspectionResults.confidence}%</span>
                </div>

                <div className="results-section">
                  <h4>Key Strengths</h4>
                  <ul className="strengths-list">
                    {inspectionResults.typeDetails.strengths.map((strength, index) => (
                      <li key={index} className="strength-item">{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="results-section">
                  <h4>Growth Opportunities</h4>
                  <ul className="growth-list">
                    {inspectionResults.typeDetails.growthAreas.map((area, index) => (
                      <li key={index} className="growth-item">{area}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="navigation-buttons">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setInspectionResults(null);
                    setCurrentStep(1);
                    setSelectedOptions({});
                  }}
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
          <div className="progress-section">
            <span className="step-indicator">Question {currentStep} of {questions.length}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="inspection-main">
          {isProcessing ? (
            <div className="processing-state">
              <div className="spinner"></div>
              <h2>Analyzing Your Responses</h2>
              <p>Processing your personality insights...</p>
            </div>
          ) : (
            <>
              <div className="inspection-content">
                <h2 className="inspection-title">Personality Type Verification</h2>
                <p className="inspection-description">Let's verify your Teto-Egen personality type through behavioral analysis</p>

                <div className="question-section">
                  <h3 className="question-text">{currentQuestion.text}</h3>

                  <div className="options-grid">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className={`option-card ${selectedOptions[currentQuestion.id] === option.id ? 'selected' : ''}`}
                        onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                        role="radio"
                        aria-checked={selectedOptions[currentQuestion.id] === option.id}
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleOptionSelect(currentQuestion.id, option.id);
                          }
                        }}
                      >
                        <div className="option-header">
                          <h4 className="option-label">{option.text}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="navigation-buttons">
                <button
                  className="btn-secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>

                <button
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!selectedOptions[currentQuestion.id]}
                >
                  {currentStep === questions.length ? 'Complete Analysis' : 'Next'}
                </button>
              </div>
            </>
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

export default EgentetoInspectionPage;