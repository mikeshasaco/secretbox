# Micro Tracker MVP

A full-stack micro-tracking platform built with Laravel 11, React, and PostgreSQL.

## Quick Start

1. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure database** (PostgreSQL)
   ```bash
   # Update .env with your PostgreSQL credentials
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=micro_tracker
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

4. **Run migrations**
   ```bash
   php artisan migrate
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Laravel
   php artisan serve
   
   # Terminal 2: Vite
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:8000/api

## Features

- User authentication with Laravel Sanctum
- Project management and API key generation
- Visitor and session tracking
- Event tracking and analytics
- Ad performance monitoring
- CPEV (Cost Per Engaged Visitor) analytics
- Modern React dashboard

## Dashboard Guide

For detailed information about all dashboard tabs and their functionality, see [DASHBOARD_README.md](./DASHBOARD_README.md).

The dashboard includes 7 main tabs:
- **Visitors**: Track individual visitor behavior and demographics
- **Sessions**: Analyze user sessions and engagement patterns
- **Events**: Monitor specific user actions and custom events
- **Ads**: Manage advertising campaigns and creative performance
- **Spend**: Track advertising spend and budget management
- **Analytics**: Advanced analytics with CPEV, scroll velocity, and PCQS metrics
- **Settings**: Manage project configuration and API keys

## API Usage

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Data Ingestion
- `POST /api/v1/ingest/event` - Track events (requires API key)

### Analytics
- `GET /api/v1/projects/{id}/visitors` - Get visitors
- `GET /api/v1/projects/{id}/sessions` - Get sessions
- `GET /api/v1/projects/{id}/events` - Get events

## License

MIT License# secretbox
