# psql-api — PostgreSQL table viewer API

Small Node.js/Express server that connects to a PostgreSQL database and serves the data both as a JSON API and as a browser page with tables.

## Stack
Node.js · Express · `pg` (connection pool) · CORS · dotenv

## Setup
```bash
cd psql-api
npm install
```
Create `psql-api/.env` (never commit it):
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_db
```
Run:
```bash
node server.js
```
Open the server in the browser — `/` renders the tables; `index.html` is a static front end for the API.
