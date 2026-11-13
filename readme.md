# LendTrack – Personal Money Lending & Interest Management System

A Docker-based web application for managing personal lending, customers, loans, interest, repayments and payment records.

This README explains how to configure, install, run, stop, restart and manage LendTrack on your local system or another developer's computer.

---

## 1. Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Vite | Frontend development server |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MySQL 8.0 | Database |
| Knex.js | Database migrations |
| Docker | Containerization |
| Docker Compose | Managing services |
| phpMyAdmin | MySQL GUI |
| Git & GitHub | Version control and collaboration |

---

## 2. Current Project Features

The following features have been implemented or started:

- Admin authentication and login.
- Admin session management using HTTP-only cookies.
- Protected dashboard route.
- Dashboard UI with sidebar and summary cards.
- MySQL database connection.
- Database migrations using Knex.js.
- Initial admin authentication tables.
- Customer database table migration.
- Docker-based development environment.
- Shared project source code through GitHub.

**Upcoming development:**

- Complete customer management (CRUD).
- Loan creation and management.
- Simple, compound and custom interest calculations.
- Repayment management.
- Payment history and transaction ledger.
- Overdue tracking and reminders.
- Reports and analytics.
- Notification integration.

---

## 3. Project Structure

```text
lend-tracker-main/
│
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   │   └── auth/
│   │   │       ├── login.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── auth.service.js
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   │
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── app.js
│   │
│   ├── index.js
│   ├── knexfile.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

*The structure may expand as the MVC architecture and additional modules are developed.*

---

## 4. Prerequisites

Install:

1. Docker Desktop
2. Visual Studio Code
3. Git (for GitHub collaboration)

Make sure Docker Desktop is running.

Verify Docker installation:

```cmd
docker --version
docker compose version
git --version
```

---

## 5. Docker Services and URLs

The application runs four services.

| Service | Port | URL |
|---|---:|---|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| MySQL | 3307 | localhost:3307 |
| phpMyAdmin | 8080 | http://localhost:8080 |

### Important MySQL Port Configuration

There are two different connection configurations:

**From the Windows host machine:**

```env
DB_HOST=127.0.0.1
DB_PORT=3307
```

**From the backend Docker container:**

```env
DB_HOST=db
DB_PORT=3306
```

This is because Docker Compose maps host port `3307` to MySQL's internal port `3306`.

Do not use `127.0.0.1:3307` inside the backend container.

---

## 6. Environment Configuration

The backend requires environment variables.

Create this file:

```text
backend/.env
```

Example configuration for Docker-based development:

```env
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=lendtracker

DB_CONNECTION_LIMIT=10

ADMIN_SETUP_SECRET=YOUR_RANDOM_SETUP_SECRET
```

Replace the example values with your own development credentials.

### Important

- Never upload `.env` to GitHub.
- Never share database passwords or setup secrets publicly.
- Keep `.env` in `.gitignore`.
- Each developer should create their own `.env`.
- The setup secret must match the `x-admin-setup-secret` header used in the admin setup request.

The Docker Compose backend environment must also use:

```yaml
environment:
  DB_HOST: db
  DB_PORT: 3306
  DB_USER: root
  DB_PASSWORD: YOUR_DATABASE_PASSWORD
  DB_NAME: lendtracker
