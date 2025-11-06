# Teto-Egen UI/UX Specifications & Design System

## Executive Summary

This document outlines the complete UI/UX specifications for the Teto-Egen Personality Test Web App, including design principles, wireframes, component library, interaction patterns, and accessibility requirements. The design prioritizes scientific credibility, user engagement, and accessibility while maintaining a modern, intuitive interface.

## Design Philosophy

### Core Principles
1. **Clarity First**: Complex personality concepts presented clearly and simply
2. **Engaging Experience**: Interactive elements that maintain user interest
3. **Scientific Authority**: Visual design that communicates credibility
4. **Accessibility**: WCAG 2.1 AA compliance as baseline
5. **Responsive Excellence**: Seamless experience across all devices

### Design Goals
- **75%+ Test Completion Rate**: Through engaging, frictionless experience
- **90%+ User Satisfaction**: Via intuitive navigation and clear results
- **50%+ Mobile Usage**: Mobile-first design approach
- **2-Second Load Times**: Performance-optimized interface

## Visual Design System

### Color Palette

#### Primary Colors
- **Primary Blue**: #2563EB (Trust, intelligence, calm)
- **Primary Dark**: #1E40AF (Authority, depth)
- **Primary Light**: #DBEAFE (Approachability, space)

#### Secondary Colors
- **Accent Purple**: #7C3AED (Creativity, insight)
- **Success Green**: #059669 (Growth, positive outcomes)
- **Warning Amber**: #D97706 (Attention, progression)
- **Error Red**: #DC2626 (Urgency, corrections)

#### Neutral Palette
- **Gray 900**: #111827 (Primary text)
- **Gray 700**: #374151 (Secondary text)
- **Gray 500**: #6B7280 (Supporting text)
- **Gray 300**: #D1D5DB (Borders, dividers)
- **Gray 100**: #F3F4F6 (Backgrounds)
- **White**: #FFFFFF (Card backgrounds, highlights)

### Typography

#### Font Stack
```css
font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Type Scale
- **Display 1**: 48px / 56px (Hero sections, main headlines)
- **Display 2**: 36px / 44px (Page titles, major sections)
- **Headline 1**: 28px / 36px (Section headers)
- **Headline 2**: 24px / 32px (Card titles, questions)
- **Headline 3**: 20px / 28px (Sub-sections)
- **Body Large**: 18px / 28px (Important content)
- **Body**: 16px / 24px (Main content)
- **Body Small**: 14px / 20px (Supporting text)
- **Caption**: 12px / 16px (Labels, metadata)

#### Font Weights
- **Light**: 300 (Large display text)
- **Regular**: 400 (Body content)
- **Medium**: 500 (Emphasis, subheadings)
- **Semibold**: 600 (Headings, important text)
- **Bold**: 700 (Strong emphasis)

### Spacing System

#### Base Unit: 4px
- **Micro**: 4px (Icon spacing, fine details)
- **Tiny**: 8px (Between related elements)
- **Small**: 16px (Component spacing)
- **Medium**: 24px (Section spacing)
- **Large**: 32px (Major sections)
- **XL**: 48px (Page sections)
- **XXL**: 64px (Hero sections)

### Iconography

#### Icon Library
- **Primary**: Feather Icons (consistent, modern)
- **Secondary**: Custom personality type icons
- **Sizing**: 16px, 20px, 24px, 32px, 48px
- **Style**: Outline style for consistency, filled for emphasis

## Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #2563EB;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1E40AF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: white;
  color: #2563EB;
  border: 2px solid #2563EB;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 500;
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
}
```

### Form Elements

#### Input Fields
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

#### Radio Buttons (Likert Scale)
```css
.radio-group {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.radio-option {
  flex: 1;
  text-align: center;
  padding: 16px 8px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: #2563EB;
  background: #F3F4F6;
}

.radio-option.selected {
  border-color: #2563EB;
  background: #DBEAFE;
  color: #1E40AF;
}
```

### Cards

#### Result Card
```css
.result-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.result-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Progress Indicators

#### Step Progress
```css
.progress-bar {
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563EB, #7C3AED);
  border-radius: 2px;
  transition: width 0.5s ease;
}
```

## Page Layouts & Wireframes

### 1. Landing Page

#### Hero Section
```
┌─────────────────────────────────────────┐
│ [Logo]     [Nav] [Login] [Sign Up]      │
├─────────────────────────────────────────┤
│                                         │
│    Discover Your True Personality       │
│    Scientific insights for modern life  │
│                                         │
│    [Start Free Assessment]              │
│                                         │
│    ✓ 12-minute assessment               │
│    ✓ Scientifically validated           │
│    ✓ Personalized results              │
│                                         │
└─────────────────────────────────────────┘
```

#### Features Section
```
┌─────────────────────────────────────────┐
│  Why Choose Teto-Egen?                  │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Science │ │ Growth  │ │ Privacy │    │
│  │ Backed  │ │ Focused │ │ First   │    │
│  │ Results │ │ Insights │ │ Control │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Assessment Flow

