# Zero-Cost Production Deployment Guide
## Coimbatore Smart City Digital Twin

This guide explains how to deploy the entire digital twin platform to zero-cost cloud services (Render + Vercel) in under 10 minutes.

---

### Step 1: Deploy Backend & Database on Render
1. Create a free account at [render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository (`project.git`).
4. Render will detect `render.yaml` and provision:
   - A free managed PostgreSQL database (`coimbatore-twin-db`).
   - A free Web Service (`coimbatore-twin-backend`) running FastAPI.
5. Once built, note your backend public URL (e.g., `https://coimbatore-twin-backend.onrender.com`).

---

### Step 2: Deploy Frontend on Vercel
1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** and select your GitHub repository.
3. Configure the project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Update `frontend/vercel.json` with your actual Render backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://coimbatore-twin-backend.onrender.com/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
5. Click **Deploy**. Within 60 seconds, your command center will be live at `https://your-project.vercel.app`.

---

### Step 3: Local Single-Command Run
To run the full stack locally:
```bash
# Terminal 1: Backend
python -m uvicorn backend.app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```
Open `http://localhost:5173` to interact with the Command Center.
