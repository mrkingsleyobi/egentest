# Teto-Egen API Specifications

## Executive Summary

This document defines the complete API specifications for the Teto-Egen Personality Test Web App, including RESTful endpoints, data models, authentication mechanisms, error handling, and integration patterns. The API follows modern best practices with OpenAPI 3.0 specification, ensuring scalability, security, and developer experience.

## API Overview

### Architecture Style
- **Primary**: RESTful API with JSON payload
- **Secondary**: GraphQL for complex queries and real-time updates
- **Versioning**: URI versioning (/api/v1/)
- **Protocol**: HTTPS only (TLS 1.3)

### Core Principles
1. **Consistency**: Standardized response formats and error handling
2. **Security**: JWT authentication, rate limiting, input validation
3. **Performance**: Caching, pagination, efficient data retrieval
4. **Documentation**: OpenAPI 3.0 compliant with interactive documentation
5. **Extensibility**: Modular design for future feature additions

## Authentication & Authorization

### Authentication Flow

#### JWT Token Authentication
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "user_123456",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### OAuth Integration
```http
GET /api/v1/auth/google
```

```http
GET /api/v1/auth/linkedin
```

### Token Management

#### Token Refresh
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

#### Token Revocation
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

### Authorization Headers
```http
Authorization: Bearer <jwt_token>
X-API-Key: <api_key_for_server_to_server>
```

## Rate Limiting & Throttling

### Rate Limit Policy
- **Anonymous Requests**: 100 requests/hour per IP
- **Authenticated Users**: 1000 requests/hour per user
- **Premium Users**: 5000 requests/hour per user
- **Enterprise Accounts**: Custom rate limits

### Rate Limit Response
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1625097600
Retry-After: 3600

{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again in 1 hour.",
    "retry_after": 3600
  }
}
```

## Data Models

### User Model
```json
{
  "id": "user_1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "role": "user",
  "status": "active",
  "email_verified": true,
  "created_at": "2025-11-06T12:00:00Z",
  "updated_at": "2025-11-06T12:00:00Z",
  "last_login": "2025-11-06T12:00:00Z",
  "preferences": {
    "newsletter": true,
    "marketing_emails": false,
    "language": "en"
  }
}
```

### Assessment Model
```json
{
  "id": "assess_1234567890",
  "user_id": "user_1234567890",
  "status": "completed",
  "started_at": "2025-11-06T10:00:00Z",
  "completed_at": "2025-11-06T10:12:00Z",
  "duration_seconds": 720,
  "version": "1.0",
  "questions_answered": 60,
  "total_questions": 60
}
```

### Personality Profile Model
```json
{
  "id": "profile_1234567890",
  "user_id": "user_1234567890",
  "assessment_id": "assess_1234567890",
  "personality_type": "TETO-EGEN",
  "type_name": "The Analytical Visionary",
  "dimensions": [
    {
      "name": "Thinking Style",
      "key": "thinking_style",
      "value": 85,
      "category": "Analytical"
    },
    {
      "name": "Energy Direction",
      "key": "energy_direction",
      "value": 72,
      "category": "Internal"
    },
    {
      "name": "Decision Making",
      "key": "decision_making",
      "value": 68,
      "category": "Logic"
    },
    {
      "name": "Interaction Pattern",
      "key": "interaction_pattern",
      "value": 45,
      "category": "Flexible"
    },
    {
      "name": "Response Mode",
      "key": "response_mode",
      "value": 78,
      "category": "Proactive"
    }
  ],
  "strengths": [
    "Strategic thinking",
    "Problem solving",
    "Attention to detail"
  ],
  "growth_areas": [
    "Emotional intelligence",
    "Delegation",
    "Risk taking"
  ],
  "created_at": "2025-11-06T10:12:00Z",
  "updated_at": "2025-11-06T10:12:00Z"
}
```

### Question Model
```json
{
  "id": "ques_1234567890",
  "text": "In group discussions, you tend to:",
  "category": "social_interaction",
  "order": 7,
  "type": "likert_scale",
  "options": [
    {
      "id": "opt_1234567890",
      "text": "Listen carefully to others",
      "value": 1
    },
    {
      "id": "opt_0987654321",
      "text": "Share ideas when asked",
      "value": 2
    },
    {
      "id": "opt_1122334455",
      "text": "Lead discussions and guide the group",
      "value": 3
    }
  ],
  "created_at": "2025-11-06T10:00:00Z"
}
```

### Answer Model
```json
{
  "id": "ans_1234567890",
  "user_id": "user_1234567890",
  "assessment_id": "assess_1234567890",
  "question_id": "ques_1234567890",
  "option_id": "opt_1122334455",
  "value": 3,
  "timestamp": "2025-11-06T10:02:30Z"
}
```

## API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "New User"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "user": {
    "id": "user_0987654321",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user",
    "status": "pending_verification"
  },
  "message": "Account created. Please verify your email."
}
```

