# URL Shortener

A simple URL shortener application built with Node.js, Express, and MongoDB.

## Features

- Create short URLs from long URLs
- Track click counts
- View URL history
- Bootstrap UI
- MongoDB storage

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
BASE_URL=http://localhost:3000
```

3. Run the app:
```bash
npm run dev  # Development
npm start    # Production
```

## API Endpoints

- `POST /api/shorten` - Create short URL
- `GET /:code` - Redirect to long URL
- `GET /api/urls` - List all URLs 