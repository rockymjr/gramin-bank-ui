# PWA Setup Guide for Gramin Bank

## Overview
Your Gramin Bank React application has been configured as a Progressive Web App (PWA) with offline capabilities, caching strategies, and installability.

## What Was Added

### 1. **Service Worker**
- Located at: `public/sw.js`
- Implements Network-First caching strategy for better performance
- API requests are cached but prioritize fresh data
- Automatic cache cleanup and updates

### 2. **Manifest File**
- Located at: `public/manifest.json`
- Defines app metadata, icons, and display properties
- Enables "Add to Home Screen" functionality
- Includes app shortcuts and categories

### 3. **PWA Utilities**
- Located at: `src/utils/pwaUtils.js`
- Functions for service worker registration
- Notification permission management
- Install prompt handling
- PWA mode detection

### 4. **Configuration Updates**
- **vite.config.js**: Added VitePWA plugin with workbox integration
- **index.html**: Added PWA meta tags and manifest link
- **main.jsx**: Service worker registration
- **vercel.json**: Cache headers and service worker configuration

## Key Features

✅ **Offline Support**: Works without internet connection
✅ **Fast Loading**: Assets are cached and served instantly
✅ **Installable**: Users can install as app on home screen
✅ **Auto-Updates**: Service worker checks for updates periodically
✅ **Smart Caching**: Different strategies for APIs vs static assets
✅ **Push Notifications**: Ready for push notification support

## How to Add Icons

You need to add app icons to the `public/` folder:

1. **192x192 icon**: `public/icon-192x192.png`
2. **512x512 icon**: `public/icon-512x512.png`
3. **Maskable icons** (for adaptive icons):
   - `public/icon-192x192-maskable.png`
   - `public/icon-512x512-maskable.png`
4. **Screenshots**:
   - `public/screenshot-540x720.png` (narrow form factor)
   - `public/screenshot-1280x720.png` (wide form factor)

### Using Icon Generator
```bash
# Use this online tool to generate icons:
# https://www.pwabuilder.com/imageGenerator
```

**Icon Requirements:**
- Square format (192x192, 512x512)
- PNG format with transparency
- For maskable icons: leave safe zone (10-20% padding from edges)

## Testing PWA Locally

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Then open http://localhost:4173 in your browser and:
1. Check DevTools > Application > Manifest
2. Check DevTools > Application > Service Workers
3. Look for "Install" button in Chrome address bar

## Using PWA Features in Components

### Install Button
```jsx
import { getInstallPrompt, showInstallPrompt } from '@/utils/pwaUtils'

function InstallButton() {
  const [canInstall, setCanInstall] = useState(false)
  
  useEffect(() => {
    setCanInstall(getInstallPrompt() !== null)
  }, [])
  
  if (!canInstall) return null
  
  return (
    <button onClick={showInstallPrompt}>
      Install App
    </button>
  )
}
```

### Check if Running as PWA
```jsx
import { isPWA } from '@/utils/pwaUtils'

if (isPWA()) {
  console.log('App is running as installed PWA')
}
```

### Send Notifications
```jsx
import { requestNotificationPermission, sendNotification } from '@/utils/pwaUtils'

async function sendAlert() {
  const permitted = await requestNotificationPermission()
  if (permitted) {
    sendNotification('Transaction Complete', {
      body: 'Your deposit has been processed',
      tag: 'transaction',
    })
  }
}
```

## Performance Improvements for Vercel

The PWA setup provides:

1. **Reduced Server Load**: Assets cached on client
2. **Faster Page Loads**: Network requests happen in parallel
3. **Offline Functionality**: Works without internet
4. **Smart Updates**: Only downloads when changes occur

### Cache Strategy

| Resource Type | Strategy | Duration |
|---|---|---|
| Service Worker | No Cache | Always Fresh |
| HTML | No Cache | Always Fresh |
| API Calls | Network First | 5 minutes |
| Assets (JS/CSS) | Cache First | 1 year |
| CDN Resources | Stale While Revalidate | 30 days |

## Deployment to Vercel

The `vercel.json` is already configured with:
- Proper cache headers for service worker
- SPA routing support
- Asset versioning for cache busting

Just push your changes:
```bash
git add .
git commit -m "feat: Add PWA capabilities"
git push
```

## Troubleshooting

### Service Worker not updating
```javascript
// Clear cache in DevTools > Application > Storage
// Or add this to pwaUtils.js for manual update
if (navigator.serviceWorker) {
  navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' })
}
```

### Icons not showing
- Ensure icons are in `public/` folder
- Check that paths match manifest.json
- Clear browser cache (Ctrl+Shift+Delete)
- Check DevTools > Application > Manifest for 404 errors

### App not installing
- Must be HTTPS (works on localhost for testing)
- Must have valid manifest.json
- Must have service worker registered
- Need app icons in manifest

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Next Steps

1. ✅ Add icons to `public/` folder
2. ✅ Test locally with `npm run build && npm run preview`
3. ✅ Deploy to Vercel
4. ✅ Test installation on mobile devices
5. ✅ Monitor performance improvements
6. ✅ Consider adding offline fallback UI

Your app is now a full-featured PWA! 🚀
