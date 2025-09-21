# Neuro Career - Favicon and Icon Instructions

## 🎨 Required Icon Files

To complete the favicon setup, you need to create and add these icon files to the `/public` folder:

### Required Files:
- `favicon.ico` - 16x16, 32x32, 48x48 (multi-size ICO file)
- `favicon-16x16.png` - 16x16 pixels
- `favicon-32x32.png` - 32x32 pixels
- `apple-touch-icon.png` - 180x180 pixels (iOS home screen)
- `android-chrome-192x192.png` - 192x192 pixels (Android)
- `android-chrome-512x512.png` - 512x512 pixels (Android)
- `og-image.png` - 1200x630 pixels (Open Graph/social sharing)

### Optional Enhancement Files:
- `screenshot-wide.png` - 1280x720 pixels (PWA store screenshot)
- `screenshot-narrow.png` - 390x844 pixels (PWA mobile screenshot)

## 🛠️ How to Create Icons

### Option 1: Use Your Existing Logo
Since you have `placeholder-logo.png` and `placeholder-logo.svg`, you can:
1. Use an online favicon generator like:
   - https://favicon.io/favicon-converter/
   - https://realfavicongenerator.net/
2. Upload your logo and download all required sizes

### Option 2: Simple Favicon Generator
```bash
# If you have ImageMagick installed
convert placeholder-logo.png -resize 32x32 favicon-32x32.png
convert placeholder-logo.png -resize 16x16 favicon-16x16.png
convert placeholder-logo.png -resize 180x180 apple-touch-icon.png
convert placeholder-logo.png -resize 192x192 android-chrome-192x192.png
convert placeholder-logo.png -resize 512x512 android-chrome-512x512.png
```

### Option 3: Create a Simple Brain Icon
For a quick placeholder, create a simple brain/neuron icon that matches your theme:
- Dark background (#0D0D0D)
- Neon blue accent (#00D4FF)
- Simple brain or circuit pattern

## 📱 Current Setup Status
- ✅ Metadata configured with Open Graph and Twitter cards
- ✅ Web app manifest created
- ✅ Icon references added to layout
- ⏳ **Need to add actual icon files**

## 🚀 After Adding Icons
1. Add the icon files to `/public/`
2. Test the favicon appears in browser tabs
3. Test Open Graph preview on social media
4. Verify PWA install prompt works

## 🔍 Quick Test
After adding icons, test by:
1. Opening your site in a new tab
2. Checking if favicon appears in the browser tab
3. Sharing the URL on social media to see Open Graph preview
4. Using browser dev tools to verify all icons load correctly