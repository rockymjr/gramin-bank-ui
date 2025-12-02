# PWA Troubleshooting & Optimization Guide

## Common Issues & Solutions

### Issue 1: Service Worker Not Registering

**Symptoms**: DevTools > Application > Service Workers is empty

**Solutions**:
```javascript
// Check browser console for errors
// Add this to main.jsx for debugging:
import { registerServiceWorker } from './utils/pwaUtils.js'

registerServiceWorker()

// In browser console, check:
navigator.serviceWorker.getRegistrations()
```

**Fix**:
- Clear cache: DevTools > Application > Storage > Clear site data
- Hard refresh: Ctrl+Shift+R
- Check HTTPS or localhost only (PWA needs secure context)

---

### Issue 2: Install Button Not Showing

**Symptoms**: No install option in Chrome address bar

**Causes & Fixes**:

1. **Missing Manifest File**
   ```bash
   # Check that manifest.json exists
   ls public/manifest.json
   # Check in DevTools > Application > Manifest
   ```

2. **Invalid Manifest**
   ```bash
   npm run build
   # Open dist/manifest.webmanifest in browser
   # Should display JSON without errors
   ```

3. **Missing Icons**
   ```bash
   # Ensure these exist in public/ folder:
   # - icon-192x192.png
   # - icon-512x512.png
   # - icon-192x192-maskable.png
   # - icon-512x512-maskable.png
   ```

4. **Requirements Not Met**
   - Needs service worker ✓
   - Needs manifest ✓
   - Needs icons ✓
   - Needs HTTPS (or localhost) ✓
   - Needs to be visited for 30 seconds

**Full Check**:
```javascript
// Run in console
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('Manifest valid:', m))
  .catch(e => console.error('Manifest error:', e))

navigator.serviceWorker.getRegistrations()
  .then(r => console.log('Service Workers:', r))
```

---

### Issue 3: App Not Working Offline

**Symptoms**: App shows error when internet is off

**Debugging**:
```bash
# 1. Open DevTools > Network tab
# 2. Check "Offline" checkbox
# 3. Reload page
# 4. Check if resources load from cache
```

**Common Causes**:
1. Service worker not caching properly
   - Check `public/sw.js` fetch event handler
   - Ensure cache names match

2. API requests fail silently
   - Ensure API has offline fallback
   - Check Network tab for failed requests

3. Dynamic content requires fresh data
   - Implement conditional offline UI
   - Show "Offline - Some features unavailable"

**Fix for API Errors**:
```jsx
// Wrap API calls with error handling
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    if (!navigator.onLine) {
      console.log('Offline - using cached data')
      // Show cached version or offline message
      return getCachedData()
    }
    throw error
  }
}
```

---

### Issue 4: Changes Not Reflecting After Update

**Symptoms**: Updated code still shows old version

**Solutions**:

1. **Clear Service Worker Cache**
   ```javascript
   // DevTools > Application > Service Workers
   // Click "Unregister" on all service workers
   // Then reload page
   ```

2. **Clear All Caches**
   ```javascript
   // DevTools > Application > Storage
   // Click "Clear site data"
   ```

3. **Force Refresh**
   ```bash
   # Hard refresh (bypass cache)
   Ctrl+Shift+R  (Windows/Linux)
   Cmd+Shift+R   (Mac)
   ```

4. **Update Service Worker Manually**
   ```javascript
   // Add to main.jsx
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.getRegistrations().then(registrations => {
       registrations.forEach(registration => {
         registration.update() // Check for updates
       })
     })
   }
   ```

---

### Issue 5: Large Bundle Size / Slow Initial Load

**Symptoms**: Build is huge, first load is slow

**Optimization**:

1. **Check Bundle Size**
   ```bash
   npm run build
   # Look at dist/ folder size
   ```

2. **Analyze Build**
   ```bash
   # Install analyzer
   npm install --save-dev rollup-plugin-visualizer
   ```

3. **Update vite.config.js**
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { VitePWA } from 'vite-plugin-pwa'
   import { visualizer } from 'rollup-plugin-visualizer'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({...}),
       visualizer({
         open: true,
         filename: 'dist/stats.html'
       })
     ]
   })
   ```

4. **Optimize Dependencies**
   - Remove unused packages
   - Use tree-shaking: `import { specific } from 'package'`
   - Lazy load routes

---

### Issue 6: Icons Show as Red X or Don't Display

**Causes & Fixes**:

1. **Wrong File Path**
   ```json
   // In manifest.json, ensure paths are correct:
   {
     "icons": [
       {
         "src": "/icon-192x192.png",  // Starts with /
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   ```

2. **File Not in Public Folder**
   ```bash
   # Files must be in public/, not src/
   ls public/icon-*.png
   ```

3. **Wrong Filename**
   - Check exact filename matches manifest
   - Case-sensitive on Linux/Mac
   - No spaces in filenames

4. **File Format Issues**
   ```bash
   # Verify PNG format
   file public/icon-192x192.png
   # Should show: PNG image data
   ```

5. **Clear Build Cache**
   ```bash
   rm -rf dist/
   npm run build
   ```

**Test Icons**:
- DevTools > Application > Manifest
- Each icon should show ✅ with preview
- If ❌, click link to see error

---

### Issue 7: Push Notifications Not Working

**Symptoms**: Notifications don't appear or permission denied

**Fix**:

1. **Request Permission**
   ```javascript
   import { requestNotificationPermission } from '@/utils/pwaUtils'

   // Add button in component
   <button onClick={async () => {
     const ok = await requestNotificationPermission()
     if (ok) console.log('Notifications enabled')
   }}>
     Enable Notifications
   </button>
   ```

2. **Send Test Notification**
   ```javascript
   import { sendNotification } from '@/utils/pwaUtils'

   sendNotification('Test', {
     body: 'This is a test notification',
     tag: 'test'
   })
   ```

3. **Check Permission Status**
   ```javascript
   // In DevTools console:
   Notification.permission  // 'granted', 'denied', or 'default'
   ```

---

## Performance Optimization

### Cache Strategy Tuning

Edit `vite.config.js` workbox section:

```javascript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/api\./,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,  // Reduce for faster fallback
      expiration: {
        maxEntries: 50,           // Reduce to save space
        maxAgeSeconds: 5 * 60     // Increase for longer cache
      }
    }
  }
]
```

### Reduce Bundle Size

```javascript
// In vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
        }
      }
    }
  }
})
```

### Monitor Performance

```javascript
// Add to main.jsx
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`)
    })
  })
  observer.observe({ entryTypes: ['navigation', 'resource'] })
}
```

---

## Testing Checklist

```
PWA Verification Checklist:
✓ Manifest.json is valid JSON
✓ Service worker registers without errors
✓ All icons (4 files) are in public/
✓ Icon files are PNG format
✓ Build completes successfully
✓ App loads at http://localhost:4173
✓ Install button appears (Chrome)
✓ App can be installed
✓ App works offline
✓ App loads cached assets on second visit
✓ DevTools shows no errors
✓ Mobile installation works
```

---

## Debug Commands

```javascript
// Check service worker status
navigator.serviceWorker.controller
navigator.serviceWorker.ready

// List all caches
caches.keys().then(names => console.log(names))

// Clear all caches
caches.keys().then(names => 
  Promise.all(names.map(name => caches.delete(name)))
)

// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)

// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

---

## Useful Links

- [PWA Debugging](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [Service Worker Lifecycle](https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

---

**Still stuck?** Check the official docs or try clearing everything and rebuilding:
```bash
rm -rf dist node_modules
npm install
npm run build
npm run preview
```
