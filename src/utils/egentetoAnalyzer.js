/**
 * Egenteto Personality Type Analyzer
 * Implements the Teto-Egen personality framework analysis algorithm
 */

// Teto-Egen personality types based on the framework dimensions
const PERSONALITY_TYPES = {
  // Thinking Style (Teto): Analytical vs. Intuitive
  // Energy Direction (Egen): Internal vs. External
  // Decision Making: Logic vs. Values-driven
  // Interaction Pattern: Structured vs. Flexible
  // Response Mode: Proactive vs. Reactive

  'AA-L-S-P': 'The Analytical Strategist (TETO-EGEN)',
  'AA-L-S-R': 'The Methodical Planner (TETO-EGEN)',
  'AA-L-F-P': 'The Systematic Innovator (TETO-EGEN)',
  'AA-L-F-R': 'The Reflective Analyst (TETO-EGEN)',
  'AA-V-S-P': 'The Principled Organizer (TETO-EGEN)',
  'AA-V-S-R': 'The Ethical Guardian (TETO-EGEN)',
  'AA-V-F-P': 'The Value-Driven Creator (TETO-EGEN)',
  'AA-V-F-R': 'The Philosophical Thinker (TETO-EGEN)',
  'AI-L-S-P': 'The Visionary Leader (TETO-EGEN)',
  'AI-L-S-R': 'The Strategic Innovator (TETO-EGEN)',
  'AI-L-F-P': 'The Creative Problem Solver (TETO-EGEN)',
  'AI-L-F-R': 'The Intuitive Explorer (TETO-EGEN)',
  'AI-V-S-P': 'The Inspiring Mentor (TETO-EGEN)',
  'AI-V-S-R': 'The Empathetic Guide (TETO-EGEN)',
  'AI-V-F-P': 'The Passionate Visionary (TETO-EGEN)',
  'AI-V-F-R': 'The Contemplative Artist (TETO-EGEN)'
};

// Keywords and patterns for analysis
const ANALYSIS_PATTERNS = {
  analyticalThinking: {
    keywords: ['analyze', 'data', 'logic', 'system', 'process', 'structure', 'method', 'plan', 'organize', 'detail', 'research', 'study', 'examine', 'evaluate', 'assess', 'measure', 'calculate', 'solve', 'problem', 'strategy'],
    weight: 1.0
  },
  intuitiveThinking: {
    keywords: ['intuitive', 'creative', 'imagine', 'vision', 'insight', 'inspire', 'innovate', 'artistic', 'feel', 'sense', 'perceive', 'dream', 'visualize', 'concept', 'idea', 'inspiration', 'spontaneous', 'abstract'],
    weight: 1.0
  },
  internalEnergy: {
    keywords: ['reflect', 'private', 'alone', 'quiet', 'contemplate', 'think', 'consider', 'meditate', 'inward', 'introvert', 'solitude', 'personal', 'individual', 'independent', 'self', 'internal', 'thoughtful'],
    weight: 1.0
  },
  externalEnergy: {
    keywords: ['social', 'outgoing', 'team', 'group', 'people', 'communicate', 'express', 'share', 'collaborate', 'interact', 'extrovert', 'community', 'network', 'outreach', 'public', 'external', 'active'],
    weight: 1.0
  },
  logicDecision: {
    keywords: ['logical', 'rational', 'objective', 'fact', 'evidence', 'reason', 'practical', 'efficient', 'effective', 'results', 'outcome', 'benefit', 'advantage', 'pros', 'cons', 'analysis', 'data-driven'],
    weight: 1.0
  },
  valuesDecision: {
    keywords: ['values', 'ethical', 'moral', 'care', 'compassion', 'empathy', 'help', 'support', 'kind', 'fair', 'justice', 'believe', 'principle', 'meaning', 'purpose', 'heart', 'feelings', 'emotional'],
    weight: 1.0
  },
  structuredInteraction: {
    keywords: ['structured', 'organized', 'planned', 'scheduled', 'routine', 'order', 'systematic', 'methodical', 'consistent', 'reliable', 'predictable', 'controlled', 'disciplined', 'formal', 'procedure', 'protocol'],
    weight: 1.0
  },
  flexibleInteraction: {
    keywords: ['flexible', 'adaptive', 'spontaneous', 'creative', 'fluid', 'open', 'casual', 'relaxed', 'adaptable', 'versatile', 'dynamic', 'agile', 'change', 'adjust', 'modify', 'innovative', 'experimental'],
    weight: 1.0
  },
  proactiveResponse: {
    keywords: ['proactive', 'initiative', 'lead', 'start', 'begin', 'launch', 'drive', 'motivate', 'action', 'do', 'execute', 'implement', 'achieve', 'goal', 'target', 'ambition', 'forward', 'ahead'],
    weight: 1.0
  },
  reactiveResponse: {
    keywords: ['reactive', 'respond', 'wait', 'observe', 'watch', 'listen', 'careful', 'cautious', 'thoughtful', 'consider', 'reflect', 'pause', 'delay', 'patient', 'deliberate', 'measured', 'responsive'],
    weight: 1.0
  }
};

