# Weather Analytics Application

A full-stack weather analytics application that retrieves weather data from OpenWeatherMap, computes a custom **Comfort Index Score** for each city, and presents ranked insights through a responsive dashboard.

## Tech Stack

| Layer     | Technology                                                  |
| --------- | ----------------------------------------------------------- |
| Frontend  | Next.js 16, TypeScript, Tailwind CSS                        |
| Backend   | Node.js, Express 5                                          |
| Auth      | Auth0 (NextJS SDK + express-oauth2-jwt-bearer)              |
| Cache     | Redis (via ioredis)                                         |
| Container | Docker, Docker Compose                                      |

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- Redis (local or Docker)
- An [OpenWeatherMap](https://openweathermap.org/) API key
- An [Auth0](https://auth0.com/) tenant with:
  - A **Regular Web Application** (for the frontend)
  - An **API** (for backend JWT validation)

### 1. Clone the repository

```bash
git clone <repo-url>
cd "Weather Web App FullStack"
```

### 2. Configure environment variables

Copy the example files and fill in your credentials:

```bash
# Root (for Docker Compose)
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

**Required values:**

| Variable                 | Where                      | Description                                |
| ------------------------ | -------------------------- | ------------------------------------------ |
| `OPENWEATHER_API_KEY`    | backend `.env`, root `.env`| Your OpenWeatherMap API key                |
| `AUTH0_DOMAIN`           | frontend `.env.local`      | e.g. `your-tenant.auth0.com`              |
| `AUTH0_CLIENT_ID`        | frontend `.env.local`      | Auth0 application client ID               |
| `AUTH0_CLIENT_SECRET`    | frontend `.env.local`      | Auth0 application client secret           |
| `AUTH0_SECRET`           | frontend `.env.local`      | Random string ≥32 chars for session encryption |
| `AUTH0_AUDIENCE`         | both                       | Auth0 API identifier                       |
| `AUTH0_ISSUER_BASE_URL`  | backend `.env`             | `https://your-tenant.auth0.com`           |

### 3. Run with Docker (recommended)

```bash
# Production
docker compose up --build

# Development (hot reload)
docker compose -f docker-compose.dev.yml up --build
```

### 4. Run locally (without Docker)

```bash
# Start Redis
redis-server

# Backend
cd backend
npm install
npm run dev  # runs on :5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev  # runs on :3000
```

### 5. Auth0 Setup

1. Create a **Regular Web Application** in Auth0 Dashboard.
2. Set callback URL: `http://localhost:3000/auth/callback`
3. Set logout URL: `http://localhost:3000`
4. Create an **API** with the identifier matching `AUTH0_AUDIENCE`.
5. **Disable public signups**: Dashboard → Authentication → Database → your-connection → Disable Sign Ups.
6. **Enable MFA**: Dashboard → Security → Multi-factor Auth → Enable Email.
7. **Create test user**: Dashboard → User Management → Users → Create User:
   - Email: `careers@fidenz.com`
   - Password: `Pass#fidenz`

---

## Comfort Index Algorithm

### Overview

The Comfort Index is a **0–100 numerical score** that quantifies how "comfortable" the weather is for humans at a given location. Higher scores indicate more pleasant conditions.

### Formula

The score is a **weighted average of five normalised sub-scores**:

```
ComfortIndex = 0.35 × T_score + 0.25 × H_score + 0.20 × W_score + 0.10 × C_score + 0.10 × V_score
```

| Parameter       | Weight | Ideal Range           | Rationale                                                            |
| --------------- | ------ | --------------------- | -------------------------------------------------------------------- |
| Temperature (°C)| 35%    | 20–26 °C              | Primary factor in thermal comfort (ASHRAE Standard 55)                |
| Humidity (%)    | 25%    | 30–60%                | High humidity impedes evaporative cooling; low humidity dries mucous membranes |
| Wind Speed (m/s)| 20%    | 0–3 m/s               | Light breeze is pleasant; strong wind is uncomfortable               |
| Cloudiness (%)  | 10%    | 0–40%                 | Partial cloud cover is acceptable; overcast is mildly gloomy         |
| Visibility (m)  | 10%    | ≥10 km                | Good visibility improves outdoor experience                          |

### Sub-Score Details

**Temperature** (35% weight — most impactful):
- 20–26 °C → 100 (the thermoneutral zone for a lightly clothed sedentary person)
- Falls linearly to 0 at −10 °C (cold extreme) and 45 °C (heat extreme)

**Humidity** (25%):
- 30–60% → 100
- 0% or 100% → 0 (both extremes are uncomfortable)

**Wind Speed** (20%):
- 0–3 m/s → 100 (gentle breeze)
- 20+ m/s → 0 (storm-level gusts)

**Cloudiness** (10%):
- 0–40% → 100
- 100% (overcast) → 50 (mild penalty — not as impactful as temperature)

**Visibility** (10%):
- ≥10 km → 100
- 0 m → 0 (fog/smog conditions)

### Why these weights?

1. **Temperature dominates** because thermal comfort research consistently shows temperature as the strongest predictor of human comfort outdoors.
2. **Humidity is second** because it directly affects how we perceive temperature (heat index).
3. **Wind is third** due to wind chill effects in cold weather and general discomfort in high winds.
4. **Cloudiness and visibility** are secondary — they affect mood and outdoor enjoyment but not physical comfort as strongly.

### Trade-offs Considered

- **Simplicity vs. accuracy**: A more complex model could include dew point, UV index, and air quality. We chose five readily-available parameters to keep the formula transparent and reproducible.
- **Linear interpolation vs. non-linear curves**: Linear piecewise functions were chosen for simplicity. In reality, discomfort increases non-linearly at extreme temperatures, but the linear model provides a good first approximation.
- **Cloudiness floor at 50**: Overcast skies reduce the score by at most 50% of the cloudiness weight, acknowledging that cloud cover is subjective and culturally variable.

---

## Cache Design

### Architecture

```
Client → Next.js API Route (with JWT) → Express Backend → Redis Cache → OpenWeatherMap API
```

### Strategy

1. **Raw weather data cache**: Each city's OpenWeatherMap response is cached with key `weather:{cityCode}` and a 5-minute TTL (300 seconds).
2. **Processed results cache**: The fully computed and ranked results array is cached with key `processed:all` and the same 5-minute TTL.
3. **Cache-aside pattern**: The service checks Redis first. On a miss, it fetches from OpenWeatherMap, computes scores, and writes back.
4. **Independent TTLs**: Raw and processed caches expire independently. If the processed cache expires but raw caches are still fresh, only the computation is re-run (not the API calls).

### Debug Endpoint

`GET /api/cache-status` returns HIT/MISS status and remaining TTL for every cache key. Accessible through the frontend's Developer Debug page.

---

## API Endpoints

| Method | Path                    | Auth Required | Description                              |
| ------ | ----------------------- | ------------- | ---------------------------------------- |
| GET    | `/api/weather`          | ✅ JWT        | All cities with weather, score, ranking  |
| GET    | `/api/weather/:cityCode`| ✅ JWT        | Single city weather data                 |
| GET    | `/api/cache-status`     | ✅ JWT        | Redis cache HIT/MISS for each key        |
| GET    | `/api/health`           | ❌            | Health check                             |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # App config, Redis client
│   │   ├── controllers/     # Route handlers
│   │   ├── data/            # cities.json
│   │   ├── middleware/      # Auth0 JWT validation
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Weather & cache services
│   │   ├── utils/           # Comfort Index algorithm
│   │   └── app.js           # Entry point
│   ├── tests/               # Jest unit tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages & API routes
│   │   ├── components/      # React UI components
│   │   ├── lib/             # Auth0 client
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Production
├── docker-compose.dev.yml   # Development (hot reload)
└── README.md
```

---

## Known Limitations

1. **OpenWeatherMap free tier**: Limited to 60 calls/minute. With 15 cities and a 5-minute cache, this is well within limits.
2. **Dew point**: Not directly available in the free API tier's response. The comfort index uses humidity instead.
3. **Middleware deprecation**: Next.js 16 deprecated the `middleware.ts` convention in favor of `proxy`. The Auth0 SDK still uses middleware, which continues to function but shows a deprecation warning.
4. **No historical data**: The application shows current weather only. Historical trend graphs would require a paid API tier.
5. **Single API key**: All requests use one OpenWeatherMap API key. For production, consider implementing key rotation.

---

## Running Tests

```bash
cd backend
npm test
```

All 23 unit tests cover the Comfort Index sub-score functions and the composite scoring function.
