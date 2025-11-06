import egentetoInspectionService from '../services/egentetoInspectionService';

describe('EgentetoInspectionService', () => {
  let service;

  beforeEach(() => {
    service = egentetoInspectionService;
  });

  describe('processResponses', () => {
    it('should process responses and calculate personality dimensions', () => {
      const responses = {
        'q1': 'a', // analytical
        'q2': 'a', // internal
        'q3': 'a', // logic
        'q4': 'a', // structured
        'q5': 'a'  // proactive
      };

      const result = service.processResponses(responses);

      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('typeCode');
      expect(result).toHaveProperty('typeDetails');
      expect(result).toHaveProperty('confidence');

      // Check that the dominant traits are analytical, internal, logic, structured, proactive
      expect(result.profile.thinkingStyle.dominant).toBe('analytical');
      expect(result.profile.energyDirection.dominant).toBe('internal');
      expect(result.profile.decisionMaking.dominant).toBe('logic');
      expect(result.profile.interactionPattern.dominant).toBe('structured');
      expect(result.profile.responseMode.dominant).toBe('proactive');
    });

    it('should handle mixed responses', () => {
      const responses = {
        'q1': 'c', // intuitive
        'q2': 'b', // external
        'q3': 'b', // values
        'q4': 'c', // flexible
        'q5': 'b'  // reactive
      };

      const result = service.processResponses(responses);

      expect(result.profile.thinkingStyle.dominant).toBe('intuitive');
      expect(result.profile.energyDirection.dominant).toBe('external');
      expect(result.profile.decisionMaking.dominant).toBe('values');
      expect(result.profile.interactionPattern.dominant).toBe('flexible');
      expect(result.profile.responseMode.dominant).toBe('reactive');
    });

    it('should calculate confidence level', () => {
      const responses = {
        'q1': 'a',
        'q2': 'a',
        'q3': 'a',
        'q4': 'a',
        'q5': 'a'
      };

      const result = service.processResponses(responses);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('validateResponses', () => {
    it('should validate complete responses', () => {
      const responses = {
        'q1': 'a',
        'q2': 'a',
        'q3': 'a',
        'q4': 'a',
        'q5': 'a'
      };

      const validation = service.validateResponses(responses);
      expect(validation.valid).toBe(true);
      expect(validation.missing).toEqual([]);
    });

    it('should detect missing responses', () => {
      const responses = {
        'q1': 'a',
        'q2': 'a'
      };

      const validation = service.validateResponses(responses);
      expect(validation.valid).toBe(false);
      expect(validation.missing).toContain('q3');
      expect(validation.missing).toContain('q4');
      expect(validation.missing).toContain('q5');
    });
  });

  describe('getQuestions', () => {
    it('should return all inspection questions', () => {
      const questions = service.getQuestions();
      expect(questions).toHaveLength(5);
      expect(questions[0]).toHaveProperty('id');
      expect(questions[0]).toHaveProperty('dimension');
      expect(questions[0]).toHaveProperty('text');
      expect(questions[0]).toHaveProperty('options');
    });
  });
});