/**
 * Analyze text input and determine personality dimensions
 * @param {string} userInput - User's text input describing experiences or thoughts
 * @returns {Object} - Personality dimension scores
 */
export function analyzeUserInput(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return getDefaultScores();
  }

  const text = userInput.toLowerCase();
  const scores = {
    thinkingStyle: { analytical: 0, intuitive: 0 },
    energyDirection: { internal: 0, external: 0 },
    decisionMaking: { logic: 0, values: 0 },
    interactionPattern: { structured: 0, flexible: 0 },
    responseMode: { proactive: 0, reactive: 0 }
  };

  // Analyze each pattern category
  Object.keys(ANALYSIS_PATTERNS).forEach(category => {
    const pattern = ANALYSIS_PATTERNS[category];
    let count = 0;

    pattern.keywords.forEach(keyword => {
      // Count occurrences of each keyword (case insensitive)
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
      }
    });

    // Apply weight and map to appropriate dimension
    const weightedCount = count * pattern.weight;

    // Map to the correct dimension based on category name
    if (category.includes('analytical')) {
      scores.thinkingStyle.analytical = weightedCount;
    } else if (category.includes('intuitive')) {
      scores.thinkingStyle.intuitive = weightedCount;
    } else if (category.includes('internal')) {
      scores.energyDirection.internal = weightedCount;
    } else if (category.includes('external')) {
      scores.energyDirection.external = weightedCount;
    } else if (category.includes('logic')) {
      scores.decisionMaking.logic = weightedCount;
    } else if (category.includes('values')) {
      scores.decisionMaking.values = weightedCount;
    } else if (category.includes('structured')) {
      scores.interactionPattern.structured = weightedCount;
    } else if (category.includes('flexible')) {
      scores.interactionPattern.flexible = weightedCount;
    } else if (category.includes('proactive')) {
      scores.responseMode.proactive = weightedCount;
    } else if (category.includes('reactive')) {
      scores.responseMode.reactive = weightedCount;
    }
  });

  return scores;
}

/**
 * Determine personality type based on dimension scores
 * @param {Object} scores - Dimension scores from analyzeUserInput
 * @returns {Object} - Personality type and traits
 */
