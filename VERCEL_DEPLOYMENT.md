# Vercel Deployment Guide

## 🚀 Frontend-Only Deployment (Current Setup)

This project is configured to deploy as a **frontend-only demo** on Vercel without requiring a backend.

### ✅ What Works in Demo Mode:

- ✅ **Interactive UI**: Full Next.js application with all pages
- ✅ **AI Chat Simulation**: Pre-written conversational responses
- ✅ **Text-to-Speech**: Browser-based speech synthesis
- ✅ **3D Brain Visualization**: Full Three.js brain model
- ✅ **Responsive Design**: Works on all devices
- ✅ **Career Assessment Flow**: Complete user journey simulation

### 🔧 Vercel Environment Variables

Set these in your Vercel project settings:

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_USE_MOCK_RESPONSES=true
NEXT_PUBLIC_ENABLE_TTS=true
NEXT_PUBLIC_ENABLE_VOICE_RECORDING=false
```

### 📝 Deployment Steps:

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Set Environment Variables**: Add the variables above in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy
4. **Build Command**: `pnpm build` (auto-detected)
5. **Output Directory**: `.next` (auto-detected)

### 🎯 Demo Features:

- **Conversational AI**: 7 pre-written responses that simulate a career assessment
- **Speech Synthesis**: Uses browser's built-in TTS (works on all modern browsers)
- **Visual Feedback**: Demo mode banner shows users it's a demonstration
- **Responsive**: Optimized for mobile, tablet, and desktop

### 🔄 Switching to Full Mode (Optional):

To deploy with a real backend later:

1. Deploy your FastAPI backend to Railway/Render/Heroku
2. Update Vercel environment variables:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_USE_MOCK_RESPONSES=false
   NEXT_PUBLIC_ENABLE_VOICE_RECORDING=true
   ```

### 📊 Performance:

- **Build Time**: ~2-3 minutes
- **Bundle Size**: 331 KB total (optimized)
- **Static Generation**: All pages pre-rendered
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)

### 🐛 Troubleshooting:

**Build Fails**: 
- Check that `pnpm-lock.yaml` is up to date
- Ensure all environment variables are set

**TTS Not Working**:
- Demo mode uses browser TTS (requires user interaction first)
- Check browser compatibility (works on Chrome, Firefox, Safari, Edge)

**Blank Page**:
- Check browser console for JavaScript errors
- Verify all environment variables are properly set