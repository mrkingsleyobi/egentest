import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EgentetoInspectionPage from '../../src/pages/EgentetoInspectionPage';

// Mock the egentetoInspectionService
jest.mock('../../src/services/egentetoInspectionService', () => ({
  __esModule: true,
  default: {
    getQuestions: () => [
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
    ],
    validateResponses: (responses) => ({
      valid: Object.keys(responses).length >= 2,
      missing: Object.keys(responses).length < 2 ? ['q1', 'q2'] : [],
      message: Object.keys(responses).length >= 2 ? 'All responses provided' : 'Missing responses'
    }),
    processResponses: (responses) => ({
      typeDetails: {
        name: 'Test Personality Type',
        description: 'Test personality description',
        strengths: ['Strength 1', 'Strength 2'],
        growthAreas: ['Growth Area 1', 'Growth Area 2']
      },
      confidence: 85
    })
  }
}));

describe('EgentetoInspectionPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render inspection questions', async () => {
    render(<EgentetoInspectionPage />);

    // Wait for questions to load
    expect(await screen.findByText('Test question 1')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('should allow selecting options', async () => {
    render(<EgentetoInspectionPage />);

    // Wait for questions to load
    const optionA = await screen.findByText('Option A');
    fireEvent.click(optionA);

    // Check that option is selected
    expect(optionA.closest('.option-card')).toHaveClass('selected');
  });

  it('should navigate between questions', async () => {
    render(<EgentetoInspectionPage />);

    // Wait for questions to load
    const nextButton = await screen.findByText('Next');

    // Select an option first
    const optionA = screen.getByText('Option A');
    fireEvent.click(optionA);

    // Click next button
    fireEvent.click(nextButton);

    // Should show second question
    expect(screen.getByText('Test question 2')).toBeInTheDocument();

    // Click previous button
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    // Should show first question again
    expect(screen.getByText('Test question 1')).toBeInTheDocument();
  });

  it('should process results when completed', async () => {
    render(<EgentetoInspectionPage />);

    // Wait for questions to load
    const nextButton = await screen.findByText('Next');

    // Select options for both questions
    const optionA1 = screen.getByText('Option A');
    fireEvent.click(optionA1);
    fireEvent.click(nextButton);

    const optionA2 = await screen.findByText('Option A');
    fireEvent.click(optionA2);

    // Click complete analysis
    const completeButton = screen.getByText('Complete Analysis');
    fireEvent.click(completeButton);

    // Should show processing state
    expect(screen.getByText('Analyzing Your Responses')).toBeInTheDocument();
  });
});