#### POST /api/v1/auth/login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "user_1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### POST /api/v1/auth/refresh
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "new_access_token_here...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### User Management Endpoints

#### GET /api/v1/users/me
```http
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "id": "user_1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "role": "user",
    "status": "active",
    "email_verified": true,
    "created_at": "2025-11-06T12:00:00Z",
    "preferences": {
      "newsletter": true,
      "marketing_emails": false,
      "language": "en"
    }
  }
}
```

#### PUT /api/v1/users/me
```http
PUT /api/v1/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "newsletter": false,
    "marketing_emails": true
  }
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "id": "user_1234567890",
    "email": "user@example.com",
    "name": "John Smith",
    "avatar_url": "https://example.com/avatar.jpg",
    "role": "user",
    "status": "active",
    "email_verified": true,
    "created_at": "2025-11-06T12:00:00Z",
    "updated_at": "2025-11-06T13:00:00Z",
    "preferences": {
      "newsletter": false,
      "marketing_emails": true,
      "language": "en"
    }
  }
}
```

#### DELETE /api/v1/users/me
```http
DELETE /api/v1/users/me
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 204 No Content
```

### Assessment Endpoints

#### GET /api/v1/assessments
```http
GET /api/v1/assessments?status=completed&limit=10&page=1
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "assessments": [
    {
      "id": "assess_1234567890",
      "status": "completed",
      "started_at": "2025-11-06T10:00:00Z",
      "completed_at": "2025-11-06T10:12:00Z",
      "duration_seconds": 720,
      "version": "1.0"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### POST /api/v1/assessments
```http
POST /api/v1/assessments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "version": "1.0"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "assessment": {
    "id": "assess_0987654321",
    "user_id": "user_1234567890",
    "status": "in_progress",
    "started_at": "2025-11-06T14:00:00Z",
    "version": "1.0",
    "questions_answered": 0,
    "total_questions": 60
  }
}
```

#### GET /api/v1/assessments/{id}
```http
GET /api/v1/assessments/assess_1234567890
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "assessment": {
    "id": "assess_1234567890",
    "user_id": "user_1234567890",
    "status": "completed",
    "started_at": "2025-11-06T10:00:00Z",
    "completed_at": "2025-11-06T10:12:00Z",
    "duration_seconds": 720,
    "version": "1.0",
    "questions_answered": 60,
    "total_questions": 60
  }
}
```

#### DELETE /api/v1/assessments/{id}
```http
DELETE /api/v1/assessments/assess_1234567890
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 204 No Content
```

### Question Endpoints

#### GET /api/v1/questions
```http
GET /api/v1/questions?assessment_id=assess_1234567890&limit=5
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "questions": [
    {
      "id": "ques_1234567890",
      "text": "In group discussions, you tend to:",
      "category": "social_interaction",
      "order": 7,
      "type": "likert_scale",
      "options": [
        {
          "id": "opt_1234567890",
          "text": "Listen carefully to others",
          "value": 1
        },
        {
          "id": "opt_0987654321",
          "text": "Share ideas when asked",
          "value": 2
        },
        {
          "id": "opt_1122334455",
          "text": "Lead discussions and guide the group",
          "value": 3
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 60,
    "pages": 12
  }
}
```

#### GET /api/v1/questions/{id}
```http
GET /api/v1/questions/ques_1234567890
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "question": {
    "id": "ques_1234567890",
    "text": "In group discussions, you tend to:",
    "category": "social_interaction",
    "order": 7,
    "type": "likert_scale",
    "options": [
      {
        "id": "opt_1234567890",
        "text": "Listen carefully to others",
        "value": 1
      },
      {
        "id": "opt_0987654321",
        "text": "Share ideas when asked",
        "value": 2
      },
      {
        "id": "opt_1122334455",
        "text": "Lead discussions and guide the group",
        "value": 3
      }
    ],
    "created_at": "2025-11-06T10:00:00Z"
  }
}
```

### Answer Endpoints

#### POST /api/v1/answers
```http
POST /api/v1/answers
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "assessment_id": "assess_1234567890",
  "question_id": "ques_1234567890",
  "option_id": "opt_1122334455"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "answer": {
    "id": "ans_0987654321",
    "user_id": "user_1234567890",
    "assessment_id": "assess_1234567890",
    "question_id": "ques_1234567890",
    "option_id": "opt_1122334455",
    "value": 3,
    "timestamp": "2025-11-06T10:02:30Z"
  }
}
```

#### GET /api/v1/answers
```http
GET /api/v1/answers?assessment_id=assess_1234567890
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "answers": [
    {
      "id": "ans_1234567890",
      "user_id": "user_1234567890",
      "assessment_id": "assess_1234567890",
      "question_id": "ques_1234567890",
      "option_id": "opt_1122334455",
      "value": 3,
      "timestamp": "2025-11-06T10:02:30Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Profile Endpoints

#### GET /api/v1/profiles
```http
GET /api/v1/profiles?assessment_id=assess_1234567890
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "profiles": [
    {
      "id": "profile_1234567890",
      "user_id": "user_1234567890",
      "assessment_id": "assess_1234567890",
      "personality_type": "TETO-EGEN",
      "type_name": "The Analytical Visionary",
      "created_at": "2025-11-06T10:12:00Z"
    }
  ]
}
```

#### GET /api/v1/profiles/{id}
```http
GET /api/v1/profiles/profile_1234567890
Authorization: Bearer <access_token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "profile": {
    "id": "profile_1234567890",
    "user_id": "user_1234567890",
    "assessment_id": "assess_1234567890",
    "personality_type": "TETO-EGEN",
    "type_name": "The Analytical Visionary",
    "dimensions": [
      {
        "name": "Thinking Style",
        "key": "thinking_style",
        "value": 85,
        "category": "Analytical"
      },
      {
        "name": "Energy Direction",
        "key": "energy_direction",
        "value": 72,
        "category": "Internal"
      },
      {
        "name": "Decision Making",
        "key": "decision_making",
        "value": 68,
        "category": "Logic"
      },
      {
        "name": "Interaction Pattern",
        "key": "interaction_pattern",
        "value": 45,
        "category": "Flexible"
      },
      {
        "name": "Response Mode",
        "key": "response_mode",
        "value": 78,
        "category": "Proactive"
      }
    ],
    "strengths": [
      "Strategic thinking",
      "Problem solving",
      "Attention to detail"
    ],
    "growth_areas": [
      "Emotional intelligence",
      "Delegation",
      "Risk taking"
    ],
    "created_at": "2025-11-06T10:12:00Z",
    "updated_at": "2025-11-06T10:12:00Z"
  }
}
```

#### GET /api/v1/profiles/{id}/pdf
```http
GET /api/v1/profiles/profile_1234567890/pdf
Authorization: Bearer <access_token>
Accept: application/pdf
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="personality-profile-TETO-EGEN.pdf"

[Binary PDF content]
```

## GraphQL API

### Schema Overview
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  avatarUrl: String
  role: String!
  status: String!
  emailVerified: Boolean!
  createdAt: String!
  updatedAt: String!
  preferences: UserPreferences
  assessments: [Assessment!]!
  profiles: [Profile!]!
}

type Assessment {
  id: ID!
  userId: ID!
  status: String!
  startedAt: String!
  completedAt: String
  durationSeconds: Int
  version: String!
  questionsAnswered: Int!
  totalQuestions: Int!
  answers: [Answer!]!
  profile: Profile
}

type Profile {
  id: ID!
  userId: ID!
  assessmentId: ID!
  personalityType: String!
  typeName: String!
  dimensions: [Dimension!]!
  strengths: [String!]!
  growthAreas: [String!]!
  createdAt: String!
  updatedAt: String!
}

type Dimension {
  name: String!
  key: String!
  value: Int!
  category: String!
}

type Question {
  id: ID!
  text: String!
  category: String!
  order: Int!
  type: String!
  options: [QuestionOption!]!
}

type QuestionOption {
  id: ID!
  text: String!
  value: Int!
}

type Answer {
  id: ID!
  userId: ID!
  assessmentId: ID!
  questionId: ID!
  optionId: ID!
  value: Int!
  timestamp: String!
}

type Query {
  me: User
  user(id: ID!): User
  assessments(status: String, limit: Int, offset: Int): [Assessment!]!
  assessment(id: ID!): Assessment
  questions(assessmentId: ID!, limit: Int, offset: Int): [Question!]!
  question(id: ID!): Question
  answers(assessmentId: ID!): [Answer!]!
  profiles(assessmentId: ID!): [Profile!]!
  profile(id: ID!): Profile
}

type Mutation {
  createUser(input: CreateUserInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  logout: Boolean!
  updateUser(input: UpdateUserInput!): User!
  deleteUser: Boolean!
  startAssessment(version: String!): Assessment!
  submitAnswer(input: SubmitAnswerInput!): Answer!
  completeAssessment(id: ID!): Profile!
  deleteAssessment(id: ID!): Boolean!
}

input CreateUserInput {
  email: String!
  password: String!
  name: String!
}

input LoginInput {
  email: String!
  password: String!
}

input UpdateUserInput {
  name: String
  preferences: UserPreferencesInput
}

input SubmitAnswerInput {
  assessmentId: ID!
  questionId: ID!
  optionId: ID!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  expiresIn: Int!
  tokenType: String!
  user: User
}

type Subscription {
  assessmentProgress(assessmentId: ID!): AssessmentProgress!
}

type AssessmentProgress {
  assessmentId: ID!
  questionsAnswered: Int!
  totalQuestions: Int!
  percentage: Float!
}
```

### Example Queries

#### Get Current User with Assessments
```graphql
query GetCurrentUser {
  me {
    id
    email
    name
    assessments {
      id
      status
      startedAt
      completedAt
      profile {
        id
        personalityType
        typeName
        createdAt
      }
    }
  }
}
```

#### Get Assessment with Questions
```graphql
query GetAssessment($id: ID!) {
  assessment(id: $id) {
    id
    status
    startedAt
    completedAt
    questions(limit: 5) {
      id
      text
      category
      order
      options {
        id
        text
        value
      }
    }
    answers {
      questionId
      optionId
      value
    }
  }
}
```

#### Subscribe to Assessment Progress
```graphql
subscription AssessmentProgress($assessmentId: ID!) {
  assessmentProgress(assessmentId: $assessmentId) {
    assessmentId
    questionsAnswered
    totalQuestions
    percentage
  }
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "code": "invalid_email",
        "message": "Email address is not valid"
      }
    ]
  }
}
```

### Common Error Codes
| HTTP Code | Error Code | Description |
|-----------|------------|-------------|
| 400 | validation_error | Invalid input data |
| 401 | unauthorized | Missing or invalid authentication |
| 403 | forbidden | Insufficient permissions |
| 404 | not_found | Resource not found |
| 409 | conflict | Resource conflict |
| 422 | unprocessable_entity | Valid request but cannot be processed |
| 429 | rate_limit_exceeded | Too many requests |
| 500 | internal_error | Server error |
| 503 | service_unavailable | Service temporarily unavailable |

## Pagination

### Cursor-based Pagination
```http
GET /api/v1/assessments?limit=10&cursor=eyJpZCI6ImFzc2Vzc18xMjM0NTY3ODkwIn0
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "assessments": [...],
  "pagination": {
    "has_next": true,
    "has_previous": false,
    "next_cursor": "eyJpZCI6ImFzc2Vzc18wOTg3NjU0MzIxIn0",
    "previous_cursor": null
  }
}
```

### Offset-based Pagination
```http
GET /api/v1/assessments?limit=10&page=2
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "assessments": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

