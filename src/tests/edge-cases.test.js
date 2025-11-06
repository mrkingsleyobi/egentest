import { analyzePersonality } from '../utils/egentetoAnalyzer';
import egentetoInspectionService from '../services/egentetoInspectionService';

describe('Egenteto Edge Cases and Error Handling', () => {
  test('should handle extremely long input text', () => {
    const longText = "I analyze data ".repeat(1000) + "and solve problems systematically.";
    const result = analyzePersonality(longText);

    expect(result.personalityType).toBeDefined();
    expect(result.traits).toBeDefined();
    expect(result.compatibility).toBeDefined();
  });

  test('should handle special characters and unicode', () => {
    const specialText = "I analyze data & solve problems! @#$%^&*()_+{}|:\"<>?~`-=[]\\;\',./";
    const result = analyzePersonality(specialText);

    expect(result.personalityType).toBeDefined();
    expect(typeof result.personalityType).toBe('string');
  });

  test('should handle mixed case input', () => {
    const mixedCaseText = "I ANALYZE data and SOLVE problems Systematically.";
    const result1 = analyzePersonality(mixedCaseText.toLowerCase());
    const result2 = analyzePersonality(mixedCaseText.toUpperCase());

    // Should produce consistent results regardless of case
    expect(result1.traits.thinkingStyle.name).toBe(result2.traits.thinkingStyle.name);
  });

  test('should handle questionnaire validation edge cases', () => {
    const service = egentetoInspectionService;
    const questions = service.getQuestions();

    // Test with invalid question IDs
    const invalidResponses = {
      'invalid-question-1': 'a',
      'invalid-question-2': 'b'
    };

    const validation = service.validateResponses(invalidResponses);
    expect(validation.valid).toBe(false);
    expect(validation.missing.length).toBeGreaterThan(0);

    // Test with partial valid responses
    const partialValidResponses = {
      ...invalidResponses
    };

    questions.slice(0, 2).forEach((question, index) => {
      partialValidResponses[question.id] = question.options[0].id;
    });

    const partialValidation = service.validateResponses(partialValidResponses);
    expect(partialValidation.valid).toBe(false);
  });

  test('should handle questionnaire processing edge cases', () => {
    const service = egentetoInspectionService;
    const questions = service.getQuestions();

    // Test with all first options selected
    const allFirstOptions = {};
    questions.forEach(question => {
      allFirstOptions[question.id] = question.options[0].id;
    });

    const result1 = service.processResponses(allFirstOptions);
    expect(result1.profile).toBeDefined();
    expect(result1.typeCode).toBeDefined();
    expect(result1.confidence).toBeDefined();

    // Test with all last options selected
    const allLastOptions = {};
    questions.forEach(question => {
      allLastOptions[question.id] = question.options[question.options.length - 1].id;
    });

    const result2 = service.processResponses(allLastOptions);
    expect(result2.profile).toBeDefined();
    expect(result2.typeCode).toBeDefined();
    expect(result2.confidence).toBeDefined();
  });

  test('should handle empty and null responses gracefully', () => {
    const service = egentetoInspectionService;

    // Test with completely empty responses
    const emptyResult = service.processResponses({});
    expect(emptyResult.profile).toBeDefined();
    expect(emptyResult.typeDetails).toBeDefined();

    // Test with null responses
    const nullResult = service.processResponses(null);
    expect(nullResult.profile).toBeDefined();
    expect(nullResult.typeDetails).toBeDefined();

    // Test with undefined responses
    const undefinedResult = service.processResponses(undefined);
    expect(undefinedResult.profile).toBeDefined();
    expect(undefinedResult.typeDetails).toBeDefined();
  });

  test('should maintain consistent trait scoring', () => {
    const input1 = "I analyze data and solve problems systematically.";
    const input2 = "I solve problems by analyzing data systematically.";

    const result1 = analyzePersonality(input1);
    const result2 = analyzePersonality(input2);

    // Both inputs express the same core traits
    expect(result1.traits.thinkingStyle.name).toBe(result2.traits.thinkingStyle.name);
  });

  test('should handle questionnaire responses with missing options', () => {
    const service = egentetoInspectionService;
    const questions = service.getQuestions();

    // Create responses with some missing options
    const incompleteResponses = {};
    questions.slice(0, questions.length - 2).forEach((question, index) => {
      incompleteResponses[question.id] = question.options[0].id;
    });

    const validation = service.validateResponses(incompleteResponses);
    expect(validation.valid).toBe(false);
    expect(validation.missing.length).toBe(2);
  });
});