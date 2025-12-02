# PWA Deployment Checklist

Complete this checklist before deploying to Vercel.

## ✅ Pre-Deployment Checklist

### Icons (Critical)
- [ ] Generated icons using https://www.pwabuilder.com/imageGenerator
- [ ] All 4 icon files in `public/` folder:
  - [ ] `icon-192x192.png`
  - [ ] `icon-512x512.png`
  - [ ] `icon-192x192-maskable.png`
  - [ ] `icon-512x512-maskable.png`
- [ ] Each icon is exactly the right size
- [ ] Each icon is PNG format
- [ ] Each icon has transparent background

### Configuration Files
- [ ] `vite.config.js` has VitePWA plugin
- [ ] `index.html` has PWA meta tags
- [ ] `src/main.jsx` imports service worker registration
- [ ] `vercel.json` has cache headers
- [ ] `public/manifest.json` exists and is valid
- [ ] `public/sw.js` exists

### Build & Local Testing
- [ ] Run `npm run build` - no errors
- [ ] Run `npm run preview` - app loads
- [ ] Check: http://localhost:4173
- [ ] DevTools > Application > Service Workers shows registration
- [ ] DevTools > Application > Manifest shows no errors
- [ ] Install button appears in Chrome address bar
- [ ] Test offline: DevTools > Network > Offline > Reload
- [ ] App loads and functions offline
- [ ] API calls fallback gracefully
- [ ] No console errors in DevTools

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript (if used) compiles cleanly
- [ ] No unused imports
- [ ] No commented-out code

### Documentation
- [ ] README_PWA.md created
- [ ] QUICK_REFERENCE.md created
- [ ] PWA_SETUP.md created
- [ ] ICONS_GUIDE.md created
- [ ] TROUBLESHOOTING.md created

### Git & Deployment
- [ ] All changes committed: `git add .`
- [ ] Commit message: `git commit -m "feat: Add PWA capabilities"`
- [ ] Ready to push: `git push`
- [ ] Vercel connected to repository
- [ ] Vercel deployment environment configured

## 🧪 Testing Before Deployment

### Desktop Testing
```
Chrome/Edge:
1. Open DevTools (F12)
2. Check Application > Service Workers
3. Check Application > Manifest
4. Look for install button in address bar
5. Click install and verify app launches

Firefox:
1. Open DevTools (F12)
2. Check Storage > Service Workers
3. Check Manifest section
4. Test offline mode
```

### Mobile Testing
```
1. Get your machine IP: ipconfig
2. On mobile, visit: http://<your-ip>:4173
3. Tap install / "Add to Home Screen"
4. Verify app installs
5. Close browser
6. Open installed app from home screen
7. Go offline and test functionality
```

### Offline Testing
```
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Reload page
5. App should load from cache
6. API calls should show cached responses
7. UI should work without errors
```

## 📊 Expected Test Results

### Service Worker Status
- [ ] Registered successfully (no errors)
- [ ] Updated every 60 seconds
- [ ] Caching working (check Network tab)

### Manifest Status
- [ ] Valid JSON (no parse errors)
- [ ] All icons found (no 404s)
- [ ] All required fields present
- [ ] Icons display in preview

### Installation
- [ ] Install button appears
- [ ] Click button opens install dialog
- [ ] App installs successfully
- [ ] App launches from home screen/app drawer
- [ ] App runs in standalone mode (full screen)

### Performance
- [ ] First visit: 2-3 seconds
- [ ] Repeat visit: < 1 second
- [ ] Offline: Instant load
- [ ] No white flash or loading delays

### Features
- [ ] Offline pages load
- [ ] Navigation works offline
- [ ] API calls retry when online
- [ ] Notifications work (if implemented)
- [ ] Install button shows correctly

## 🚨 Common Pre-Deployment Issues

### Issue: Icons not found
**Solution:**
- Check icon filenames exactly match manifest.json
- Ensure files are in `public/` not `src/`
- Check file extensions are lowercase `.png`
- Rebuild: `npm run build`

### Issue: Service worker not registering
**Solution:**
- Check `src/main.jsx` imports pwaUtils
- Check browser console for errors
- Clear cache and hard refresh
- Check `public/sw.js` exists

### Issue: Install button not showing
**Solution:**
- Ensure all requirements met:
  - [ ] Service worker registered
  - [ ] Manifest present and valid
  - [ ] Icons present
  - [ ] HTTPS or localhost
  - [ ] Visited for 30+ seconds
- Check DevTools for manifest errors

### Issue: App not working offline
**Solution:**
- Check service worker installed (DevTools)
- Check Network tab for cached responses
- Verify `public/sw.js` has proper fetch handlers
- Check API calls have error handling

## ✨ Pre-Deployment Optimization

### Bundle Size Check
```bash
npm run build
# Check dist/ folder size - should be < 1MB
# If larger, consider:
# - Code splitting
# - Lazy loading routes
# - Removing unused dependencies
```

### Performance Audit
```
Chrome DevTools > Lighthouse
1. Run PWA audit
2. Check all categories
3. Fix any issues
4. Target: 90+ scores
```

### SEO Check
```
Check if:
- [ ] Meta description present
- [ ] Favicon present
- [ ] Open Graph tags (optional)
- [ ] Schema.org structured data (optional)
```

## 🎯 Deployment Day Checklist

### Final Verification (30 min before deploy)
```bash
# 1. Clean build
rm -rf dist
npm run build

# 2. Verify no errors
# (watch for red text in terminal)

# 3. Preview
npm run preview

# 4. Final local test
# Open http://localhost:4173
# DevTools > Application > Check all OK
```

### Deployment Steps
```bash
# 1. Commit changes
git add .
git commit -m "feat: Add PWA with offline support and auto-update"

# 2. Push to Vercel
git push

# 3. Monitor Vercel deployment
# Go to: https://vercel.com/dashboard
# Watch deployment progress
# Verify deployment successful
```

### Post-Deployment Verification (5 min after deploy)
```
1. Visit: https://your-domain.com
2. Check: DevTools > Application > Manifest
3. Check: DevTools > Application > Service Workers
4. Test: Install button
5. Test: Offline mode (if safe to do so)
6. Check: No console errors
```

## 📋 Rollback Plan

If something breaks after deployment:

```bash
# 1. Identify the issue
# 2. Fix locally
# 3. Commit fix: git commit -m "fix: PWA issue"
# 4. Push: git push
# 5. Vercel auto-deploys
# 6. Verify: Check deployment status
```

**OR** revert to previous version:

```bash
# Find last good commit
git log --oneline

# Revert to it
git revert <commit-hash>
git push
```

## 🎉 Deployment Success Criteria

After deployment, verify:
- [ ] App loads at https://your-domain.com
- [ ] Service worker shows as registered (DevTools)
- [ ] Manifest loads without errors
- [ ] Install button works
- [ ] Can install on mobile
- [ ] Offline mode works
- [ ] Repeat visits are fast
- [ ] No console errors
- [ ] All features functional

## 📞 Post-Deployment Support

If issues occur after deployment:

1. **Check DevTools** - Most issues visible there
2. **Check Network tab** - See what's being cached
3. **Check console** - Service worker logs helpful
4. **Clear cache** - User can do this if needed
5. **Check Troubleshooting.md** - Solution likely there

## ✅ You're Ready!

Once you've checked all items above, you're ready to deploy. 

**Final command:**
```bash
git push
```

Congratulations! Your PWA is now live! 🚀

---

**Monitor after deployment:**
- User feedback
- Error tracking (if implemented)
- Performance metrics
- Installation rates
- Usage patterns

Enjoy your PWA! 🎉
