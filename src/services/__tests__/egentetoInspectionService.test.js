import egentetoInspectionService from '../../services/egentetoInspectionService';

describe('Egenteto Inspection Service', () => {
  describe('getQuestions', () => {
    it('should return an array of questions', () => {
      const questions = egentetoInspectionService.getQuestions();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should have questions with proper structure', () => {
      const questions = egentetoInspectionService.getQuestions();
      const firstQuestion = questions[0];

      expect(firstQuestion).toHaveProperty('id');
      expect(firstQuestion).toHaveProperty('dimension');
      expect(firstQuestion).toHaveProperty('text');
      expect(firstQuestion).toHaveProperty('options');
      expect(Array.isArray(firstQuestion.options)).toBe(true);
      expect(firstQuestion.options.length).toBeGreaterThan(0);
    });
  });

  describe('validateResponses', () => {
    it('should validate complete responses', () => {
      const questions = egentetoInspectionService.getQuestions();
      const responses = {};

      // Create mock responses for all questions
      questions.forEach(question => {
        responses[question.id] = question.options[0].id;
      });

      const validation = egentetoInspectionService.validateResponses(responses);
      expect(validation.valid).toBe(true);
      expect(validation.missing).toEqual([]);
    });

    it('should identify missing responses', () => {
      const responses = { q1: 'a' }; // Only one response
      const validation = egentetoInspectionService.validateResponses(responses);

      expect(validation.valid).toBe(false);
      expect(validation.missing.length).toBeGreaterThan(0);
    });
  });

  describe('processResponses', () => {
    it('should process valid responses and return results', () => {
      const questions = egentetoInspectionService.getQuestions();
      const responses = {};

      // Create mock responses for all questions
      questions.forEach(question => {
        responses[question.id] = question.options[0].id;
      });

      const results = egentetoInspectionService.processResponses(responses);

      expect(results).toHaveProperty('profile');
      expect(results).toHaveProperty('typeCode');
      expect(results).toHaveProperty('typeDetails');
      expect(results).toHaveProperty('confidence');

      // Check that profile has all dimensions
      expect(results.profile).toHaveProperty('thinkingStyle');
      expect(results.profile).toHaveProperty('energyDirection');
      expect(results.profile).toHaveProperty('decisionMaking');
      expect(results.profile).toHaveProperty('interactionPattern');
      expect(results.profile).toHaveProperty('responseMode');
    });

    it('should calculate confidence level', () => {
      const questions = egentetoInspectionService.getQuestions();
      const responses = {};

      // Create mock responses for all questions
      questions.forEach(question => {
        responses[question.id] = question.options[0].id;
      });

      const results = egentetoInspectionService.processResponses(responses);
      expect(typeof results.confidence).toBe('number');
      expect(results.confidence).toBeGreaterThanOrEqual(0);
      expect(results.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('generateTypeCode', () => {
    it('should generate a valid type code', () => {
      const mockProfile = {
        thinkingStyle: { dominant: 'analytical' },
        energyDirection: { dominant: 'internal' },
        decisionMaking: { dominant: 'logic' },
        interactionPattern: { dominant: 'structured' },
        responseMode: { dominant: 'proactive' }
      };

      const typeCode = egentetoInspectionService.generateTypeCode(mockProfile);
      expect(typeof typeCode).toBe('string');
      expect(typeCode).toMatch(/^[A-Z]-[A-Z]-[A-Z]-[A-Z]-[A-Z]$/);
    });
  });
});