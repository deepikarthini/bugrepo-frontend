# BugRepo Free Deployment Guide

This guide deploys BugRepo with free services:
- Frontend: Vercel (free)
- Backend: Render (free)
- Database: Neon Postgres (free)

## 1. Prepare Repositories

1. Keep frontend and backend as separate GitHub repos.
2. Frontend repo: this React project.
3. Backend repo: Spring Boot project in your other folder.

## 2. Create Free Postgres (Neon)

1. Sign in to Neon.
2. Create a new project/database.
3. Copy database values:
- host
- database
- username
- password
- JDBC URL

## 3. Deploy Backend on Render

1. In Render, create a Web Service from backend GitHub repo.
2. Use:
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/*.jar`
3. Add environment variables in Render:
- `SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database>?sslmode=require`
- `SPRING_DATASOURCE_USERNAME=<username>`
- `SPRING_DATASOURCE_PASSWORD=<password>`
- `JWT_SECRET=<long-random-secret>`
4. Deploy and copy backend URL, for example:
- `https://bugrepo-api.onrender.com`

## 4. Deploy Frontend on Vercel

1. In Vercel, import frontend GitHub repo.
2. Framework preset: Create React App.
3. Build command: `npm run build`
4. Output directory: `build`
5. Add env variable:
- `REACT_APP_API_URL=https://bugrepo-api.onrender.com/api`
6. Deploy and copy frontend URL, for example:
- `https://bugrepo.vercel.app`

## 5. Configure CORS in Backend

Backend now allows:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://*.vercel.app`

If you later use a custom domain, add that origin in backend CORS too.

## 6. Verify End-to-End

1. Open frontend URL.
2. Register or login.
3. Create a bug and verify data is stored.
4. Check backend logs in Render if any API call fails.

## 7. Optional SEO Basics

1. Keep your app title and description updated (already changed to BugRepo in frontend).
2. Add Google Search Console property for your deployed URL.
3. Submit indexing request.

## Notes About Free Tier

1. Render free services can sleep after inactivity.
2. First API request after sleep may take 30-60 seconds.
3. `bugrepo.com` is not free; free URL is usually `bugrepo.vercel.app`.
