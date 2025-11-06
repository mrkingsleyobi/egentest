/**
 * Unit tests for Egenteto Analyzer
 */

import { analyzeUserInput, determinePersonalityType, generateCompatibilityInsights, analyzePersonality } from './egentetoAnalyzer';

describe('Egenteto Analyzer', () => {
  describe('analyzeUserInput', () => {
    test('should return default scores for empty input', () => {
      const result = analyzeUserInput('');
      expect(result).toEqual({
        thinkingStyle: { analytical: 5, intuitive: 5 },
        energyDirection: { internal: 5, external: 5 },
        decisionMaking: { logic: 5, values: 5 },
        interactionPattern: { structured: 5, flexible: 5 },
        responseMode: { proactive: 5, reactive: 5 }
      });
    });

    test('should detect analytical thinking keywords', () => {
      const input = "I analyze data and solve problems systematically";
      const result = analyzeUserInput(input);
      expect(result.thinkingStyle.analytical).toBeGreaterThan(0);
    });

    test('should detect intuitive thinking keywords', () => {
      const input = "I use my intuition and creative vision to innovate";
      const result = analyzeUserInput(input);
      expect(result.thinkingStyle.intuitive).toBeGreaterThan(0);
    });

    test('should detect internal energy keywords', () => {
      const input = "I prefer quiet reflection and working alone";
      const result = analyzeUserInput(input);
      expect(result.energyDirection.internal).toBeGreaterThan(0);
    });

    test('should detect external energy keywords', () => {
      const input = "I thrive in social situations and group work";
      const result = analyzeUserInput(input);
      expect(result.energyDirection.external).toBeGreaterThan(0);
    });
  });

  describe('determinePersonalityType', () => {
    test('should determine personality type based on scores', () => {
      const scores = {
        thinkingStyle: { analytical: 10, intuitive: 5 },
        energyDirection: { internal: 8, external: 3 },
        decisionMaking: { logic: 7, values: 4 },
        interactionPattern: { structured: 9, flexible: 2 },
        responseMode: { proactive: 6, reactive: 5 }
      };

      const result = determinePersonalityType(scores);
      expect(result.typeCode).toBe('AA-L-S-P');
      expect(result.personalityType).toBe('The Analytical Strategist (TETO-EGEN)');
    });

    test('should handle edge case scores', () => {
      const scores = {
        thinkingStyle: { analytical: 10, intuitive: 5 },
        energyDirection: { internal: 8, external: 3 },
        decisionMaking: { logic: 7, values: 4 },
        interactionPattern: { structured: 9, flexible: 2 },
        responseMode: { proactive: 6, reactive: 5 }
      };

      const result = determinePersonalityType(scores);
      expect(result.typeCode).toBe('AA-L-S-P');
      expect(result.personalityType).toBe('The Analytical Strategist (TETO-EGEN)');
    });
  });

  describe('generateCompatibilityInsights', () => {
    test('should generate career insights for analytical types', () => {
      const insights = generateCompatibilityInsights('AA-L-S-P');
      expect(insights.careers).toContain('Data Scientist');
      expect(insights.careers).toContain('Software Engineer');
    });

    test('should generate relationship insights', () => {
      const insights = generateCompatibilityInsights('AA-L-S-P');
      expect(insights.relationships.length).toBeGreaterThan(0);
    });

    test('should generate growth insights', () => {
      const insights = generateCompatibilityInsights('AA-L-S-P');
      expect(insights.growth.length).toBeGreaterThan(0);
    });
  });

  describe('analyzePersonality', () => {
    test('should return complete personality profile', () => {
      const input = "I analyze data systematically and prefer working alone";
      const result = analyzePersonality(input);

      expect(result).toHaveProperty('personalityType');
      expect(result).toHaveProperty('traits');
      expect(result).toHaveProperty('compatibility');
      expect(result).toHaveProperty('timestamp');

      // Check that traits object has the expected structure
      expect(result.traits).toHaveProperty('thinkingStyle');
      expect(result.traits).toHaveProperty('energyDirection');
      expect(result.traits).toHaveProperty('decisionMaking');
      expect(result.traits).toHaveProperty('interactionPattern');
      expect(result.traits).toHaveProperty('responseMode');

      // Check that compatibility object has the expected structure
      expect(result.compatibility).toHaveProperty('careers');
      expect(result.compatibility).toHaveProperty('relationships');
      expect(result.compatibility).toHaveProperty('growth');
    });
  });
});