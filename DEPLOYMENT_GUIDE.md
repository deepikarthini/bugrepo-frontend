# 🚀 Deployment Guide: Bug Reproduction Recorder for QA Team

## Overview
This guide will help you deploy your full-stack application (React + Spring Boot) to free hosting services so anyone can access it online.

---

## 📋 Prerequisites

1. **Git/GitHub Account** - Create a free account at [github.com](https://github.com)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (use your GitHub account)
3. **Render Account** - Sign up at [render.com](https://render.com) (use your GitHub account)

---

## Part 1: Prepare Your Backend (Spring Boot) for Deployment

### Step 1.1: Update Spring Boot Configuration

Navigate to your backend project: `c:\Users\kadeepik\OneDrive - Cisco\Spring\demo`

1. **Update `application.properties` or `application.yml`:**

```properties
# Server Configuration
server.port=${PORT:8080}

# CORS Configuration (IMPORTANT!)
# Replace YOUR_FRONTEND_URL with your actual Vercel URL after deployment
spring.web.cors.allowed-origins=https://YOUR_FRONTEND_URL.vercel.app
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

2. **Add CORS Configuration Class** (if not already present):

Create `CorsConfig.java` in your backend:

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Step 1.2: Create Dockerfile for Backend

Create a `Dockerfile` in your backend root directory:

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 1.3: Push Backend to GitHub

```powershell
# Navigate to your backend directory
cd "c:\Users\kadeepik\OneDrive - Cisco\Spring\demo"

# Initialize git (if not already done)
git init

# Create .gitignore
echo "target/
.idea/
*.iml
.env" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Bug Reproduction Backend"

# Create a new repository on GitHub (do this on github.com)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/bug-reproduction-backend.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Render

### Step 2.1: Deploy on Render

1. Go to [render.com](https://render.com) and log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (bug-reproduction-backend)
4. Configure the service:
   - **Name:** `bug-reproduction-backend`
   - **Environment:** `Java`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/*.jar`
   - **Plan:** Select **Free**
   - **Environment Variables:** Add if needed (e.g., database URLs)

5. Click **"Create Web Service"**

6. Wait for deployment (5-10 minutes)

7. **Copy your backend URL:** `https://bug-reproduction-backend.onrender.com`

> ⚠️ **Note:** Free tier on Render spins down after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Part 3: Prepare Frontend for Deployment

### Step 3.1: Update Environment Variables

1. Create `.env.production` in your frontend root:

```env
REACT_APP_API_URL=https://bug-reproduction-backend.onrender.com/api
```

### Step 3.2: Update package.json

Ensure you have a build script:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

### Step 3.3: Push Frontend to GitHub

```powershell
# Navigate to your frontend directory
cd "c:\Users\kadeepik\OneDrive - Cisco\Spring\Bugreproduction for QA"

# Initialize git (if not already done)
git init

# Create .gitignore
echo "node_modules/
.env
.env.local
build/" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Bug Reproduction Frontend"

# Create a new repository on GitHub (do this on github.com)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/bug-reproduction-frontend.git
git branch -M main
git push -u origin main
```

---

## Part 4: Deploy Frontend to Vercel

### Step 4.1: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (bug-reproduction-frontend)
4. Configure the project:
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variables:** Add:
     - Key: `REACT_APP_API_URL`
     - Value: `https://bug-reproduction-backend.onrender.com/api`

5. Click **"Deploy"**

6. Wait for deployment (2-3 minutes)

7. **Your app is live!** You'll get a URL like:
   - `https://bug-reproduction-frontend.vercel.app`

---

## Part 5: Final Configuration

### Step 5.1: Update Backend CORS

Go back to your backend `application.properties` and update:

```properties
spring.web.cors.allowed-origins=https://bug-reproduction-frontend.vercel.app
```

Commit and push this change - Render will auto-deploy.

### Step 5.2: Add Custom Domain (Optional)

#### On Vercel:
1. Go to your project → Settings → Domains
2. Add a custom domain like `bug-recorder-qa.vercel.app` or your own domain

---

## 🎉 Your App is Live!

Share this URL with your team:
**https://bug-reproduction-frontend.vercel.app**

---

## 📊 Free Tier Limits

| Service | Limits |
|---------|--------|
| **Vercel** | Unlimited deployments, 100GB bandwidth/month |
| **Render** | 750 hours/month (enough for 1 service), sleeps after 15 min inactivity |

---

## 🔧 Troubleshooting

### Frontend can't connect to backend:
- Check backend URL in Vercel environment variables
- Verify CORS configuration in backend
- Check Render logs for backend errors

### Backend takes long to respond:
- Free tier sleeps after 15 minutes
- First request takes 30-60 seconds to wake up
- Consider upgrading to paid tier for production use

### Build fails:
- Check build logs in Vercel/Render dashboard
- Ensure all dependencies are in package.json/pom.xml
- Test build locally first: `npm run build`

---

## 🚀 Alternative Free Hosting Options

### For Backend:
- **Railway** - railway.app (500 hours free)
- **Fly.io** - fly.io (3 VMs free)
- **Cyclic** - cyclic.sh (Node.js only)

### For Frontend:
- **Netlify** - netlify.com (similar to Vercel)
- **GitHub Pages** - pages.github.com (static sites only)
- **Cloudflare Pages** - pages.cloudflare.com

---

## 📝 Next Steps After Deployment

1. ✅ Test all features on live site
2. ✅ Share URL with QA team
3. ✅ Set up custom domain (optional)
4. ✅ Monitor usage in Vercel/Render dashboards
5. ✅ Consider upgrading to paid tiers for production
6. ✅ Set up CI/CD for automatic deployments

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- React Deployment: https://create-react-app.dev/docs/deployment

---

**Created for:** Bug Reproduction Recorder for QA Team
**Last Updated:** March 30, 2026