## Caching Strategy

### Cache Headers
```http
Cache-Control: public, max-age=300
ETag: "W/\"1234567890\""
Last-Modified: Wed, 06 Nov 2025 12:00:00 GMT
```

### Cache Invalidation
- **User Data**: Cache invalidated on update
- **Assessment Data**: Immutable once completed
- **Profile Data**: Cache invalidated on regeneration
- **Static Content**: 1-year cache with content hashing

## Webhooks

### Webhook Events
- `assessment.completed` - Assessment finished and profile generated
- `user.registered` - New user registration
- `user.deleted` - User account deletion
- `profile.updated` - Personality profile regeneration

### Webhook Payload Example
```json
{
  "id": "wh_1234567890",
  "event": "assessment.completed",
  "created_at": "2025-11-06T10:12:00Z",
  "data": {
    "assessment_id": "assess_1234567890",
    "user_id": "user_1234567890",
    "profile_id": "profile_1234567890"
  },
  "webhook_url": "https://example.com/webhooks/tetoegen"
}
```

## API Versioning

### Versioning Strategy
- **URI Versioning**: `/api/v1/`, `/api/v2/`
- **Backward Compatibility**: Maintain v1 for 12 months after v2 release
- **Deprecation Policy**: 6-month notice before removal

### Version Header
```http
Accept: application/vnd.tetoegen.v1+json
```