export function determinePersonalityType(scores) {
  // Determine each dimension
  const thinkingStyle = scores.thinkingStyle.analytical >= scores.thinkingStyle.intuitive ? 'AA' : 'AI';
  const energyDirection = scores.energyDirection.internal >= scores.energyDirection.external ? 'I' : 'E';
  const decisionMaking = scores.decisionMaking.logic >= scores.decisionMaking.values ? 'L' : 'V';
  const interactionPattern = scores.interactionPattern.structured >= scores.interactionPattern.flexible ? 'S' : 'F';
  const responseMode = scores.responseMode.proactive >= scores.responseMode.reactive ? 'P' : 'R';

  // Create type code
  const typeCode = `${thinkingStyle}-${decisionMaking}-${interactionPattern}-${responseMode}`;

  // Get personality type name
  const personalityType = PERSONALITY_TYPES[typeCode] || 'The Balanced Explorer (TETO-EGEN)';

  // Calculate trait percentages (0-100)
  const traits = {
    thinkingStyle: {
      name: scores.thinkingStyle.analytical >= scores.thinkingStyle.intuitive ? 'Analytical' : 'Intuitive',
      score: Math.round((Math.max(scores.thinkingStyle.analytical, scores.thinkingStyle.intuitive) /
                        (scores.thinkingStyle.analytical + scores.thinkingStyle.intuitive || 1)) * 100)
    },
    energyDirection: {
      name: scores.energyDirection.internal >= scores.energyDirection.external ? 'Internal' : 'External',
      score: Math.round((Math.max(scores.energyDirection.internal, scores.energyDirection.external) /
                        (scores.energyDirection.internal + scores.energyDirection.external || 1)) * 100)
    },
    decisionMaking: {
      name: scores.decisionMaking.logic >= scores.decisionMaking.values ? 'Logic-driven' : 'Values-driven',
      score: Math.round((Math.max(scores.decisionMaking.logic, scores.decisionMaking.values) /
                        (scores.decisionMaking.logic + scores.decisionMaking.values || 1)) * 100)
    },
    interactionPattern: {
      name: scores.interactionPattern.structured >= scores.interactionPattern.flexible ? 'Structured' : 'Flexible',
      score: Math.round((Math.max(scores.interactionPattern.structured, scores.interactionPattern.flexible) /
                        (scores.interactionPattern.structured + scores.interactionPattern.flexible || 1)) * 100)
    },
    responseMode: {
      name: scores.responseMode.proactive >= scores.responseMode.reactive ? 'Proactive' : 'Reactive',
      score: Math.round((Math.max(scores.responseMode.proactive, scores.responseMode.reactive) /
                        (scores.responseMode.proactive + scores.responseMode.reactive || 1)) * 100)
    }
  };

  return {
    typeCode,
    personalityType,
    traits
  };
}

/**
 * Generate compatibility insights based on personality type
 * @param {string} typeCode - The personality type code
 * @returns {Object} - Compatibility insights
 */
export function generateCompatibilityInsights(typeCode) {
  const insights = {
    careers: [],
    relationships: [],
    growth: []
  };

  // Career recommendations based on type
  if (typeCode.includes('AA')) {
    insights.careers = ['Data Scientist', 'Software Engineer', 'Research Analyst', 'Financial Consultant'];
  } else {
    insights.careers = ['Creative Director', 'Marketing Strategist', 'Product Designer', 'Innovation Consultant'];
  }

  if (typeCode.includes('L')) {
    insights.careers.push('Project Manager', 'Operations Director');
  } else {
    insights.careers.push('HR Specialist', 'Community Manager');
  }

  // Relationship compatibility
  if (typeCode.includes('I')) {
    insights.relationships = ['The Empathetic Connector (TETO-EGEN)', 'The Reflective Philosopher (TETO-EGEN)'];
  } else {
    insights.relationships = ['The Dynamic Executor (TETO-EGEN)', 'The Creative Innovator (TETO-EGEN)'];
  }

  // Growth opportunities
  if (typeCode.includes('AA')) {
    insights.growth = ['Emotional Intelligence', 'Creative Expression', 'Public Speaking'];
  } else {
    insights.growth = ['Analytical Thinking', 'Data Analysis', 'Strategic Planning'];
  }

  if (typeCode.includes('S')) {
    insights.growth.push('Adaptability', 'Creative Problem Solving');
  } else {
    insights.growth.push('Organization', 'Time Management');
  }

  return insights;
}

/**
 * Get default scores when no input is provided
 * @returns {Object} - Default dimension scores
 */
function getDefaultScores() {
  return {
    thinkingStyle: { analytical: 5, intuitive: 5 },
    energyDirection: { internal: 5, external: 5 },
    decisionMaking: { logic: 5, values: 5 },
    interactionPattern: { structured: 5, flexible: 5 },
    responseMode: { proactive: 5, reactive: 5 }
  };
}

/**
 * Main function to analyze user input and return complete personality profile
 * @param {string} userInput - User's text input
 * @returns {Object} - Complete personality profile
 */
export function analyzePersonality(userInput) {
  const scores = analyzeUserInput(userInput);
  const personality = determinePersonalityType(scores);
  const compatibility = generateCompatibilityInsights(personality.typeCode);

  return {
    personalityType: personality.personalityType,
    traits: personality.traits,
    compatibility: compatibility,
    timestamp: new Date().toISOString()
  };
}

export default {
  analyzeUserInput,
  determinePersonalityType,
  generateCompatibilityInsights,
  analyzePersonality
};