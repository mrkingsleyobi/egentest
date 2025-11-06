import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EgentetoInspectionPage from '../EgentetoInspectionPage';

// Mock the service
const mockQuestions = [
  {
    id: 'q1',
    text: 'Test question 1',
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' }
    ]
  },
  {
    id: 'q2',
    text: 'Test question 2',
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' }
    ]
  }
];

jest.mock('../../services/egentetoInspectionService', () => ({
  getQuestions: jest.fn(() => mockQuestions),
  validateResponses: jest.fn(() => ({ valid: true, missing: [], message: 'All responses provided' })),
  processResponses: jest.fn(() => ({
    profile: {},
    typeCode: 'A-I-L-S-P',
    typeDetails: {
      name: 'Test Personality Type',
      description: 'Test description',
      strengths: ['Strength 1', 'Strength 2'],
      growthAreas: ['Growth Area 1', 'Growth Area 2']
    },
    confidence: 85
  }))
}));

describe('EgentetoInspectionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Reset mock to return empty array for this test
    require('../../services/egentetoInspectionService').getQuestions.mockReturnValueOnce([]);

    render(<EgentetoInspectionPage />);

    expect(screen.getByText('Loading Inspection Questions')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we prepare your assessment...')).toBeInTheDocument();
  });

  it('should render first question after loading', () => {
    render(<EgentetoInspectionPage />);

    expect(screen.getByText('Personality Type Verification')).toBeInTheDocument();
    expect(screen.getByText('Test question 1')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('should navigate between questions', () => {
    render(<EgentetoInspectionPage />);

    // Select an option
    const optionA = screen.getByText('Option A');
    fireEvent.click(optionA);

    // Click Next
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should show second question
    expect(screen.getByText('Test question 2')).toBeInTheDocument();

    // Click Previous
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    // Should show first question again
    expect(screen.getByText('Test question 1')).toBeInTheDocument();
  });

  it('should process results when completed', () => {
    render(<EgentetoInspectionPage />);

    // Select options for all questions
    const optionA1 = screen.getByText('Option A');
    fireEvent.click(optionA1);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    const optionA2 = screen.getByText('Option A');
    fireEvent.click(optionA2);

    const completeButton = screen.getByText('Complete Analysis');
    fireEvent.click(completeButton);

    // Should show processing state
    expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();

    // Wait for results (we're using setTimeout in the component)
    // In a real test, we would mock setTimeout or use async testing
  });
});