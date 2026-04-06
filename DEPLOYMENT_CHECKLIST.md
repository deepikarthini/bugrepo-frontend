# 🚀 Quick Deployment Checklist

## ✅ Step-by-Step Deployment

### Before You Start
- [ ] Create accounts on GitHub, Vercel, and Render
- [ ] Install Git on your computer

---

## 🔧 PART 1: Backend Deployment (15-20 minutes)

### 1. Prepare Backend
```powershell
cd "c:\Users\kadeepik\OneDrive - Cisco\Spring\demo"
```

- [ ] Copy `BACKEND_DOCKERFILE` → rename to `Dockerfile` (no extension) in backend folder
- [ ] Copy `BACKEND_CORS_CONFIG.java` → Add to `src/main/java/com/example/demo/config/CorsConfig.java`
- [ ] Update `application.properties`:
  ```properties
  server.port=${PORT:8080}
  ```

### 2. Push Backend to GitHub
```powershell
git init
git add .
git commit -m "Initial commit - Backend"
```

- [ ] Create new repository on GitHub: `bug-reproduction-backend`
- [ ] Copy the GitHub URL

```powershell
git remote add origin https://github.com/YOUR_USERNAME/bug-reproduction-backend.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Render
- [ ] Go to render.com → "New +" → "Web Service"
- [ ] Connect your `bug-reproduction-backend` repository
- [ ] Configure:
  - Name: `bug-reproduction-backend`
  - Environment: `Docker`
  - Build Command: (leave empty, Docker handles it)
  - Start Command: (leave empty, Docker handles it)
  - Plan: **Free**
- [ ] Click "Create Web Service"
- [ ] Wait 10 minutes for deployment
- [ ] **COPY YOUR BACKEND URL**: `https://bug-reproduction-backend.onrender.com`

---

## 🎨 PART 2: Frontend Deployment (10 minutes)

### 1. Update Frontend Configuration
```powershell
cd "c:\Users\kadeepik\OneDrive - Cisco\Spring\Bugreproduction for QA"
```

- [ ] Open `.env.production` file
- [ ] Replace with your actual backend URL:
  ```
  REACT_APP_API_URL=https://bug-reproduction-backend.onrender.com/api
  ```

### 2. Test Build Locally (Optional but Recommended)
```powershell
npm run build
```
- [ ] Verify build succeeds without errors

### 3. Push Frontend to GitHub
```powershell
git init
git add .
git commit -m "Initial commit - Frontend"
```

- [ ] Create new repository on GitHub: `bug-reproduction-frontend`
- [ ] Copy the GitHub URL

```powershell
git remote add origin https://github.com/YOUR_USERNAME/bug-reproduction-frontend.git
git branch -M main
git push -u origin main
```

### 4. Deploy on Vercel
- [ ] Go to vercel.com → "Add New..." → "Project"
- [ ] Import your `bug-reproduction-frontend` repository
- [ ] Configure:
  - Framework: Create React App
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Install Command: `npm install`
- [ ] Add Environment Variable:
  - Key: `REACT_APP_API_URL`
  - Value: `https://bug-reproduction-backend.onrender.com/api`
- [ ] Click "Deploy"
- [ ] Wait 3 minutes
- [ ] **YOUR APP IS LIVE!** 🎉

---

## 🌐 PART 3: Share Your App

Your app will be available at:
```
https://bug-reproduction-frontend.vercel.app
```

or Vercel will give you a custom URL like:
```
https://bugreproduction-for-qa.vercel.app
```

---

## 🔄 Making Updates After Deployment

### To update your app in the future:

**Frontend Updates:**
```powershell
cd "c:\Users\kadeepik\OneDrive - Cisco\Spring\Bugreproduction for QA"
git add .
git commit -m "Your update message"
git push
```
↳ Vercel will **automatically redeploy** in 1-2 minutes!

**Backend Updates:**
```powershell
cd "c:\Users\kadeepik\OneDrive - Cisco\Spring\demo"
git add .
git commit -m "Your update message"
git push
```
↳ Render will **automatically redeploy** in 5-10 minutes!

---

## ⚠️ Important Notes

1. **First Load:** Backend takes 30-60 seconds on first request (free tier sleeps)
2. **CORS:** Make sure backend CORS is configured correctly
3. **Environment Variables:** Always use HTTPS URLs in production
4. **Testing:** Test thoroughly after deployment

---

## 🆘 Troubleshooting

### "Address already in use" error (Port 8080):
```powershell
# Run as Administrator:
netstat -ano | findstr :8080
taskkill /F /PID <PID_NUMBER>
```

### Can't connect to backend:
- Check backend is running on Render dashboard
- Verify `.env.production` has correct backend URL
- Check browser console for CORS errors

### Build fails:
- Run `npm run build` locally first
- Check all dependencies are in `package.json`
- Clear cache: `npm cache clean --force`

---

## 📋 Summary

✅ Backend on Render: `https://bug-reproduction-backend.onrender.com`
✅ Frontend on Vercel: `https://bug-reproduction-frontend.vercel.app`
✅ Share with your QA team!
✅ Auto-deploy on every git push!

---

**Total Time: ~30 minutes**
**Cost: $0 (100% FREE!)**

🎉 Congratulations! Your app is now live and accessible to everyone!
