# Free Deployment Guide for Fifty Villagers

**For:** Low-traffic applications with $0 budget  
**Stack:** Node.js + PostgreSQL + React

---

## Recommended Free Hosting Stack

| Service | What | Free Tier |
|---------|------|-----------|
| **Render** | Backend | 750 hrs/month (sleeps after 15 min inactivity) |
| **Neon** | PostgreSQL | 0.5 GB storage, 3 GB data transfer |
| **Vercel** | Frontend | Unlimited static hosting, 100 GB bandwidth |
| **Cloudinary** | Images | 25 GB storage, 25 GB bandwidth |

**Total Cost: $0/month**

---

## Step-by-Step Deployment

### 1. Database (Neon - Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create account → New Project
3. Copy connection string:
   ```
   postgres://user:password@ep-xxx.region.neon.tech/neondb?sslmode=require
   ```
4. Run your migrations:
   ```bash
   psql "your-connection-string" -f server/migrations/001_initial_schema.sql
   ```

---

### 2. Backend (Render - Free Node.js)

1. Go to [render.com](https://render.com)
2. Connect GitHub → Select your repo
3. Create **Web Service**:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   ```
   PORT=10000
   NODE_ENV=production
   DATABASE_URL=<neon-connection-string>
   JWT_SECRET=<generate-32-char-secret>
   FRONTEND_ORIGIN=https://your-app.vercel.app
   STORAGE_DRIVER=local
   UPLOAD_DIR=uploads
   BASE_URL=https://your-app.onrender.com
   ```

> ⚠️ **Note:** Free tier sleeps after 15 min. First request takes ~30s to wake up.

---

### 3. Frontend (Vercel - Free React Hosting)

1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub → Select repo
3. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```

---

### 4. Image Storage (Optional: Cloudinary)

If you need reliable image hosting:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials
3. Update `server/.env`:
   ```
   STORAGE_DRIVER=cloudinary
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```

---

## Alternative Platforms

| Platform | Pros | Cons |
|----------|------|------|
| **Railway** | $5 free credit, no sleep | Credit expires |
| **Fly.io** | 3 shared VMs free | Complex setup |
| **Cyclic** | No cold starts | Limited features |
| **Supabase** | Postgres + Auth | 500 MB limit |

---

## Quick Deployment Checklist

```
[ ] Create Neon database
[ ] Run migrations
[ ] Deploy backend to Render
[ ] Set all env variables
[ ] Deploy frontend to Vercel
[ ] Set VITE_API_URL
[ ] Test /health endpoint
[ ] Test login/register
[ ] Test file uploads
```

---

## Monitoring (Free)

| Tool | Purpose |
|------|---------|
| **UptimeRobot** | Ping every 5 min (keeps Render awake!) |
| **Sentry** | Error tracking (10k events/month free) |
| **Render Logs** | Built-in logging |

---

## Production Tips

1. **Keep Render Awake:** Use UptimeRobot to ping `/health` every 5 minutes
2. **Secure Secrets:** Never commit `.env` files
3. **Enable HTTPS:** Automatic on Vercel/Render
4. **Database Backups:** Neon has automatic PIT recovery

---

## Sample .env for Production

```env
# Server
PORT=10000
NODE_ENV=production

# Database (Neon)
DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require

# Auth
JWT_SECRET=your-super-secret-32-character-key

# CORS
FRONTEND_ORIGIN=https://fifty-villagers.vercel.app

# Uploads
STORAGE_DRIVER=local
UPLOAD_DIR=uploads
BASE_URL=https://fifty-villagers.onrender.com
MAX_UPLOAD_MB=5

# Razorpay (Test Keys for now)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

---

## Estimated Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Backend requests | ~75,000/month |
| Database storage | 500 MB |
| Database compute | 100 hrs/month |
| Frontend bandwidth | 100 GB/month |
| File uploads | ~1 GB (local on Render) |

> **Good for:** ~500-1000 active users/month

---

*Last Updated: December 2025*