```

Make sure the MySQL service uses the matching database password.

---

## 7. First-Time Setup – New Developer

### Step 1: Clone the GitHub repository

```cmd
git clone https://github.com/tarunmac29/lend-tracker-main.git
```

Open the project folder:

```cmd
cd lend-tracker-main
```

If you are using a specific development branch, switch to it:

```cmd
git checkout dashboard
```

### Step 2: Create backend environment file

Create:

```text
backend/.env
```

Add the environment configuration from Section 6.

### Step 3: Validate Docker Compose

```cmd
docker compose config
```

If there are no configuration errors, continue.

### Step 4: Build Docker images

```cmd
docker compose build
```

### Step 5: Install frontend dependencies

```cmd
docker compose run --rm --no-deps frontend npm install
```

### Step 6: Install backend dependencies

```cmd
docker compose run --rm --no-deps backend npm install
```

### Step 7: Start all services

```cmd
docker compose up -d
```

### Step 8: Check service status

```cmd
docker compose ps
```

Expected services:

- lendtracker-frontend
- lendtracker-backend
- lendtracker-mysql
- lendtracker-phpmyadmin

MySQL should show `healthy`.

---

## 8. Database Setup and Migrations

LendTrack uses MySQL and Knex.js migrations to create database tables.

Each developer has their own local database. GitHub shares migration files, not database records.

### Step 1: Confirm migration files exist

From the project root:

```cmd
dir backend\src\database\migrations
```

### Step 2: Start Docker services

```cmd
docker compose up -d
```

### Step 3: Run migrations

Run this from the project root:

```cmd
docker compose exec backend npx knex migrate:latest
```

This executes all pending migrations using the backend container's database configuration.

### Step 4: Check migration status

```cmd
docker compose exec backend npx knex migrate:status
```

### Step 5: Verify database tables

Open phpMyAdmin:

http://localhost:8080

Login using your MySQL credentials and select:

```text
Database: lendtracker
```

You should see the tables created by the migrations, such as:

- admins
- admin_sessions
- customers
- knex_migrations
- knex_migrations_lock

The exact tables depend on which migration files are present and have been executed.

### Important Migration Rules

- Every new database table should have a migration file.
- Commit and push migration files to GitHub.
- Other developers must pull the latest code and run `migrate:latest`.
- Do not manually create the same tables if migrations already manage them.
- Never delete migration history to fix an ordinary database issue.

### Create a New Migration

From the project root:

```cmd
docker compose exec backend npx knex migrate:make create_loans_table
```

This creates a new migration file in the configured migrations directory.

After writing the migration:

```cmd
docker compose exec backend npx knex migrate:latest
```

---

## 9. Admin Authentication Setup

After the database migrations have been executed, create the initial admin account.

### Admin Setup API

```http
POST http://localhost:5000/api/auth/setup
```

Headers:

| Key | Value |
|---|---|
| Content-Type | application/json |
| x-admin-setup-secret | Your ADMIN_SETUP_SECRET |

Example request body:

```json
{
  "email": "your-admin@example.com",
  "password": "YourUniqueStrongPassword123!"
}
```

Use your own email and a strong unique password. The current backend validation requires at least 10 characters.

The setup secret must match the value configured in `backend/.env`.

Do not share the setup secret or admin password.

### Login

Open the frontend:

http://localhost:5173

Enter the admin credentials created during setup.

After successful login, the application redirects to the protected dashboard.

### Authentication Checks

Test the following:

1. Valid admin login.
2. Invalid password rejection.
3. Dashboard access after login.
4. Direct dashboard URL access without login.
5. Session persistence after page refresh.
6. Logout and session invalidation.

The admin session is stored using an HTTP-only cookie.

---

## 10. Daily Development Commands

Run these commands from the project root.

### Start all services

```cmd
docker compose up -d
```

### Stop all services

```cmd
docker compose stop
```

### Restart all services

```cmd
docker compose restart
```

### Restart frontend

```cmd
docker compose restart frontend
```

### Restart backend

```cmd
docker compose restart backend
```

### Restart MySQL

```cmd
docker compose restart db
```

### Stop and remove containers

```cmd
docker compose down
```

This removes containers and the Compose network but preserves named volumes.

### Start again

```cmd
docker compose up -d
```

---

## 11. View Logs

### All services

```cmd
docker compose logs -f
```

### Frontend

```cmd
docker compose logs -f frontend
```

### Backend

```cmd
docker compose logs -f backend
```

### MySQL

```cmd
docker compose logs -f db
```

### phpMyAdmin

```cmd
docker compose logs -f phpmyadmin
```

### Last 50 backend log lines

```cmd
docker logs --tail 50 lendtracker-backend
```

### Last 100 backend log lines

```cmd
docker logs --tail 100 lendtracker-backend
```

Press `Ctrl + C` to exit live logs.

---

## 12. Hot Reload – Live Code Changes

Docker Compose mounts source directories into containers.

### Frontend

```yaml
volumes:
  - ./frontend:/app
  - frontend_node_modules:/app/node_modules
```

Vite supports live updates during development.

### Backend

```yaml
volumes:
  - ./backend:/app
  - backend_node_modules:/app/node_modules
