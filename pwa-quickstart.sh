#!/bin/bash
# PWA Quick Start Script
# This helps get your PWA up and running quickly

echo "🚀 Gramin Bank PWA Quick Start"
echo "==============================\n"

# Step 1: Build
echo "📦 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!\n"
else
    echo "❌ Build failed. Check errors above.\n"
    exit 1
fi

# Step 2: Preview
echo "🔍 Previewing PWA locally..."
echo "📍 Open http://localhost:4173 in your browser\n"
npm run preview

# Step 3: Instructions
echo "
✅ PWA is now running locally!

📋 Testing Checklist:
  1. Check DevTools > Application > Service Workers
  2. Check DevTools > Application > Manifest
  3. Look for 'Install' button in Chrome address bar
  4. Go offline (Ctrl+Shift+Delete) and test
  5. Install the app and test offline functionality

📱 To test on mobile:
  1. Get your machine IP: ipconfig
  2. Open http://<your-ip>:4173 on mobile
  3. Install the app

🎯 Before deploying to Vercel:
  1. Add icons to public/ folder
  2. Update public/manifest.json if needed
  3. Test all features locally
  4. Run: git add . && git commit -m 'feat: Add PWA' && git push

📚 Documentation: See PWA_SETUP.md for detailed guide
"
