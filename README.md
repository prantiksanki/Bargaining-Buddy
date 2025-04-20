# BargainBuddy – Base v1.0.1 Smart Price Comparison and Scraping Engine

BargainBuddy is an intelligent, dynamic product search and comparison platform designed to simplify online shopping. It leverages real-time web scraping to fetch pricing from various online retailers and provides structured comparison data, including pricing trends and deal analytics.

This project is part of our Software Engineering capstone at UPES.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Future Plans](#future-plans)

---

## Features

- Full-text search for consumer products
- Dynamic product categorization using keyword inference
- Stealth web scraping using Puppeteer with anti-bot evasion
- Real-time price extraction across multiple retailers
- Aggregated pricing information: lowest, highest, and average price
- Dynamic UUID-based product identification to abstract external URLs
- Modular backend logic using helper services
- Extensible design for price history and trend tracking

---

## Tech Stack

| Layer        | Technology                                |
|--------------|-------------------------------------------|
| Frontend     | React.js                                  |
| Backend      | Node.js, Express.js (CommonJS syntax)     |
| Web Scraping | Puppeteer, puppeteer-extra stealth plugin |
| Database     | MongoDB                                   |
| Testing      | Thunder Client, Postman                   |
| DevOps       | Deployment ( Planned )                    |

---

## Architecture

- Monolithic backend with route and scraper logic handled in a unified entry point
- Internal UUID-to-URL mapping to obfuscate Xerve query links
- Planned architecture allows future scaling via microservices and persistent storage

---

## API Endpoints

| Method | Route             | Description                                                |
|--------|-------------------|------------------------------------------------------------|
| GET    | /search?q=        | Performs product search and returns matching results       |
| GET    | /scrape?id=       | Fetches pricing and metadata for a selected product ID     |

Note: Product IDs are internally mapped UUIDs that point to Xerve URLs but remain hidden from the client.

---

## Setup and Installation

1. Clone the repository

   ```bash
   git clone https://github.com/prantiksanki/Bargaining-Buddy.git
   cd Bargaining-Buddy
   ```

2. Install backend dependencies

   ```bash
   npm install
   ```

3. Start the backend server

   ```bash
   node index.js
   ```

4. Access the API

   - Search: http://localhost:5000/search?q=black hoodie
   - Scrape: http://localhost:5000/scrape?id=<uuid-from-search>

---

## Project Structure

```
Backend/
├── helpers/
│   └── scraper.js         # Handles search and scrape logic using Puppeteer
├── models/                # MongoDB models
├── index.js               # Express entry point with unified routes
└── package.json
```

---

## Contributors

| Role                         | Name               | GitHub Handle     |
|------------------------------|--------------------|--------------------|
| Project Manager              | Aantriksh Sood     | @ZeroDiscord       |
| Frontend Developer           | Prantik Sanki      | @prantiksanki      |
| Machine Learning Engineer    | Saksham Bhardwaj   | @Sakshambh09       |
| Documentation & DB Engineer  | Sanyam Goyal       | @Sanyamgoyal21     |

---

## Future Plans

- Implement persistent database layer (MongoDB)
- Track and visualize historical pricing data
- Integrate user authentication and custom watchlists
- Build a production-grade frontend using React
- Develop ML-based price prediction and alerts
- Containerize with Docker for deployment

---