```

Backend starts with Nodemon:

```json
"dev": "nodemon index.js"
```

### How to use

1. Open the project in VS Code.
2. Edit frontend files inside `frontend/src`.
3. Save the file.
4. Check the browser for updates.
5. Edit backend files.
6. Save the file.
7. Nodemon should restart the backend automatically.

Normal source-code changes do not require Docker image rebuilds.

---

## 13. When to Reinstall Dependencies or Rebuild

### When package.json changes

Frontend:

```cmd
docker compose run --rm --no-deps frontend npm install
```

Backend:

```cmd
docker compose run --rm --no-deps backend npm install
```

Then restart the relevant service:

```cmd
docker compose restart frontend
```

or:

```cmd
docker compose restart backend
```

### When Dockerfile changes

Rebuild frontend:

```cmd
docker compose up -d --build frontend
```

Rebuild backend:

```cmd
docker compose up -d --build backend
```

Rebuild all:

```cmd
docker compose up -d --build
```

---

## 14. MySQL Management

### Open MySQL terminal inside the container

```cmd
docker compose exec db mysql -uroot -p
```

Enter the database password when prompted.

### Select database

```sql
USE lendtracker;
```

### Show databases

```sql
SHOW DATABASES;
```

### Show tables

```sql
SHOW TABLES;
```

### Describe a table

```sql
DESCRIBE customers;
```

### Exit MySQL

```sql
EXIT;
```

### phpMyAdmin

Open:

http://localhost:8080

Use the MySQL username and password. The server should be:

```text
db
```

---

## 15. GitHub Collaboration – Working with Friends

GitHub stores the project source code and migration files. It does not automatically synchronize each developer's local MySQL database.

### Before starting work

Pull the latest branch:

```cmd
git pull origin dashboard
```

### Check current branch

```cmd
git branch
```

### Check changed files

```cmd
git status
```

### Add changes

```cmd
git add .
```

### Commit changes

```cmd
git commit -m "feat: add customer management"
```

### Push changes

```cmd
git push origin dashboard
```

### Important Team Rules

- Work on your assigned Git branch.
- Pull the latest changes before starting work.
- Do not commit `.env`.
- Commit migration files.
- Run pending migrations after pulling database changes.
- Do not overwrite another developer's changes.
- Use pull requests to merge completed features.

---

## 16. Docker Volumes and Database Persistence

The project uses named volumes:

| Volume | Purpose |
|---|---|
| mysql_data | MySQL database storage |
| frontend_node_modules | Frontend dependencies |
| backend_node_modules | Backend dependencies |

List volumes:

```cmd
docker volume ls
```

Inspect the MySQL volume:

```cmd
docker volume inspect lend-tracker-main_mysql_data
```

### Important Warning

This command deletes the project's named volumes:

```cmd
docker compose down -v
```

It can permanently delete the MySQL data stored in `mysql_data`.

**Do not run it unless you intentionally want to reset the database and have a backup.**

For normal stopping, use:

```cmd
docker compose stop
```

---

## 17. Troubleshooting

### Problem 1: Frontend is not opening

Check:

```cmd
docker compose ps
docker compose logs --tail=50 frontend
```

Restart:

```cmd
docker compose restart frontend
```

### Problem 2: Backend is not responding

Check:

```cmd
docker compose logs --tail=100 backend
```

Restart:

```cmd
docker compose restart backend
```

### Problem 3: MySQL connection refused

Check that backend Docker environment uses:

```env
DB_HOST=db
DB_PORT=3306
```

Then recreate the backend:

```cmd
docker compose up -d --force-recreate backend
```

Check logs:

```cmd
docker logs --tail 50 lendtracker-backend
```

Expected successful messages:

```text
MySQL database connected successfully!
LendTrack server running on port 5000
```

### Problem 4: Access denied for MySQL user

Check that:

- DB_USER is correct.
- DB_PASSWORD matches the MySQL configuration.
- DB_NAME is correct.
- MySQL container is healthy.

Do not share passwords in logs or screenshots.

### Problem 5: Admin setup returns Internal server error

Check backend logs immediately after sending the request:

```cmd
docker logs --tail 100 lendtracker-backend
```

Verify:

- Database migrations have been executed.
- `ADMIN_SETUP_SECRET` matches the Postman header.
- Password satisfies the current backend validation.
- Admin setup has not already been completed if the route only permits initial setup.

### Problem 6: Knex cannot connect to MySQL

For Docker-based migrations, run:

```cmd
docker compose exec backend npx knex migrate:latest
```

Do not use host machine database settings inside the backend container.

### Problem 7: Port 5000 is already in use

Check:

```cmd
netstat -ano | findstr :5000
```

If another local Node.js process is running, stop it from its own terminal with `Ctrl + C` before testing the Docker backend.

### Problem 8: Changes are not reflecting

- Save the file.
- Confirm the correct project directory is open.
- Check frontend or backend logs.
- Restart the relevant service if required.

---

## 18. Useful Commands Cheat Sheet

| Task | Command |
|---|---|
| Start project | `docker compose up -d` |
| Stop project | `docker compose stop` |
| Restart project | `docker compose restart` |
| Remove containers | `docker compose down` |
| Build images | `docker compose build` |
| Rebuild and start | `docker compose up -d --build` |
| Check services | `docker compose ps` |
| View all logs | `docker compose logs -f` |
| Backend logs | `docker logs --tail 100 lendtracker-backend` |
| Frontend logs | `docker compose logs -f frontend` |
| MySQL logs | `docker compose logs -f db` |
| Install frontend dependencies | `docker compose run --rm --no-deps frontend npm install` |
| Install backend dependencies | `docker compose run --rm --no-deps backend npm install` |
| Run migrations | `docker compose exec backend npx knex migrate:latest` |
| Check migration status | `docker compose exec backend npx knex migrate:status` |
| Open MySQL | `docker compose exec db mysql -uroot -p` |

---

## 19. Quick Start – Existing Developer

For normal daily development:

```cmd
cd path\to\lend-tracker-main

docker compose up -d

docker compose ps
```

Open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- phpMyAdmin: http://localhost:8080

When finished:

```cmd
docker compose stop
```

---

## 20. Important Development and Security Notes

- Start Docker Desktop before running the project.
- Run Docker commands from the project root.
- Use `db:3306` for backend-to-MySQL communication inside Docker.
- Use `127.0.0.1:3307` only when connecting from the Windows host.
- Keep `.env` files private.
- Do not commit real credentials to GitHub.
- Back up MySQL data regularly.
- Do not delete Docker volumes casually.
- Run migrations after pulling new database migration files.
- Use test data during development instead of real customer financial information.
- Before production deployment, implement proper authorization, input validation, audit logs, backups, secure secrets management and applicable Indian money-lending and data-protection compliance.

---

## Happy Coding!

**LendTrack Development Team**