#### Introduction Screen
```
┌─────────────────────────────────────────┐
│  Step 1 of 12: Getting Started          │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░        │
│                                         │
│  Welcome to the Teto-Egen Assessment   │
│                                         │
│  This 12-minute journey will reveal:    │
│  • Your personality type               │
│  • Your core strengths                 │
│  • Growth opportunities                │
│  • Career compatibility                │
│                                         │
│  [Begin Assessment]                     │
│                                         │
│  ⏱️ 12 minutes | 📱 Works on all devices│
└─────────────────────────────────────────┘
```

#### Question Screen
```
┌─────────────────────────────────────────┐
│  Question 7 of 60                       │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░        │
│                                         │
│  In group discussions, you tend to:     │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Listen  │ │ Share   │ │ Lead    │    │
│  │ carefully│  │ ideas   │  │ discussions│
│  │ to others│  │ when asked│ │ and guide │
│  └─────────┘ └─────────┘ └─────────┘    │
│                                         │
│  [Previous] [Save Progress] [Next]      │
│                                         │
│  💡 Tip: There are no right answers!    │
└─────────────────────────────────────────┘
```

### 3. Results Page

#### Main Results Dashboard
```
┌─────────────────────────────────────────┐
│  Your Personality Type                  │
│                                         │
│     ┌─────────────────────────────┐     │
│     │        TETO-EGEN            │     │
│     │     The Analytical Visionary│     │
│     │        📊 🎯 🔮             │     │
│     └─────────────────────────────┘     │
│                                         │
│  ┌─────────────┐ ┌─────────────┐        │
│  │ Thinking    │ │ Energy      │        │
│  │ Analytical  │ │ Internal    │        │
│  │ 85%         │ │ 72%         │        │
│  └─────────────┘ └─────────────┘        │
│                                         │
│  [View Detailed Report] [Share Results] │
│                                         │
└─────────────────────────────────────────┘
```

#### Detailed Breakdown
```
┌─────────────────────────────────────────┐
│  Personality Deep Dive                   │
│                                         │
│  🧠 Thinking Style: Analytical           │
│  ┌─────────────────────────────────────┐│
│  │ You approach problems logically and ││
│  │ systematically. You excel at       ││
│  │ breaking down complex issues into   ││
│  │ manageable components.             ││
│  └─────────────────────────────────────┘│
│                                         │
│  💪 Strengths:                         │
│  ✓ Problem-solving                     │
│  ✓ Critical analysis                   │
│  ✓ Strategic planning                  │
│                                         │
│  🎯 Growth Areas:                      │
│  • Emotional intelligence              │
│  • Spontaneous creativity              │
│                                         │
│  [Development Plan] [Career Matches]    │
└─────────────────────────────────────────┘
```

### 4. User Dashboard

#### Personal Dashboard
```
┌─────────────────────────────────────────┐
│  Welcome back, Sarah!                   │
│                                         │
│  ┌─────────────┐ ┌─────────────┐        │
│  │ Your Type   │ │ Recent      │        │
│  │ TETO-EGEN   │ │ Progress    │        │
│  │             │ │ 🔥 5 day    │        │
│  │ streak      │ │             │        │
│  └─────────────┘ └─────────────┘        │
│                                         │
│  Quick Actions:                         │
│  [Retake Test] [Compare Types] [Growth Plan]│
│                                         │
│  Recommended for You:                   │
│  📚 "Understanding Your Analytical Mind"│
│  💼 "Top Careers for Visionary Types"   │
│  🤝 "Relationship Guide for Thinkers"   │
│                                         │
└─────────────────────────────────────────┘
```

## Interaction Patterns

### Micro-interactions

#### Button Hover States
- **Scale**: Subtle 1.02x scale
- **Shadow**: Add 0-4px shadow
- **Duration**: 200ms ease-out

#### Card Hover Effects
- **Lift**: 2px translate Y
- **Shadow**: Increase to 0-8px
- **Border**: Subtle color change

#### Form Field Focus
- **Border Color**: Primary blue
- **Shadow**: 0-0-0-3px rgba(37, 99, 235, 0.1)
- **Label**: Scale up slightly

### Loading States

#### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Progress Animation
- **Circular Progress**: Smooth SVG animation
- **Bar Progress**: Gradient fill with smooth transition
- **Step Indicators**: Sequential fade-in

### Error Handling

#### Inline Validation
```css
.input-error {
  border-color: #DC2626;
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

#### Toast Notifications
- **Success**: Green background, checkmark icon
- **Error**: Red background, warning icon
- **Info**: Blue background, info icon
- **Duration**: 5 seconds auto-dismiss

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

### Mobile Adaptations

#### Navigation
- **Hamburger Menu**: Collapsible navigation
- **Bottom Tab Bar**: Primary actions thumb-friendly
- **Swipe Gestures**: For question progression

#### Question Interface
- **Large Touch Targets**: Minimum 44px
- **Single Column Layout**: Stacked options
- **Thumb Zone**: Primary actions in easy reach

#### Results Display
- **Vertical Cards**: Scrollable content
- **Collapsible Sections**: Progressive disclosure
- **Share Integration**: Native sharing capabilities

### Tablet Optimizations

#### Layout Adjustments
- **Two-Column Layout**: Better use of screen space
- **Hover States**: Re-enable for precision pointing
- **Keyboard Navigation**: Enhanced accessibility

## Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal Text**: 4.5:1 minimum contrast
- **Large Text**: 3:1 minimum contrast
- **Interactive Elements**: 3:1 minimum contrast

#### Keyboard Navigation
- **Tab Order**: Logical, predictable flow
- **Focus Indicators**: Visible 2px outline
- **Skip Links**: Jump to main content
- **ARIA Labels**: Screen reader friendly

#### Screen Reader Support
```html
<!-- Example accessible question structure -->
<div role="radiogroup" aria-labelledby="question-label">
  <h2 id="question-label">In group discussions, you tend to:</h2>
  <div class="radio-option">
    <input type="radio" id="option1" name="question7" aria-describedby="option1-desc">
    <label for="option1">Listen carefully to others</label>
    <span id="option1-desc" class="sr-only">Option for listening behavior</span>
  </div>
</div>
```

### Motion & Animation
- **Reduced Motion**: Respect `prefers-reduced-motion`
- **No Flashing**: Avoid seizure-triggering animations
- **Auto-play Control**: Users can pause animations

### Cognitive Load
- **Clear Progress**: Always show current position
- **Time Estimates**: Manage user expectations
- **Break Options**: Allow saving progress
- **Simple Language**: Avoid psychological jargon

## Performance Requirements

### Loading Performance
- **First Contentful Paint**: <1.5 seconds
- **Largest Contentful Paint**: <2.5 seconds
- **Time to Interactive**: <3.0 seconds
- **Cumulative Layout Shift**: <0.1

### Asset Optimization
- **Images**: WebP format, responsive loading
- **Fonts**: Subset, preload critical fonts
- **JavaScript**: Code splitting, lazy loading
- **CSS**: Critical CSS inline, non-critical deferred

### Caching Strategy
- **Static Assets**: 1-year cache with content hashing
- **API Responses**: 5-minute cache for user data
- **HTML Pages**: 1-hour cache with validation

## Testing Strategy

### Usability Testing
- **Task Completion**: Complete assessment flow
- **Time on Task**: <15 minutes for assessment
- **Error Rate**: <5% user errors
- **Satisfaction**: 90%+ positive feedback

### A/B Testing Framework
- **Conversion Metrics**: Test completion rates
- **Design Variations**: Button colors, layouts
- **Copy Testing**: Question wording, CTAs
- **Feature Rollout**: Gradual feature introduction

### Device Testing Matrix
- **Mobile**: iOS (latest 2 versions), Android (latest 2 versions)
- **Tablet**: iPad, Android tablets
- **Desktop**: Chrome, Firefox, Safari, Edge (latest versions)
- **Screen Readers**: VoiceOver, NVDA, JAWS

## Design Tools & Workflow

### Design Tools
- **UI Design**: Figma (primary design tool)
- **Prototyping**: Figma + Principle for interactions
- **Design System**: Figma components + Storybook
- **Handoff**: Figma Dev Mode + Zeplin

### Version Control
- **Design Files**: Figma version history
- **Component Library**: Storybook with Git
- **Asset Management**: Figma + CDN for production

### Collaboration Process
1. **Design Sprint**: Weekly design iterations
2. **Design Review**: Bi-weekly stakeholder reviews
3. **Dev Handoff**: Detailed specification documents
4. **QA Testing**: Design validation before release

---

**Document Version**: 1.0
**Created**: November 6, 2025
**Next Review**: December 6, 2025
**Design Lead**: [Lead Designer Name]
**UX Lead**: [UX Lead Name]