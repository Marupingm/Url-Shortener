# URL Shortener

A simple URL shortener application built with Node.js, Express, and MongoDB.

## Features

- Shorten long URLs to easily shareable short URLs
- Redirect from short URLs to original long URLs
- Track number of clicks for each shortened URL
- View list of all shortened URLs
- Modern Bootstrap UI
- Input validation
- Duplicate URL detection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:3000
```

Note: Adjust the `MONGODB_URI` and `BASE_URL` according to your setup.

## Usage

1. Start the MongoDB service on your machine (if using local MongoDB)

2. Start the application:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

4. Enter a long URL in the input field and click "Shorten URL"

5. Copy and share the generated short URL

## API Endpoints

- `POST /api/shorten` - Create a short URL
  - Body: `{ "longUrl": "https://example.com" }`
  - Returns: URL object with short and long URLs

- `GET /:code` - Redirect to the original long URL

- `GET /api/urls` - Get list of all URLs

## License

MIT 