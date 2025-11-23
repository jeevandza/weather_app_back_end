Backend
Tech Stack

Node.js & Express – Server and API

PostgreSQL – Relational database for persistent storage

Redis – In-memory caching for faster responses

Sequelize – ORM for database interactions

Axios – Fetching weather data from WeatherAPI

Pino – Logging

Features

Fetch weather data from WeatherAPI.com

Cache data in Redis for 5 hours

Store data in PostgreSQL for long-term storage

Provide current weather and 7-day forecast

Support search history for the last 7 days

Automatic sync of new data when requested after cache expiration

Installation
cd backend
npm install
npm run dev

API Endpoints

GET /weather?q=city – Get current weather

GET /forecast?q=city – Get 7-day forecast

