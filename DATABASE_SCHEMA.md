# Database Schema Documentation

This document provides a comprehensive overview of all database tables and columns in the Micro Tracker application.

## Table of Contents

1. [Core Application Tables](#core-application-tables)
2. [Laravel Framework Tables](#laravel-framework-tables)
3. [Analytics & Tracking Tables](#analytics--tracking-tables)
4. [Advertising Tables](#advertising-tables)
5. [Authentication Tables](#authentication-tables)
6. [Indexes and Constraints](#indexes-and-constraints)

---

## Core Application Tables

### 1. `users`
**Purpose**: User accounts for the application

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | varchar(255) | NOT NULL | User's display name |
| `email` | varchar(255) | NOT NULL, UNIQUE | User's email address |
| `email_verified_at` | timestamp | NULLABLE | Email verification timestamp |
| `password` | varchar(255) | NOT NULL | Hashed password |
| `remember_token` | varchar(100) | NULLABLE | Remember me token |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

### 2. `projects`
**Purpose**: Multi-tenant project management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique project identifier |
| `owner_user_id` | bigint | FOREIGN KEY → users.id | Project owner |
| `name` | varchar(255) | NOT NULL | Project name |
| `description` | text | NULLABLE | Project description |
| `website_url` | varchar(255) | NULLABLE | Project website URL |
| `public_key` | varchar(255) | NOT NULL, UNIQUE | Public API key for tracking |
| `secret_key` | varchar(255) | NOT NULL | Secret API key for authentication |
| `is_active` | boolean | NOT NULL, DEFAULT true | Project status |
| `last_used_at` | timestamp | NULLABLE | Last API usage timestamp |
| `last_rotated_at` | timestamp | NULLABLE | Last key rotation timestamp |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `UNIQUE(owner_user_id, name)` - Ensures unique project names per user
- `INDEX(owner_user_id, is_active)` - Optimizes user's active projects query

### 3. `api_keys`
**Purpose**: Additional API keys for projects (legacy/alternative to project keys)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique API key identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `name` | varchar(255) | NOT NULL | API key name/description |
| `scope` | varchar(255) | NOT NULL, DEFAULT '*' | API key permissions scope |
| `secret_prefix` | varchar(8) | NOT NULL | First 8 characters of secret |
| `secret_last4` | varchar(4) | NOT NULL | Last 4 characters of secret |
| `secret_hash` | varchar(255) | NOT NULL | Hashed secret key |
| `is_active` | boolean | NOT NULL, DEFAULT true | API key status |
| `last_used_at` | timestamp | NULLABLE | Last usage timestamp |
| `last_rotated_at` | timestamp | NULLABLE | Last rotation timestamp |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `INDEX(project_id, is_active)` - Optimizes project's active keys query

---

## Analytics & Tracking Tables

### 4. `visitors`
**Purpose**: Unique visitor tracking and analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique visitor identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `visitor_key` | varchar(255) | NOT NULL, INDEX | Unique visitor identifier |
| `first_seen_at` | timestamp | NOT NULL | First visit timestamp |
| `last_seen_at` | timestamp | NOT NULL | Most recent visit timestamp |
| `sessions_count` | integer | NOT NULL, DEFAULT 0 | Total sessions for this visitor |
| `is_bot` | boolean | NOT NULL, DEFAULT false | Bot detection flag |
| `timezone` | varchar(255) | NULLABLE | Visitor's timezone |
| `viewport_w` | integer | NULLABLE | Viewport width |
| `viewport_h` | integer | NULLABLE | Viewport height |
| `user_agent` | text | NULLABLE | Browser user agent string |
| `first_utm` | json | NULLABLE | First UTM parameters |
| `last_utm` | json | NULLABLE | Most recent UTM parameters |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `INDEX(visitor_key)` - Fast visitor lookup
- `INDEX(project_id, is_bot)` - Optimizes project analytics queries

### 5. `tracking_sessions`
**Purpose**: User session tracking and analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique session identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `visitor_id` | bigint | FOREIGN KEY → visitors.id | Associated visitor |
| `session_key` | varchar(255) | NOT NULL, INDEX | Unique session identifier |
| `started_at` | timestamp | NOT NULL, INDEX | Session start time |
| `last_activity_at` | timestamp | NOT NULL, INDEX | Last activity timestamp |
| `landing_url` | text | NULLABLE | First page URL in session |
| `landing_referrer` | text | NULLABLE | Referrer URL |
| `duration_seconds` | integer | NULLABLE | Session duration |
| `scroll_pct` | decimal(5,2) | NULLABLE | Average scroll percentage |
| `pcqs` | decimal(5,2) | NULLABLE | Page Quality Score |
| `utm_source` | varchar(255) | NULLABLE | UTM source parameter |
| `utm_medium` | varchar(255) | NULLABLE | UTM medium parameter |
| `utm_campaign_id` | varchar(255) | NULLABLE | UTM campaign ID |
| `utm_campaign_name` | varchar(255) | NULLABLE | UTM campaign name |
| `utm_adset_id` | varchar(255) | NULLABLE | UTM adset ID |
| `utm_adset_name` | varchar(255) | NULLABLE | UTM adset name |
| `utm_ad_id` | varchar(255) | NULLABLE, INDEX | UTM ad ID |
| `utm_ad_name` | varchar(255) | NULLABLE | UTM ad name |
| `utm_placement` | varchar(255) | NULLABLE | UTM placement |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `INDEX(session_key)` - Fast session lookup
- `INDEX(started_at)` - Time-based queries
- `INDEX(last_activity_at)` - Activity-based queries
- `INDEX(utm_source, utm_campaign_id, utm_adset_id, utm_ad_id)` - UTM analytics

### 6. `events`
**Purpose**: Individual user actions and events tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique event identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `session_id` | bigint | FOREIGN KEY → tracking_sessions.id | Associated session |
| `visitor_id` | bigint | FOREIGN KEY → visitors.id | Associated visitor |
| `event_type` | varchar(255) | NOT NULL | Type of event (page_view, click, etc.) |
| `name` | varchar(255) | NOT NULL | Event name/description |
| `url` | text | NULLABLE | Page URL where event occurred |
| `path` | varchar(255) | NULLABLE | URL path |
| `selector` | varchar(255) | NULLABLE | CSS selector for click events |
| `scroll_pct` | decimal(5,2) | NULLABLE | Scroll percentage when event occurred |
| `x` | integer | NULLABLE | X coordinate for click events |
| `y` | integer | NULLABLE | Y coordinate for click events |
| `meta` | json | NULLABLE | Additional event metadata |
| `created_at` | timestamp | NOT NULL, INDEX | Event timestamp |

**Indexes:**
- `INDEX(created_at)` - Time-based queries
- `INDEX(project_id, session_id, event_type)` - Multi-dimensional analytics

### 7. `daily_rollups`
**Purpose**: Pre-aggregated daily analytics data for performance

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique rollup identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `day` | date | NOT NULL | Rollup date |
| `visitors` | integer | NOT NULL, DEFAULT 0 | Unique visitors count |
| `sessions` | integer | NOT NULL, DEFAULT 0 | Total sessions count |
| `bounces` | integer | NOT NULL, DEFAULT 0 | Bounce count |
| `pageviews` | integer | NOT NULL, DEFAULT 0 | Total page views |
| `form_starts` | integer | NOT NULL, DEFAULT 0 | Form start events |
| `form_submits` | integer | NOT NULL, DEFAULT 0 | Form submit events |
| `avg_session_duration_secs` | decimal(10,2) | NULLABLE | Average session duration |
| `exits` | integer | NOT NULL, DEFAULT 0 | Exit events count |
| `metrics` | json | NULLABLE | Additional metrics data |
| `top_paths` | json | NULLABLE | Most visited paths |
| `top_ctas` | json | NULLABLE | Top call-to-action elements |
| `top_sources` | json | NULLABLE | Top traffic sources |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `UNIQUE(project_id, day)` - Ensures one rollup per project per day

---

## Advertising Tables

### 8. `ads_dim`
**Purpose**: Advertising campaigns, adsets, and ads dimension table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `ad_id` | varchar(255) | PRIMARY KEY | Unique ad identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `platform` | varchar(255) | NOT NULL, DEFAULT 'facebook' | Advertising platform |
| `campaign_id` | varchar(255) | NULLABLE | Campaign identifier |
| `campaign_name` | varchar(255) | NULLABLE | Campaign name |
| `adset_id` | varchar(255) | NULLABLE | Adset identifier |
| `adset_name` | varchar(255) | NULLABLE | Adset name |
| `ad_name` | varchar(255) | NULLABLE | Ad name |
| `placement` | varchar(255) | NULLABLE | Ad placement |
| `first_seen_at` | timestamp | NOT NULL | First appearance timestamp |
| `last_seen_at` | timestamp | NOT NULL | Last appearance timestamp |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `INDEX(platform, campaign_id, adset_id)` - Campaign hierarchy queries

### 9. `ad_spend_fact`
**Purpose**: Daily advertising spend and performance data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique spend record identifier |
| `project_id` | bigint | FOREIGN KEY → projects.id | Associated project |
| `platform` | varchar(255) | NOT NULL | Advertising platform |
| `date` | date | NOT NULL | Spend date |
| `campaign_id` | varchar(255) | NOT NULL | Campaign identifier |
| `adset_id` | varchar(255) | NOT NULL | Adset identifier |
| `ad_id` | varchar(255) | NOT NULL | Ad identifier |
| `impressions` | integer | NOT NULL, DEFAULT 0 | Ad impressions count |
| `clicks` | integer | NOT NULL, DEFAULT 0 | Ad clicks count |
| `spend` | decimal(12,2) | NOT NULL, DEFAULT 0 | Amount spent |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `INDEX(date, platform)` - Time and platform-based queries
- `INDEX(campaign_id, adset_id, ad_id)` - Campaign hierarchy queries

---

## Authentication Tables

### 10. `personal_access_tokens`
**Purpose**: Laravel Sanctum personal access tokens for API authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Unique token identifier |
| `tokenable_type` | varchar(255) | NOT NULL | Model type (usually 'App\\Models\\User') |
| `tokenable_id` | bigint | NOT NULL | Model ID (user ID) |
| `name` | text | NOT NULL | Token name/description |
| `token` | varchar(64) | NOT NULL, UNIQUE | Hashed token value |
| `abilities` | text | NULLABLE | Token permissions (JSON) |
| `last_used_at` | timestamp | NULLABLE | Last usage timestamp |
| `expires_at` | timestamp | NULLABLE, INDEX | Token expiration |
| `created_at` | timestamp | NULLABLE | Record creation time |
| `updated_at` | timestamp | NULLABLE | Record last update time |

**Indexes:**
- `INDEX(tokenable_type, tokenable_id)` - User token lookup
- `INDEX(expires_at)` - Expired token cleanup

---

## Laravel Framework Tables

### 11. `password_reset_tokens`
**Purpose**: Password reset functionality

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `email` | varchar(255) | PRIMARY KEY | User email |
| `token` | varchar(255) | NOT NULL | Reset token |
| `created_at` | timestamp | NULLABLE | Token creation time |

### 12. `sessions` (Laravel Sessions)
**Purpose**: Laravel session storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | varchar(255) | PRIMARY KEY | Session ID |
| `user_id` | bigint | NULLABLE, INDEX | Associated user |
| `ip_address` | varchar(45) | NULLABLE | Client IP address |
| `user_agent` | text | NULLABLE | Client user agent |
| `payload` | longtext | NOT NULL | Session data |
| `last_activity` | integer | NOT NULL, INDEX | Last activity timestamp |

### 13. `cache`
**Purpose**: Application cache storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | varchar(255) | PRIMARY KEY | Cache key |
| `value` | mediumtext | NOT NULL | Cached value |
| `expiration` | integer | NOT NULL | Expiration timestamp |

### 14. `cache_locks`
**Purpose**: Cache locking mechanism

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | varchar(255) | PRIMARY KEY | Lock key |
| `owner` | varchar(255) | NOT NULL | Lock owner |
| `expiration` | integer | NOT NULL | Lock expiration |

### 15. `jobs`
**Purpose**: Queue job storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Job ID |
| `queue` | varchar(255) | NOT NULL, INDEX | Queue name |
| `payload` | longtext | NOT NULL | Job payload |
| `attempts` | tinyint unsigned | NOT NULL | Attempt count |
| `reserved_at` | int unsigned | NULLABLE | Reservation timestamp |
| `available_at` | int unsigned | NOT NULL | Available timestamp |
| `created_at` | int unsigned | NOT NULL | Creation timestamp |

### 16. `job_batches`
**Purpose**: Queue job batch management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | varchar(255) | PRIMARY KEY | Batch ID |
| `name` | varchar(255) | NOT NULL | Batch name |
| `total_jobs` | integer | NOT NULL | Total jobs in batch |
| `pending_jobs` | integer | NOT NULL | Pending jobs count |
| `failed_jobs` | integer | NOT NULL | Failed jobs count |
| `failed_job_ids` | longtext | NOT NULL | Failed job IDs (JSON) |
| `options` | mediumtext | NULLABLE | Batch options |
| `cancelled_at` | integer | NULLABLE | Cancellation timestamp |
| `created_at` | integer | NOT NULL | Creation timestamp |
| `finished_at` | integer | NULLABLE | Completion timestamp |

### 17. `failed_jobs`
**Purpose**: Failed queue job storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY, AUTO_INCREMENT | Failed job ID |
| `uuid` | varchar(255) | NOT NULL, UNIQUE | Job UUID |
| `connection` | text | NOT NULL | Connection name |
| `queue` | text | NOT NULL | Queue name |
| `payload` | longtext | NOT NULL | Job payload |
| `exception` | longtext | NOT NULL | Exception details |
| `failed_at` | timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Failure timestamp |

---

## Indexes and Constraints

### Foreign Key Relationships

1. **projects** → **users** (`owner_user_id`)
2. **api_keys** → **projects** (`project_id`)
3. **visitors** → **projects** (`project_id`)
4. **tracking_sessions** → **projects** (`project_id`)
5. **tracking_sessions** → **visitors** (`visitor_id`)
6. **events** → **projects** (`project_id`)
7. **events** → **tracking_sessions** (`session_id`)
8. **events** → **visitors** (`visitor_id`)
9. **daily_rollups** → **projects** (`project_id`)
10. **ads_dim** → **projects** (`project_id`)
11. **ad_spend_fact** → **projects** (`project_id`)

### Performance Indexes

- **Project-scoped queries**: All analytics tables have `project_id` indexes
- **Time-based queries**: Timestamp columns are indexed for date range queries
- **Unique constraints**: Prevent duplicate data (visitor keys, session keys, etc.)
- **Composite indexes**: Multi-column indexes for complex query patterns

### Data Types Summary

- **Identifiers**: `bigint` for primary keys, `varchar(255)` for string IDs
- **Timestamps**: `timestamp` for precise time tracking
- **JSON**: Used for flexible metadata storage (UTM params, event metadata)
- **Decimals**: Used for precise numeric values (spend, percentages)
- **Text/MediumText/LongText**: Used for variable-length content

---

## Notes

1. **Multi-tenancy**: All analytics tables are scoped by `project_id` for multi-project support
2. **Cascade Deletes**: Project deletion cascades to all related analytics data
3. **Performance**: Daily rollups provide pre-aggregated data for dashboard performance
4. **Flexibility**: JSON columns allow for extensible metadata without schema changes
5. **Security**: API keys are hashed and only prefixes/last4 are stored for display
