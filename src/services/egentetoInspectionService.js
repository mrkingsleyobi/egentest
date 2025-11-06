/**
 * Egenteto Inspection Service
 *
 * This service implements the core logic for the Teto-Egen personality type verification
 * and behavioral analysis system.
 */

class EgentetoInspectionService {
  constructor() {
    // Teto-Egen personality framework dimensions
    this.dimensions = {
      thinkingStyle: {
        analytical: 'Analytical',
        intuitive: 'Intuitive'
      },
      energyDirection: {
        internal: 'Internal',
        external: 'External'
      },
      decisionMaking: {
        logic: 'Logic',
        values: 'Values'
      },
      interactionPattern: {
        structured: 'Structured',
        flexible: 'Flexible'
      },
      responseMode: {
        proactive: 'Proactive',
        reactive: 'Reactive'
      }
    };

    // Personality types based on dimension combinations
    this.personalityTypes = {
      'A-I-E-S-P': {
        name: 'The Analytical Visionary',
        description: 'Strategic thinkers who approach problems systematically while maintaining big-picture perspective',
        strengths: ['Problem-solving', 'Critical analysis', 'Strategic planning'],
        growthAreas: ['Emotional intelligence', 'Spontaneous creativity']
      },
      'A-I-E-S-R': {
        name: 'The Methodical Executor',
        description: 'Detail-oriented implementers who execute plans with precision and consistency',
        strengths: ['Attention to detail', 'Reliability', 'Process optimization'],
        growthAreas: ['Adaptability', 'Risk-taking']
      },
      'A-I-E-F-P': {
        name: 'The Adaptive Innovator',
        description: 'Flexible problem-solvers who adapt their approach based on situational needs',
        strengths: ['Adaptability', 'Creative problem-solving', 'Versatility'],
        growthAreas: ['Consistency', 'Long-term planning']
      },
      'A-I-I-S-P': {
        name: 'The Reflective Strategist',
        description: 'Thoughtful planners who prefer to work independently on complex challenges',
        strengths: ['Deep thinking', 'Independent work', 'Strategic foresight'],
        growthAreas: ['Delegation', 'Public speaking']
      },
      'I-I-E-S-P': {
        name: 'The Charismatic Leader',
        description: 'Natural leaders who inspire others through their intuitive understanding of people',
        strengths: ['Leadership', 'Communication', 'Influence'],
        growthAreas: ['Data analysis', 'Process documentation']
      },
      'I-I-E-F-R': {
        name: 'The Social Catalyst',
        description: 'Energetic collaborators who thrive in social environments and drive group dynamics',
        strengths: ['Team building', 'Motivation', 'Networking'],
        growthAreas: ['Individual focus', 'Deep analysis']
      }
      // Additional types would be defined here
    };

    // Question bank for inspection
    this.questionBank = [
      {
        id: 'q1',
        dimension: 'thinkingStyle',
        text: 'In group discussions, you tend to:',
        options: [
          { id: 'a', text: 'Listen carefully to others', weight: { analytical: 0.7, intuitive: 0.3 } },
          { id: 'b', text: 'Share ideas when asked', weight: { analytical: 0.5, intuitive: 0.5 } },
          { id: 'c', text: 'Lead discussions', weight: { analytical: 0.3, intuitive: 0.7 } }
        ]
      },
      {
        id: 'q2',
        dimension: 'energyDirection',
        text: 'When solving complex problems, you prefer to:',
        options: [
          { id: 'a', text: 'Break into smaller parts', weight: { internal: 0.8, external: 0.2 } },
          { id: 'b', text: 'See the big picture', weight: { internal: 0.4, external: 0.6 } },
          { id: 'c', text: 'Experiment with solutions', weight: { internal: 0.3, external: 0.7 } }
        ]
      },
      {
        id: 'q3',
        dimension: 'decisionMaking',
        text: 'After social interactions, you typically:',
        options: [
          { id: 'a', text: 'Need quiet time alone', weight: { logic: 0.6, values: 0.4 } },
          { id: 'b', text: 'Feel energized and ready', weight: { logic: 0.3, values: 0.7 } },
          { id: 'c', text: 'Mix of both depending on context', weight: { logic: 0.5, values: 0.5 } }
        ]
      },
      {
        id: 'q4',
        dimension: 'interactionPattern',
        text: 'When working on projects, you prefer:',
        options: [
          { id: 'a', text: 'Detailed plans with clear steps', weight: { structured: 0.8, flexible: 0.2 } },
          { id: 'b', text: 'General outline with room to adapt', weight: { structured: 0.4, flexible: 0.6 } },
          { id: 'c', text: 'Flexible approach based on what emerges', weight: { structured: 0.2, flexible: 0.8 } }
        ]
      },
      {
        id: 'q5',
        dimension: 'responseMode',
        text: 'When facing new challenges, you typically:',
        options: [
          { id: 'a', text: 'Start planning and taking action immediately', weight: { proactive: 0.8, reactive: 0.2 } },
          { id: 'b', text: 'Observe and gather information first', weight: { proactive: 0.3, reactive: 0.7 } },
          { id: 'c', text: 'Mix of both depending on the situation', weight: { proactive: 0.5, reactive: 0.5 } }
        ]
      }
    ];
  }

