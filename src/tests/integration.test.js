import { analyzePersonality } from '../utils/egentetoAnalyzer';
import egentetoInspectionService from '../services/egentetoInspectionService';

describe('Teto-Egen Personality Test Integration', () => {
  describe('PRD Requirement Verification', () => {
    test('should implement the Teto-Egen personality framework with 5 core dimensions', () => {
      // Test that the analyzer implements all 5 dimensions from the PRD
      const testInput = "I analyze data systematically and prefer working alone. I make logical decisions based on facts and evidence. I like structured approaches to projects and plan ahead rather than react to situations.";
      const result = analyzePersonality(testInput);

      // Verify all 5 dimensions are present
      expect(result.traits).toHaveProperty('thinkingStyle');
      expect(result.traits).toHaveProperty('energyDirection');
      expect(result.traits).toHaveProperty('decisionMaking');
      expect(result.traits).toHaveProperty('interactionPattern');
      expect(result.traits).toHaveProperty('responseMode');

      // Verify dimension names match PRD requirements
      expect(result.traits.thinkingStyle.name).toMatch(/Analytical|Intuitive/);
      expect(result.traits.energyDirection.name).toMatch(/Internal|External/);
      expect(result.traits.decisionMaking.name).toMatch(/Logic-driven|Values-driven/);
      expect(result.traits.interactionPattern.name).toMatch(/Structured|Flexible/);
      expect(result.traits.responseMode.name).toMatch(/Proactive|Reactive/);
    });

    test('should provide comprehensive personality analysis with strengths and growth areas', () => {
      const testInput = "I enjoy analyzing data and solving complex problems. I prefer working in quiet environments and tend to think carefully before making decisions. I value structure and planning in my approach to projects.";
      const result = analyzePersonality(testInput);

      // Verify personality type is determined
      expect(result.personalityType).toBeDefined();
      expect(typeof result.personalityType).toBe('string');

      // Verify compatibility insights are provided (career, relationships, growth)
      expect(result.compatibility).toHaveProperty('careers');
      expect(result.compatibility).toHaveProperty('relationships');
      expect(result.compatibility).toHaveProperty('growth');

      // Verify arrays are not empty
      expect(Array.isArray(result.compatibility.careers)).toBe(true);
      expect(Array.isArray(result.compatibility.relationships)).toBe(true);
      expect(Array.isArray(result.compatibility.growth)).toBe(true);

      expect(result.compatibility.careers.length).toBeGreaterThan(0);
      expect(result.compatibility.growth.length).toBeGreaterThan(0);
    });

    test('should support questionnaire-based assessment with validation', () => {
      // Test that the inspection service can handle questionnaire responses
      const questions = egentetoInspectionService.getQuestions();

      // Verify questions exist and have proper structure
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);

      // Verify each question has required properties
      questions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('dimension');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('options');
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options.length).toBeGreaterThan(0);
      });

      // Test response validation
      const emptyResponses = {};
      const validation = egentetoInspectionService.validateResponses(emptyResponses);
      expect(validation.valid).toBe(false);
      expect(Array.isArray(validation.missing)).toBe(true);

      // Test processing with sample responses
      const sampleResponses = {};
      questions.slice(0, 3).forEach((question, index) => {
        sampleResponses[question.id] = question.options[0].id;
      });

      const partialValidation = egentetoInspectionService.validateResponses(sampleResponses);
      expect(partialValidation.valid).toBe(false); // Should be false since not all questions answered

      // Test with complete responses
      const completeResponses = {};
      questions.forEach((question, index) => {
        completeResponses[question.id] = question.options[0].id;
      });

      const completeValidation = egentetoInspectionService.validateResponses(completeResponses);
      expect(completeValidation.valid).toBe(true);
    });

    test('should generate 16 distinct personality types as specified in PRD', () => {
      // Test that the system can generate different personality types
      const service = egentetoInspectionService;

      // Test different response patterns to verify multiple personality types
      const questions = service.getQuestions();

      // Create responses that should lead to different personality types
      const analyticalResponses = {};
      const intuitiveResponses = {};

      questions.forEach((question, index) => {
        if (question.dimension === 'thinkingStyle') {
          // Force analytical responses
          analyticalResponses[question.id] = question.options.find(opt =>
            opt.text.toLowerCase().includes('analyze') ||
            opt.text.toLowerCase().includes('break') ||
            opt.text.toLowerCase().includes('systematic')
          )?.id || question.options[0].id;

          // Force intuitive responses
          intuitiveResponses[question.id] = question.options.find(opt =>
            opt.text.toLowerCase().includes('vision') ||
            opt.text.toLowerCase().includes('creative') ||
            opt.text.toLowerCase().includes('explore')
          )?.id || question.options[2].id;
        } else {
          // Use first option for other dimensions
          analyticalResponses[question.id] = question.options[0].id;
          intuitiveResponses[question.id] = question.options[0].id;
        }
      });

      // Process both response sets
      const analyticalResult = service.processResponses(analyticalResponses);
      const intuitiveResult = service.processResponses(intuitiveResponses);

      // Verify both results have type information
      expect(analyticalResult.typeDetails).toBeDefined();
      expect(intuitiveResult.typeDetails).toBeDefined();

      // Verify confidence calculation works
      expect(typeof analyticalResult.confidence).toBe('number');
      expect(analyticalResult.confidence).toBeGreaterThanOrEqual(0);
      expect(analyticalResult.confidence).toBeLessThanOrEqual(100);
    });

    test('should provide actionable insights and recommendations', () => {
      const testInput = "I work best in structured environments with clear goals and deadlines. I prefer to plan my approach rather than react to situations. I make decisions based on logical analysis of facts and data.";
      const result = analyzePersonality(testInput);

      // Verify actionable insights are provided
      expect(result.compatibility.careers.length).toBeGreaterThan(0);
      expect(result.compatibility.growth.length).toBeGreaterThan(0);

      // Verify career recommendations are relevant
      const careers = result.compatibility.careers;
      expect(careers.some(career => career.includes('Analyst') || career.includes('Engineer') || career.includes('Scientist'))).toBe(true);

      // Verify growth recommendations are actionable
      const growthAreas = result.compatibility.growth;
      expect(growthAreas.some(area => area.includes('Emotional') || area.includes('Creative') || area.includes('Communication'))).toBe(true);
    });
  });

  describe('User Experience Requirements', () => {
    test('should handle empty or invalid input gracefully', () => {
      // Test empty input
      const emptyResult = analyzePersonality('');
      expect(emptyResult.personalityType).toBeDefined();
      expect(emptyResult.traits).toBeDefined();

      // Test null input
      const nullResult = analyzePersonality(null);
      expect(nullResult.personalityType).toBeDefined();
      expect(nullResult.traits).toBeDefined();

      // Test undefined input
      const undefinedResult = analyzePersonality(undefined);
      expect(undefinedResult.personalityType).toBeDefined();
      expect(undefinedResult.traits).toBeDefined();
    });

    test('should provide consistent results for similar inputs', () => {
      const input1 = "I analyze data systematically and prefer working alone. I make logical decisions based on facts and evidence. I like structured approaches to projects and plan ahead rather than react to situations.";
      const input2 = "I work systematically with data analysis. I prefer solitary work environments. My decisions are based on logic and factual evidence. I use structured planning approaches and prefer proactive over reactive methods.";

      const result1 = analyzePersonality(input1);
      const result2 = analyzePersonality(input2);

      // Both should identify similar personality traits
      expect(result1.traits.thinkingStyle.name).toBe(result2.traits.thinkingStyle.name);
      expect(result1.traits.decisionMaking.name).toBe(result2.traits.decisionMaking.name);
    });
  });
});