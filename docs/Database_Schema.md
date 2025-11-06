# Teto-Egen Database Schema Design

## Executive Summary

This document outlines the comprehensive database schema for the Teto-Egen Personality Test Web App, designed to efficiently store and retrieve user data, assessment results, personality profiles, and analytics. The schema follows best practices for normalization, scalability, and security while supporting both relational and document-based data storage.

## Database Architecture Overview

### Technology Stack
- **Primary Database**: PostgreSQL 15 (Relational data)
- **Secondary Database**: MongoDB 6.0 (Flexible document storage)
- **Cache Layer**: Redis 7.0 (Session, caching, real-time data)
- **Search Engine**: Elasticsearch 8.0 (Analytics, search capabilities)
- **Message Queue**: Apache Kafka (Event streaming, async processing)

### Database Design Principles
1. **Normalization**: 3NF compliance for relational tables
2. **Scalability**: Horizontal partitioning for high-volume tables
3. **Security**: Encryption at rest, row-level security
4. **Performance**: Strategic indexing, query optimization
5. **Flexibility**: Document stores for variable schema data
6. **Audit Trail**: Comprehensive change logging

## PostgreSQL Schema (Relational Data)

### Core Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Constraints
ALTER TABLE users ADD CONSTRAINT chk_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT chk_role_values
    CHECK (role IN ('user', 'premium', 'admin', 'super_admin'));
```

#### user_sessions
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);
```

#### assessments
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'draft',
    version VARCHAR(20) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    questions_answered INTEGER DEFAULT 0,
    total_questions INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);
```

#### questions
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    order_index INTEGER,
    question_type VARCHAR(50) DEFAULT 'likert_scale',
    options JSONB,
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_version ON questions(version);
CREATE INDEX idx_questions_active ON questions(is_active);
```

#### answers
```sql
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_id UUID,
    value INTEGER,
    text_response TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_answers_assessment_id ON answers(assessment_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_created_at ON answers(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_answers_assessment_question ON answers(assessment_id, question_id);
```

#### profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    personality_type VARCHAR(20) NOT NULL,
    type_name VARCHAR(255) NOT NULL,
    dimensions JSONB NOT NULL,
    strengths TEXT[],
    growth_areas TEXT[],
    career_matches JSONB,
    relationship_insights JSONB,
    development_plan JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_assessment_id ON profiles(assessment_id);
CREATE INDEX idx_profiles_personality_type ON profiles(personality_type);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_profiles_dimensions_gin ON profiles USING GIN(dimensions);
```

#### user_preferences
```sql
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    communication JSONB,
    privacy JSONB,
    notifications JSONB,
    content_preferences JSONB,
    assessment_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_preferences_user_id ON user_preferences(user_id);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
```

#### organizations
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    size_range VARCHAR(50),
    industry VARCHAR(100),
    billing_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_industry ON organizations(industry);
```

#### organization_members
```sql
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(50) DEFAULT 'active',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
CREATE UNIQUE INDEX idx_org_members_unique ON organization_members(organization_id, user_id);
```

### Analytics Tables

#### user_activities
```sql
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_activities_type ON user_activities(activity_type);
CREATE INDEX idx_activities_created_at ON user_activities(created_at);
CREATE INDEX idx_activities_session_id ON user_activities(session_id);
```

#### assessment_analytics
```sql
CREATE TABLE assessment_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    completion_rate DECIMAL(5,2),
    average_time_per_question DECIMAL(10,2),
    question_difficulty JSONB,
    user_feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_analytics_assessment_id ON assessment_analytics(assessment_id);
CREATE INDEX idx_analytics_created_at ON assessment_analytics(created_at);
```

#### system_metrics
```sql
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    dimension JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX idx_metrics_dimension_gin ON system_metrics USING GIN(dimension);
```

## MongoDB Schema (Document Storage)

### User Generated Content Collections

#### user_feedback
```javascript
// Collection: user_feedback
{
  _id: ObjectId,
  user_id: UUID,
  assessment_id: UUID,
  feedback_type: String, // "results_accuracy", "ux_experience", "feature_request"
  rating: Number, // 1-5
  comments: String,
  metadata: {
    browser: String,
    device: String,
    page: String
  },
  created_at: Date,
  updated_at: Date
}

// Indexes
db.user_feedback.createIndex({ "user_id": 1 })
db.user_feedback.createIndex({ "assessment_id": 1 })
db.user_feedback.createIndex({ "feedback_type": 1 })
db.user_feedback.createIndex({ "created_at": 1 })
```

