import { analyzePersonality } from './src/utils/egentetoAnalyzer.js';

console.log('Testing Text-Based Egenteto Inspector...\n');

// Test case 1: Analytical thinker
const testInput1 = "I love analyzing data and solving complex problems. I prefer working independently and value logical decision-making. I'm very organized and like to plan things in advance. When faced with challenges, I like to take initiative and lead the solution process.";

console.log('Test 1: Analytical thinker input');
console.log('Input:', testInput1);
const result1 = analyzePersonality(testInput1);
console.log('Personality Type:', result1.personalityType);
console.log('Traits:', result1.traits);
console.log('Career Recommendations:', result1.compatibility.careers.slice(0, 3));
console.log('\n');

// Test case 2: Intuitive thinker
const testInput2 = "I'm very creative and enjoy exploring new ideas. I prefer working with people and value emotional connections. I'm flexible and adapt well to changing situations. I like to inspire others and help them grow.";

console.log('Test 2: Intuitive thinker input');
console.log('Input:', testInput2);
const result2 = analyzePersonality(testInput2);
console.log('Personality Type:', result2.personalityType);
console.log('Traits:', result2.traits);
console.log('Career Recommendations:', result2.compatibility.careers.slice(0, 3));
console.log('\n');

// Test case 3: Balanced input
const testInput3 = "I enjoy both logical analysis and creative thinking. I work well both independently and in teams. I value both facts and feelings when making decisions. I can be structured when needed but also flexible.";

console.log('Test 3: Balanced input');
console.log('Input:', testInput3);
const result3 = analyzePersonality(testInput3);
console.log('Personality Type:', result3.personalityType);
console.log('Traits:', result3.traits);
console.log('Career Recommendations:', result3.compatibility.careers.slice(0, 3));
console.log('\n');

console.log('✅ Text-based Egenteto inspection testing completed!');