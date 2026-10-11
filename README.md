# Invaac(Inventory Management System)

A full-stack inventory app with JWT authentication and role-based access control. Anyone can browse products and categories. Only admins can create, edit, or delete them.

**Stack:** React (Vite), FastAPI, SQLAlchemy, MySQL

## Features

- JWT login/register with bcrypt password hashing
- Role-based access: `user` (read-only) and `admin` (full CRUD), enforced on the API and in the UI
- Product CRUD with category linking
- Category CRUD (deletion is blocked while products still use the category)
- Search (debounced) and server-side pagination with total count
- `PUT` for full product updates, `PATCH` for partial updates

## Project Structure

```
Fast_API/
  Backend/    FastAPI app (routes, models, schemas, auth)
  Frontend/   React app (pages, components, context, api)
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8+ running locally

## Backend Setup

```bash
cd Backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

1. Create the database in MySQL:

   ```sql
   CREATE DATABASE inventory_db;
   ```

2. Copy `.env.example` to `.env` and fill in your values:

   ```
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=inventory_db
   SECRET_KEY=your_random_secret
   ```

   Generate a secret key with:

   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. Start the server (tables are created automatically on first run):

   ```bash
   uvicorn main:app --reload
   ```

API runs at `http://127.0.0.1:8000`. Interactive docs are at `http://127.0.0.1:8000/docs`.

## Frontend Setup

```bash
cd Frontend
npm install
```

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`. This origin is allowed by the backend CORS config in `main.py`. If you change the port, update `origins` there.

## Creating an Admin User

New registrations always get the `user` role. To promote an account, register it through the app first, then run in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

Log out and back in so the new role is picked up.

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public (form-urlencoded) |
| GET | `/auth/me` | Logged in |
| GET | `/products/` | Public (`skip`, `limit`, `search`, `category_id`) |
| GET | `/products/{id}` | Public |
| POST / PUT / PATCH / DELETE | `/products/...` | Admin |
| GET | `/categories/`, `/categories/{id}` | Public |
| POST / PUT / DELETE | `/categories/...` | Admin |

`GET /products/` returns `{ "total": <int>, "items": [...] }`.
