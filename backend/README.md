Backend setup
1. Configure MySQL and create database:

```sql
CREATE DATABASE gymdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Edit `src/main/resources/application.properties` and set `spring.datasource.username` and `spring.datasource.password`.
3. Build and run:

```bash
cd backend
mvn spring-boot:run
```

The backend exposes a simple REST API at `/api/members`.
 
Static frontend
---------------
A polished frontend is included under `src/main/resources/static/`. To use it:

- Copy your images:
  - `C:\Users\DELL\Downloads\GYM iamge.jpg` → `backend/src/main/resources/static/assets/gym-image.jpg`
  - `C:\Users\DELL\Downloads\logo gym.jpg` → `backend/src/main/resources/static/assets/logo-gym.jpg`

- Start the backend:
  - `mvn spring-boot:run`

- Open `http://localhost:8080/` to view the site (index served from `static/index.html`).
