# Tazkarty — Ticket Booking API

A production-ready REST API for booking event tickets built with **Node.js**, **Express**, and **MongoDB**.

## Features

- JWT authentication with access tokens (15m) and refresh tokens (7d) in HTTP-only cookies
- Role-based access control — **Admin** and **Client** roles
- Input validation on every endpoint via `express-validator`
- Rate limiting on auth routes to prevent brute-force attacks
- Centralized error handling with proper HTTP status codes
- Structured logging with `winston` and HTTP request logging via `morgan`
- Atomic ticket booking with MongoDB transactions (prevents overselling)
- Interactive API documentation at `/api-docs` (Swagger/OpenAPI)
- Dockerized for easy deployment

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Validation | express-validator |
| Security | helmet, express-rate-limit, CORS |
| Logging | winston, morgan |
| Docs | swagger-ui-express |
| Testing | Jest + Supertest + mongodb-memory-server |
| Container | Docker + docker-compose |

## Project Structure

```
├── app.js                    # Express app (no server binding — for testing)
├── server.js                 # Entry point — connects DB and starts server
├── controllers/              # Business logic
│   ├── auth.js
│   ├── admin.js
│   └── client.js
├── routes/                   # Route definitions with Swagger annotations
│   ├── authRoutes.js
│   ├── admin.js
│   └── client.js
├── middleware/
│   ├── isAuth.js             # JWT verification
│   ├── role.js               # Role-based authorization
│   ├── errorHandler.js       # Global error handler
│   ├── rateLimiter.js        # Rate limiting config
│   └── validators/           # Input validation per route group
├── models/
│   ├── user.js
│   ├── event.js
│   └── tickets.js
├── config/
│   ├── dbconnect.js
│   ├── corsOptions.js
│   ├── allowedOrigins.js
│   └── swagger.js
├── util/
│   ├── AppError.js           # Custom error class
│   ├── response.js           # Standardized response helpers
│   ├── logger.js             # Winston logger
│   └── sendEmail.js
├── tests/
│   ├── setup.js
│   ├── fixtures/seed.js
│   └── unit/                 # Auth, Admin, Client tests
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB >= 6 (or Docker)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ticket-booking-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values
```

### Running Locally

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### Running with Docker

```bash
docker compose up
```

The API will be available at `http://localhost:5000`.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | MongoDB URI | `mongodb://localhost:27017/ticket-booking` |
| `ACCESS_TOKEN_SECRET` | JWT access secret | random 64-char string |
| `REFRESH_TOKEN_SECRET` | JWT refresh secret | random 64-char string |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `465` |
| `EMAIL_USER` | SMTP username | `your@email.com` |
| `EMAIL_PASS` | SMTP password | app password |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/signup` | Register new user | None |
| POST | `/auth/login` | Login | None |
| POST | `/auth/logout` | Logout | None |
| GET | `/auth/refresh` | Refresh access token | Cookie |
| POST | `/auth/forgetpassword` | Request reset code | None |
| POST | `/auth/verifyResetCode` | Verify reset code | None |
| PUT | `/auth/addnewpassword` | Set new password | None |

### Client
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List available events | None |
| POST | `/bookticket` | Book a ticket | Client |
| DELETE | `/deletebook/:id` | Cancel a booking | Client |
| GET | `/getclientTickets/:id` | Get my tickets | Client |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/getevents` | List all events | Admin |
| POST | `/admin/addevent` | Create event | Admin |
| PUT | `/admin/updateEvent/:id` | Update event | Admin |
| DELETE | `/admin/deleteevent/:id` | Delete event | Admin |
| GET | `/admin/gettickets` | List all tickets | Admin |
| GET | `/admin/getticket/:id` | Get ticket by ID | Admin |
| GET | `/admin/getevent/:id` | Get event by ID | Admin |
| GET | `/admin/getclients/:id` | Get client by ID | Admin |

## Running Tests

```bash
npm test
```

## Special Endpoints

- `GET /health` — Health check
- `GET /api-docs` — Interactive Swagger documentation

## Response Format

All responses follow a consistent shape:

```json
{
  "status": "success | fail | error",
  "message": "Human-readable message",
  "data": {}
}
```