#### community_posts
```javascript
// Collection: community_posts
{
  _id: ObjectId,
  user_id: UUID,
  personality_type: String,
  title: String,
  content: String,
  tags: [String],
  likes: Number,
  comments: [{
    user_id: UUID,
    content: String,
    created_at: Date
  }],
  is_pinned: Boolean,
  metadata: {
    views: Number,
    shares: Number
  },
  created_at: Date,
  updated_at: Date
}

// Indexes
db.community_posts.createIndex({ "user_id": 1 })
db.community_posts.createIndex({ "personality_type": 1 })
db.community_posts.createIndex({ "tags": 1 })
db.community_posts.createIndex({ "created_at": -1 })
db.community_posts.createIndex({ "content": "text", "title": "text" })
```

#### personality_insights
```javascript
// Collection: personality_insights
{
  _id: ObjectId,
  personality_type: String,
  category: String, // "career", "relationships", "growth"
  title: String,
  content: String,
  author: String,
  metadata: {
    popularity_score: Number,
    reading_time: Number,
    related_types: [String]
  },
  created_at: Date,
  updated_at: Date
}

// Indexes
db.personality_insights.createIndex({ "personality_type": 1 })
db.personality_insights.createIndex({ "category": 1 })
db.personality_insights.createIndex({ "metadata.popularity_score": -1 })
db.personality_insights.createIndex({ "content": "text", "title": "text" })
```

### Analytics Collections

#### behavioral_patterns
```javascript
// Collection: behavioral_patterns
{
  _id: ObjectId,
  user_id: UUID,
  assessment_id: UUID,
  pattern_type: String, // "response_time", "inconsistency", "engagement"
  pattern_data: {
    // Flexible schema for different pattern types
    timestamps: [Date],
    values: [Number],
    anomalies: [{
      timestamp: Date,
      value: Number,
      confidence: Number
    }]
  },
  confidence_score: Number,
  created_at: Date
}

// Indexes
db.behavioral_patterns.createIndex({ "user_id": 1 })
db.behavioral_patterns.createIndex({ "assessment_id": 1 })
db.behavioral_patterns.createIndex({ "pattern_type": 1 })
db.behavioral_patterns.createIndex({ "created_at": 1 })
```

#### cohort_analytics
```javascript
// Collection: cohort_analytics
{
  _id: ObjectId,
  cohort_type: String, // "personality_type", "age_group", "industry"
  cohort_value: String,
  period: {
    start: Date,
    end: Date
  },
  metrics: {
    user_count: Number,
    completion_rate: Number,
    engagement_score: Number,
    retention_rate: Number,
    upgrade_rate: Number
  },
  demographic_breakdown: {
    age_groups: [{
      range: String,
      percentage: Number
    }],
    locations: [{
      country: String,
      percentage: Number
    }],
    occupations: [{
      type: String,
      percentage: Number
    }]
  },
  created_at: Date
}

// Indexes
db.cohort_analytics.createIndex({ "cohort_type": 1, "cohort_value": 1 })
db.cohort_analytics.createIndex({ "period.start": 1 })
```

## Redis Schema (Cache & Session Storage)

### Session Storage
```
# User session
SESSION:{session_id} -> {
  user_id: UUID,
  expires_at: timestamp,
  ip_address: string,
  user_agent: string
}

# Session index by user
USER_SESSIONS:{user_id} -> [session_id1, session_id2, ...]
```

### Cache Layers
```
# Frequently accessed questions
QUESTION:{question_id} -> serialized question object

# User profile cache
PROFILE:{user_id}:{assessment_id} -> serialized profile object

# Assessment progress
ASSESSMENT_PROGRESS:{assessment_id} -> {
  questions_answered: number,
  current_question: question_id
}

# Popular content cache
POPULAR_INSIGHTS:{personality_type} -> [insight_ids]
```

### Rate Limiting
```
# API rate limiting
RATE_LIMIT:{user_id}:{endpoint}:{time_window} -> {
  count: number,
  reset_time: timestamp
}

# IP-based rate limiting
RATE_LIMIT_IP:{ip_address}:{endpoint}:{time_window} -> {
  count: number,
  reset_time: timestamp
}
```

## Elasticsearch Schema (Search & Analytics)

### Index Mappings

#### user_search
```json
{
  "mappings": {
    "properties": {
      "user_id": { "type": "keyword" },
      "name": { "type": "text" },
      "email": { "type": "keyword" },
      "personality_type": { "type": "keyword" },
      "created_at": { "type": "date" },
      "last_active": { "type": "date" },
      "subscription_status": { "type": "keyword" },
      "organization_id": { "type": "keyword" }
    }
  }
}
```

