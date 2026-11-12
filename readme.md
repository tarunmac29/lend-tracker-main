# LendTracker

A Docker-based web application project using React, Vite, Node.js, Express, and MySQL.

This README explains how to install, configure, run, stop, restart, and manage the complete LendTracker project.

---

## 1. Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Vite | Frontend development server |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MySQL 8.0 | Database |
| Docker | Containerization |
| Docker Compose | Managing multiple containers |
| phpMyAdmin | MySQL GUI |

---

## 2. Project Structure

```text
lend-tracker-main/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 3. Prerequisites

Install the following software:

1. Docker Desktop
2. Visual Studio Code
3. Git (optional)

Make sure Docker Desktop is running before executing Docker commands.

Verify installation:

```cmd
docker --version
```

```cmd
docker compose version
```

---

## 4. Docker Services

The project runs four services:

| Service | Port | Purpose |
|---|---:|---|
| Frontend | 5173 | React application |
| Backend | 5000 | Express API |
| MySQL | 3307 | Database |
| phpMyAdmin | 8080 | Database GUI |

### Access URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- phpMyAdmin: http://localhost:8080

---

## 5. Database Configuration

MySQL configuration:

| Setting | Value |
|---|---|
| Database | lendtracker |
| Username | root |
| Password | root123 |
| Host from Docker containers | db |
| Internal MySQL port | 3306 |
| Host machine port | 3307 |

### phpMyAdmin Login

Open:

http://localhost:8080

Login credentials:

```text
Username: root
Password: root123
Server: db
```

Select the `lendtracker` database to manage tables and records.

---

## 6. First-Time Project Setup

### Step 1: Open project folder

Open CMD or PowerShell and navigate to the project directory.

```cmd
cd C:\Users\R.pc\Desktop\lend-tracker-main
```

### Step 2: Check Docker Compose configuration

```cmd
docker compose config
```

This command validates the Docker Compose YAML configuration.

### Step 3: Build Docker images

```cmd
docker compose build
```

This builds the frontend and backend Docker images.

### Step 4: Install frontend dependencies

```cmd
docker compose run --rm --no-deps frontend npm install
```

### Step 5: Install backend dependencies

```cmd
docker compose run --rm --no-deps backend npm install
```

These commands install dependencies into their respective persistent Docker volumes.

### Step 6: Start all services

```cmd
docker compose up -d
```

### Step 7: Verify containers

```cmd
docker compose ps
```

All four services should be running. MySQL should show `healthy`.

---

## 7. Daily Commands

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

### Restart only frontend

```cmd
docker compose restart frontend
```

### Restart only backend

```cmd
docker compose restart backend
```

### Restart only MySQL

```cmd
docker compose restart db
```

### Stop and remove containers

```cmd
docker compose down
```

Important: `docker compose down` does not delete the named MySQL data volume.

### Start again after stopping

```cmd
docker compose up -d
```

---

## 8. View Logs

### All services

```cmd
docker compose logs
```

### Live logs

```cmd
docker compose logs -f
```

### Frontend logs

```cmd
docker compose logs -f frontend
```

### Backend logs

```cmd
docker compose logs -f backend
```

### MySQL logs

```cmd
docker compose logs -f db
```

### phpMyAdmin logs

```cmd
docker compose logs -f phpmyadmin
```

### Last 50 log lines

```cmd
docker compose logs --tail=50
```

Press `Ctrl + C` to exit live logs.

---

## 9. Hot Reload – Live Code Changes

The project uses Docker volume mounting for development.

This allows developers to edit files in VS Code without rebuilding Docker images for every code change.

### Frontend

Frontend files are mounted using:

```yaml
volumes:
  - ./frontend:/app
  - frontend_node_modules:/app/node_modules
```

Vite polling is enabled in `frontend/vite.config.js`:

```javascript
server: {
  host: '0.0.0.0',
  watch: {
    usePolling: true,
    interval: 1000,
  },
}
```

### Backend

Backend files are mounted using:

```yaml
volumes:
  - ./backend:/app
  - backend_node_modules:/app/node_modules
