# Deploying Neuro-Career: Render (Backend) + Vercel (Frontend)

## 🚀 Complete Deployment Guide

### Phase 1: Deploy Backend on Render

1. **Follow RENDER_DEPLOYMENT.md** for detailed steps
2. **Key points**:
   - Root directory: `neuro-career-be`
   - Add your API keys as environment variables
   - Your backend URL will be: `https://your-app-name.onrender.com`

### Phase 2: Update Frontend for Production

1. **Update CORS in Backend** (if needed):
   ```python
   # In fastapi_server.py, replace with your actual Vercel domain:
   "https://your-actual-domain.vercel.app"
   ```

2. **Configure Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Set these for **Production**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-render-backend.onrender.com
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_USE_MOCK_RESPONSES=false
   NEXT_PUBLIC_ENABLE_TTS=true
   NEXT_PUBLIC_ENABLE_VOICE_RECORDING=true
   ```

3. **Redeploy Frontend**:
   - Trigger a new deployment on Vercel (push to main branch or manual deploy)

### Phase 3: Testing Full Stack

1. **Test Backend Endpoints**:
   - `GET https://your-render-backend.onrender.com/` → "AI Career Assessment API"
   - `GET https://your-render-backend.onrender.com/health` → Health status

2. **Test Frontend**:
   - Visit your Vercel app
   - Try the assessment page
   - Check browser console for any CORS errors

## 🔧 Important Configuration Notes

### Render (Backend):
- ✅ Free tier: 750 hours/month
- ✅ Auto-sleep after 15 min inactivity
- ✅ Cold start: ~1 minute after sleep
- ✅ Build time: 10-15 minutes

### Vercel (Frontend):
- ✅ Free tier: Generous limits
- ✅ Instant deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

### CORS Security:
- ✅ Remove `"*"` from CORS origins
- ✅ Add your exact Vercel domain
- ✅ Keep `"https://*.vercel.app"` for preview deployments

## 🐛 Common Issues & Solutions

### Backend Issues:
- **Build fails**: Check `requirements.txt` and `runtime.txt`
- **App won't start**: Verify Procfile and environment variables
- **API keys not working**: Double-check env vars in Render dashboard

### Frontend Issues:
- **CORS errors**: Update backend CORS with your exact Vercel domain
- **API calls failing**: Verify `NEXT_PUBLIC_API_BASE_URL` in Vercel env vars
- **Features not working**: Ensure demo mode is disabled

### Performance Issues:
- **Slow first request**: Normal for Render free tier (cold start)
- **Request timeouts**: Consider upgrading Render to paid plan

## 📋 Deployment Checklist

### Backend (Render):
- [ ] Repository connected to Render
- [ ] Root directory set to `neuro-career-be`
- [ ] Environment variables added (3 API keys)
- [ ] App deployed and accessible
- [ ] Health endpoint working

### Frontend (Vercel):
- [ ] Environment variables updated for production
- [ ] Demo mode disabled
- [ ] API base URL points to Render backend
- [ ] CORS configured for your Vercel domain
- [ ] App redeployed with new env vars

### Testing:
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Assessment flow works end-to-end
- [ ] TTS functionality works
- [ ] No CORS errors in browser console

## 🚨 Security Reminders

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Update CORS origins** - never use "*" in production
4. **Keep your dependencies updated** for security patches

Your app is now ready for production use! 🎉