#### content_search
```json
{
  "mappings": {
    "properties": {
      "content_id": { "type": "keyword" },
      "title": { "type": "text" },
      "content": { "type": "text" },
      "tags": { "type": "keyword" },
      "personality_types": { "type": "keyword" },
      "category": { "type": "keyword" },
      "author": { "type": "text" },
      "popularity_score": { "type": "float" },
      "created_at": { "type": "date" }
    }
  }
}
```

#### analytics_events
```json
{
  "mappings": {
    "properties": {
      "event_id": { "type": "keyword" },
      "event_type": { "type": "keyword" },
      "user_id": { "type": "keyword" },
      "session_id": { "type": "keyword" },
      "timestamp": { "type": "date" },
      "properties": { "type": "object" },
      "location": { "type": "geo_point" },
      "device": {
        "properties": {
          "type": { "type": "keyword" },
          "os": { "type": "keyword" },
          "browser": { "type": "keyword" }
        }
      }
    }
  }
}
```

## Data Relationships Diagram

```
users
├── user_sessions (1:M)
├── assessments (1:M)
├── profiles (1:M)
├── answers (1:M)
├── subscriptions (1:M)
├── user_preferences (1:1)
├── organization_members (1:M)
└── user_activities (1:M)

assessments
├── answers (1:M)
├── profiles (1:1)
└── assessment_analytics (1:1)

questions
└── answers (1:M)

organizations
└── organization_members (1:M)

profiles
└── (referenced by MongoDB collections)
```

## Security Considerations

### Data Encryption
- **At Rest**: AES-256 encryption for all database storage
- **In Transit**: TLS 1.3 for all database connections
- **Field Level**: PII encryption in database fields

### Access Control
- **Row Level Security**: PostgreSQL RLS for user data isolation
- **Role Based Access**: Database roles for different service accounts
- **Audit Logging**: All data access logged for compliance

### Privacy Compliance
- **GDPR**: Data deletion and portability support
- **CCPA**: User right to know and delete
- **PII Handling**: Minimal data collection, pseudonymization

## Performance Optimization

### Indexing Strategy
- **Primary Keys**: B-tree indexes on all primary keys
- **Foreign Keys**: Indexes on all foreign key references
- **Query Patterns**: Composite indexes for common query combinations
- **JSON Fields**: GIN indexes for JSONB search operations

### Partitioning
- **Time-based**: User_activities partitioned by month
- **User-based**: Large tables partitioned by user_id ranges
- **Archival**: Old data moved to read-optimized storage

### Caching Strategy
- **Read Through**: Redis cache for frequently accessed data
- **Write Behind**: Asynchronous updates to cache layer
- **Invalidation**: Cache expiry and explicit invalidation

## Backup & Recovery

### Backup Strategy
- **Full Backups**: Daily encrypted backups
- **Incremental**: Hourly transaction log backups
- **Point-in-Time**: Recovery to any second in the last 30 days
- **Geographic**: Cross-region backup storage

### Recovery Procedures
- **RTO**: 4 hours for critical systems
- **RPO**: 1 hour for user data
- **Testing**: Monthly restore testing
- **Documentation**: Detailed recovery runbooks

## Monitoring & Maintenance

### Health Checks
- **Connection Pooling**: PgBouncer for connection management
- **Query Performance**: Slow query logging and analysis
- **Storage Monitoring**: Disk space and growth tracking
- **Replication Status**: Master-slave synchronization monitoring

### Maintenance Windows
- **Weekly**: Index rebuilds and statistics updates
- **Monthly**: Table reorganization and archiving
- **Quarterly**: Schema review and optimization
- **Annually**: Major version upgrades and migration

## Scalability Considerations

### Horizontal Scaling
- **Sharding**: User data sharded by user_id hash
- **Read Replicas**: Multiple read replicas for analytics
- **Connection Pooling**: PgBouncer for connection management
- **Load Distribution**: Geographic distribution of database instances

### Vertical Scaling
- **Resource Allocation**: CPU, memory, and storage scaling
- **Query Optimization**: Index tuning and query rewriting
- **Caching Layers**: Increased cache capacity and efficiency
- **Asynchronous Processing**: Background job queues for heavy operations

---

**Document Version**: 1.0
**Created**: November 6, 2025
**Database Administrator**: [DBA Name]
**Next Review**: December 6, 2025