```

Backend runs using Nodemon:

```json
"dev": "nodemon index.js"
```

### How to use

1. Open the project in VS Code.
2. Edit React files inside `frontend/src`.
3. Save the file.
4. The browser should automatically update.
5. Edit backend files inside `backend`.
6. Save the file.
7. Nodemon automatically restarts the backend.

**No Docker rebuild is required for normal source-code changes.**

---

## 10. When Is Docker Rebuild Required?

Rebuild Docker images when:

- Dockerfile changes.
- Node.js base image changes.
- Docker build configuration changes.
- You need to rebuild an image after changing its build-time setup.

For package dependency changes:

```cmd
docker compose run --rm --no-deps frontend npm install
```

```cmd
docker compose run --rm --no-deps backend npm install
```

Then restart the services:

```cmd
docker compose up -d
```

If a Dockerfile changes, rebuild the relevant service:

```cmd
docker compose up -d --build frontend
```

Or:

```cmd
docker compose up -d --build backend
```

For all services:

```cmd
docker compose up -d --build
```

---

## 11. MySQL Database Management

### Connect to MySQL from Docker

```cmd
docker compose exec db mysql -uroot -proot123
```

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

### Exit MySQL

```sql
EXIT;
```

### Access through phpMyAdmin

Open:

http://localhost:8080

Use phpMyAdmin to:

- Create databases.
- Create tables.
- Insert records.
- Update records.
- Delete records.
- Execute SQL queries.
- Import and export SQL files.

---

## 12. Check Container Status

```cmd
docker compose ps
```

Show all containers, including stopped containers:

```cmd
docker compose ps -a
```

Show Docker containers:

```cmd
docker ps
```

Show all containers:

```cmd
docker ps -a
```

---

## 13. Troubleshooting

### Problem 1: localhost:5173 is not opening

Check frontend logs:

```cmd
docker compose logs --tail=50 frontend
```

Restart frontend:

```cmd
docker compose restart frontend
```

### Problem 2: vite: not found

Install frontend dependencies:

```cmd
docker compose run --rm --no-deps frontend npm install
```

Then:

```cmd
docker compose up -d frontend
```

### Problem 3: nodemon: not found

Install backend dependencies:

```cmd
docker compose run --rm --no-deps backend npm install
```

Then:

```cmd
docker compose up -d backend
```

### Problem 4: Backend is not responding

Check logs:

```cmd
docker compose logs --tail=50 backend
```

Restart:

```cmd
docker compose restart backend
```

### Problem 5: MySQL is not healthy

Check logs:

```cmd
docker compose logs db
```

Check status:

```cmd
docker compose ps
```

### Problem 6: Changes are not reflecting in browser

1. Save the file in VS Code.
2. Confirm the correct project folder is open.
3. Check Vite polling configuration.
4. Check frontend logs.
5. Restart frontend if required:

```cmd
docker compose restart frontend
```

---

## 14. Docker Volumes

The project uses persistent volumes:

| Volume | Purpose |
|---|---|
| mysql_data | MySQL database storage |
| frontend_node_modules | Frontend dependencies |
| backend_node_modules | Backend dependencies |

List Docker volumes:

```cmd
docker volume ls
```

Inspect a volume:

```cmd
docker volume inspect lend-tracker-main_mysql_data
```

**Important:** Do not run the following command unless you intentionally want to delete all project Docker volume data:

```cmd
docker compose down -v
```

This can permanently delete the MySQL database stored in `mysql_data`, along with the dependency volumes.

---

## 15. Useful Commands Cheat Sheet

| Task | Command |
|---|---|
| Start project | `docker compose up -d` |
| Stop project | `docker compose stop` |
| Restart project | `docker compose restart` |
| Remove containers | `docker compose down` |
| Build images | `docker compose build` |
| Rebuild and start | `docker compose up -d --build` |
| Check status | `docker compose ps` |
| All logs | `docker compose logs -f` |
| Frontend logs | `docker compose logs -f frontend` |
| Backend logs | `docker compose logs -f backend` |
| MySQL logs | `docker compose logs -f db` |
| Install frontend packages | `docker compose run --rm --no-deps frontend npm install` |
| Install backend packages | `docker compose run --rm --no-deps backend npm install` |

---

## 16. Important Development Notes

- Always start Docker Desktop before running the project.
- Run Docker commands from the project root directory.
- Use `docker compose up -d` for normal daily startup.
- Do not rebuild images for normal React or backend source-code changes.
- Use phpMyAdmin to manage MySQL visually.
- Do not delete the MySQL volume unless you intentionally want to reset the database.
- Keep Docker Compose configuration consistent across team members.
- The current backend root route is a basic Express test endpoint. Database integration and application APIs must be implemented separately.

---

## 17. Quick Start for Existing Setup

For normal daily development, only these commands are needed:

```cmd
cd C:\Users\R.pc\Desktop\lend-tracker-main

docker compose up -d

docker compose ps
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- phpMyAdmin: http://localhost:8080

When finished:

```cmd
docker compose stop
```

---

**Happy Coding!**

LendTracker Development Team
