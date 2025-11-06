// Simple test script to verify Egenteto inspection service functionality

import egentetoInspectionService from './src/services/egentetoInspectionService.js';

console.log('Testing Egenteto Inspection Service...\n');

// Test 1: Get questions
console.log('1. Testing getQuestions()...');
const questions = egentetoInspectionService.getQuestions();
console.log(`   Found ${questions.length} questions`);
console.log(`   First question: ${questions[0].text}\n`);

// Test 2: Validate responses
console.log('2. Testing validateResponses()...');
const mockResponses = {};
questions.forEach(question => {
  mockResponses[question.id] = question.options[0].id;
});

const validation = egentetoInspectionService.validateResponses(mockResponses);
console.log(`   Validation result: ${validation.valid ? 'PASS' : 'FAIL'}`);
console.log(`   Message: ${validation.message}\n`);

// Test 3: Process responses
console.log('3. Testing processResponses()...');
if (validation.valid) {
  const results = egentetoInspectionService.processResponses(mockResponses);
  console.log(`   Personality Type: ${results.typeDetails.name}`);
  console.log(`   Confidence Level: ${results.confidence}%`);
  console.log(`   Type Code: ${results.typeCode}`);
  console.log('   Profile Dimensions:');
  Object.keys(results.profile).forEach(dim => {
    console.log(`     ${dim}: ${results.profile[dim].dominant}`);
  });
  console.log('\n   Strengths:');
  results.typeDetails.strengths.forEach(strength => {
    console.log(`     - ${strength}`);
  });
  console.log('\n   Growth Areas:');
  results.typeDetails.growthAreas.forEach(area => {
    console.log(`     - ${area}`);
  });
} else {
  console.log('   Skipping processResponses test due to validation failure');
}

console.log('\n🎉 All tests completed!');