  /**
   * Process user responses and calculate personality dimensions
   * @param {Object} responses - User responses to inspection questions
   * @returns {Object} Calculated personality dimensions and type
   */
  processResponses(responses) {
    // Initialize dimension scores
    const dimensionScores = {
      thinkingStyle: { analytical: 0, intuitive: 0 },
      energyDirection: { internal: 0, external: 0 },
      decisionMaking: { logic: 0, values: 0 },
      interactionPattern: { structured: 0, flexible: 0 },
      responseMode: { proactive: 0, reactive: 0 }
    };

    // Handle null or undefined responses
    if (!responses || typeof responses !== 'object') {
      responses = {};
    }

    // Process each response
    Object.keys(responses).forEach(questionId => {
      const question = this.questionBank.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === responses[questionId]);
        if (selectedOption) {
          // Add weighted scores to dimensions
          Object.keys(selectedOption.weight).forEach(dimensionValue => {
            dimensionScores[question.dimension][dimensionValue] += selectedOption.weight[dimensionValue];
          });
        }
      }
    });

    // Calculate dominant values for each dimension
    const personalityProfile = {};
    Object.keys(dimensionScores).forEach(dimension => {
      const scores = dimensionScores[dimension];
      const maxValue = Math.max(...Object.values(scores));
      const dominantValue = Object.keys(scores).find(key => scores[key] === maxValue);
      personalityProfile[dimension] = {
        dominant: dominantValue,
        scores: scores
      };
    });

    // Generate personality type code
    const typeCode = this.generateTypeCode(personalityProfile);

    // Get personality type details
    const personalityType = this.personalityTypes[typeCode] || {
      name: 'Unique Blend',
      description: 'A distinctive combination of personality traits',
      strengths: ['Adaptability', 'Unique perspective'],
      growthAreas: ['Self-awareness', 'Pattern recognition']
    };

    return {
      profile: personalityProfile,
      typeCode: typeCode,
      typeDetails: personalityType,
      confidence: this.calculateConfidence(dimensionScores)
    };
  }

  /**
   * Generate personality type code based on dominant dimension values
   * @param {Object} profile - Personality profile with dominant values
   * @returns {string} Personality type code
   */
  generateTypeCode(profile) {
    // Map dimension values to single letter codes
    const codeMap = {
      thinkingStyle: {
        analytical: 'A',
        intuitive: 'I'
      },
      energyDirection: {
        internal: 'I',
        external: 'E'
      },
      decisionMaking: {
        logic: 'L',
        values: 'V'
      },
      interactionPattern: {
        structured: 'S',
        flexible: 'F'
      },
      responseMode: {
        proactive: 'P',
        reactive: 'R'
      }
    };

    return `${codeMap.thinkingStyle[profile.thinkingStyle.dominant]}-${codeMap.energyDirection[profile.energyDirection.dominant]}-${codeMap.decisionMaking[profile.decisionMaking.dominant]}-${codeMap.interactionPattern[profile.interactionPattern.dominant]}-${codeMap.responseMode[profile.responseMode.dominant]}`;
  }

  /**
   * Calculate confidence level of the assessment
   * @param {Object} dimensionScores - Raw dimension scores
   * @returns {number} Confidence level (0-100)
   */
  calculateConfidence(dimensionScores) {
    let totalConfidence = 0;
    let dimensionCount = 0;

    Object.keys(dimensionScores).forEach(dimension => {
      const scores = dimensionScores[dimension];
      const values = Object.values(scores);
      if (values.length >= 2) {
        const sortedValues = values.sort((a, b) => b - a);
        const difference = sortedValues[0] - sortedValues[1];
        // Confidence based on how distinct the dominant trait is
        const dimensionConfidence = Math.min(100, difference * 20);
        totalConfidence += dimensionConfidence;
        dimensionCount++;
      }
    });

    return dimensionCount > 0 ? Math.round(totalConfidence / dimensionCount) : 0;
  }

  /**
   * Get inspection questions
   * @returns {Array} Array of inspection questions
   */
  getQuestions() {
    return this.questionBank;
  }

  /**
   * Validate responses
   * @param {Object} responses - User responses
   * @returns {Object} Validation result
   */
  validateResponses(responses) {
    const requiredQuestions = this.questionBank.map(q => q.id);
    const providedQuestions = Object.keys(responses);

    const missing = requiredQuestions.filter(q => !providedQuestions.includes(q));
    const valid = missing.length === 0;

    return {
      valid: valid,
      missing: missing,
      message: valid ? 'All responses provided' : `Missing responses for questions: ${missing.join(', ')}`
    };
  }
}

// Export singleton instance
const egentetoInspectionService = new EgentetoInspectionService();
export default egentetoInspectionService;