## SDKs & Client Libraries

### Official SDKs
- **JavaScript/TypeScript**: @tetoegen/sdk
- **Python**: tetoegen-sdk
- **Java**: com.tetoegen:sdk
- **iOS**: TetoEgenSDK
- **Android**: com.tetoegen.sdk

### SDK Features
- Automatic token refresh
- Request/response logging
- Error handling
- Pagination helpers
- Retry logic
- TypeScript definitions

## Monitoring & Analytics

### API Metrics
- **Request Volume**: Requests per second
- **Response Time**: P50, P95, P99 latency
- **Error Rates**: HTTP error distribution
- **Throughput**: Data transfer volume
- **Uptime**: Service availability percentage

### Health Checks
```http
GET /api/v1/health
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-06T12:00:00Z",
  "dependencies": {
    "database": "healthy",
    "cache": "healthy",
    "auth_service": "healthy"
  }
}
```

## Security Headers

### Response Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Testing & Documentation

### API Documentation
- **Interactive Docs**: Swagger UI at `/api/docs`
- **OpenAPI Spec**: JSON/YAML at `/api/openapi.json`
- **Postman Collection**: Importable collection for testing

### Testing Endpoints
- **Sandbox Environment**: `https://api.sandbox.tetoegen.com`
- **Test Accounts**: Pre-populated test data
- **Mock Data**: Consistent test scenarios

---

**Document Version**: 1.0
**Created**: November 6, 2025
**API Version**: v1
**Contact**: api-support@tetoegen.com
**Documentation**: https://docs.tetoegen.com/api