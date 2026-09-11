# CIRCULA Backend REST API (Phase 1 Foundation)

CIRCULA is a B2B Circular Materials Exchange platform connecting manufacturers, retailers, packaging recyclers, and logistics operators to turn surplus packaging waste into measurable economic and carbon value.

This directory contains the production-ready Node.js, Express, and MongoDB backend foundation.

---

## 1. Requirements

- **Node.js**: `v18.x` or higher (`v20+` recommended)
- **MongoDB**: `v6.x` or higher (local instance or MongoDB Atlas cluster)
- **npm** or **yarn** / **pnpm** / **bun**

---

## 2. Installation

Navigate into the `backend/` directory and install the required npm dependencies:

```bash
cd backend
npm install
```

---

## 3. Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory:

```bash
cp .env.example .env
```

### Required Variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | The port on which the Express API server listens | `5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/circula` |
| `JWT_SECRET` | Secret key for signing and verifying JSON Web Tokens | `circula_super_secure_jwt_secret_2026` |
| `CLIENT_URL` | Frontend client origin allowed by CORS | `http://localhost:5173` |
| `GEMINI_API_KEY` | Optional: Reserved for Phase 2 AI features | *(leave blank for Phase 1)* |

---

## 4. MongoDB Setup

### Option A: Local MongoDB
1. Ensure the MongoDB service is active on your machine:
   ```bash
   # On macOS (Homebrew)
   brew services start mongodb-community
   # On Linux
   sudo systemctl start mongod
   ```
2. Set your `MONGO_URI` in `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/circula
   ```

### Option B: MongoDB Atlas (Cloud)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection string and add it to `.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/circula?retryWrites=true&w=majority
   ```

> **Note**: The backend fails gracefully if MongoDB is temporarily unreachable, logging a clear diagnostic message while maintaining health check availability.

---

## 5. Running the Backend

### Development Mode (with hot reloading via `nodemon`):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Once running, verify the service at:
- Root Welcome: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

---

## 6. Seeding the Database

CIRCULA provides an automated seed script that populates realistic industrial data:
- **6 Companies**: ABC Packaging (Manufacturer), GreenPack Industries (Converter), EcoCycle Materials (Recycler), Urban Retail Solutions (Retailer), CircularBox Manufacturing (Packaging), and ReLoop Logistics (Freight).
- **7 Users**: Pre-hashed passwords, linked to their respective organizations, plus a platform administrator.
- **16 Industrial Materials**: Corrugated cardboard bales, HDPE regrind, wooden pallets, stretch film, kraft paper, amber glass cullet, steel drums, etc.
- **5 Realistic Transactions**: Complete with human-readable tracking numbers (`CM-2048` to `CM-2052`), transit distances, and calculated Scope 3 carbon offsets.

To run the seed script:
```bash
npm run seed
```

**Default Test Credentials:**
- Email: `rajesh@abcpackaging.com` (Supplier / ABC Packaging)
- Email: `ananya@greenpack.example.com` (Converter / GreenPack)
- Email: `vikram@ecocycle.example.com` (Recycler / EcoCycle)
- Email: `priya@urbanretail.example.com` (Buyer / Urban Retail)
- Email: `admin@circula.exchange` (Global Administrator)
- Password: `Password123!` (for all seeded test accounts)

---

## 7. API Endpoints

### Health & Diagnostic
- `GET /api/health` — Check server status & MongoDB connection state
- `GET /api` — Welcome banner and version

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new business user, automatically creates Company & links user
- `POST /api/auth/login` — Sign in with email & password, returns JWT token + user & company profile
- `GET /api/auth/me` — *(Protected)* Get authenticated user & company details
- `POST /api/auth/logout` — Invalidate client-side session

### Users (`/api/users`)
- `GET /api/users/:id` — *(Protected)* Get user profile
- `PUT /api/users/:id` — *(Protected)* Update user name, phone, or avatar
- `GET /api/users/company/:companyId` — *(Protected)* List all team members in a company

### Companies (`/api/companies`)
- `GET /api/companies/:id` — Get public company profile & verification status
- `PUT /api/companies/:id` — *(Protected)* Update company profile (Admin/Company Admin)
- `GET /api/companies/:id/materials` — Get all materials listed by a company
- `GET /api/companies/:id/transactions` — *(Protected)* Get inbound/outbound transactions for a company
- `GET /api/companies/:id/stats` — Get dynamic circularity KPIs, waste diverted, and carbon avoided

### Materials (`/api/materials`)
- `GET /api/materials` — List materials with query filters:
  - `category` (`cardboard`, `plastic`, `pallet`, `paper`, `glass`, `metal`, `other`)
  - `condition` (`new`, `good`, `used`, `recyclable`)
  - `transactionType` (`sell`, `free_claim`, `exchange`)
  - `minPrice`, `maxPrice`, `minQuantity`, `maxQuantity`
  - `city`, `status`, `search` (full-text search)
  - `sort` (`newest`, `price_low`, `price_high`, `quantity_high`, `oldest`)
- `GET /api/materials/:id` — Get single material with populated company & seller details
- `POST /api/materials` — *(Protected)* Create new material listing (auto-calculates carbon & virgin avoidance metrics)
- `PUT /api/materials/:id` — *(Protected)* Update material listing (Owner/Admin)
- `DELETE /api/materials/:id` — *(Protected)* Delete material listing
- `PATCH /api/materials/:id/status` — *(Protected)* Update status (`active`, `reserved`, `sold`, `expired`, `draft`)
- `GET /api/materials/company/:companyId` — Get all materials from a specific company

### Transactions (`/api/transactions`)
- `POST /api/transactions` — *(Protected)* Initiate order/exchange (validates stock, calculates transit distance & emissions, generates readable order number e.g. `CM-2048`)
- `GET /api/transactions` — *(Protected)* List transactions for caller's company
- `GET /api/transactions/:id` — *(Protected)* Get transaction details
- `PATCH /api/transactions/:id/status` — *(Protected)* Update status (`pending` -> `confirmed` -> `pickup_scheduled` -> `in_transit` -> `delivered` -> `verified` -> `cancelled`) with automatic stock deduction & company stats accumulation
- `GET /api/transactions/company/:companyId` — *(Protected)* List transactions for a company

---

## 8. Frontend Connection

The CIRCULA frontend communicates with this backend using `src/services/apiClient.ts`.

In the root `.env` or Vite environment, configure:
```env
VITE_API_URL=http://localhost:5000/api
```

The frontend client:
1. Automatically attaches the stored JWT (`Authorization: Bearer <token>`).
2. Centralizes all HTTP methods (`get`, `post`, `put`, `patch`, `delete`).
3. Handles connection timeouts and server errors gracefully, falling back to local simulation data in environments where the backend is offline.

---

## 9. Authentication & Authorization

- JWT tokens are signed using `HMAC-SHA256` with a 7-day expiration.
- Passwords are salted and hashed using `bcryptjs` with 10 salt rounds before database persistence.
- Passwords are automatically excluded from Mongoose queries and response payloads (`select: false` and schema transforms).
- Ownership verification is strictly enforced server-side using the decoded token identity.
