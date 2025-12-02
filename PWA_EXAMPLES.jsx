import React, { useEffect, useState } from 'react'
import { Bell, Wifi, WifiOff } from 'lucide-react'
import {
  requestNotificationPermission,
  sendNotification,
  isPWA,
  getInstallPrompt,
} from '@/utils/pwaUtils'

/**
 * Example PWA Feature Implementations
 * Copy these patterns to use PWA features in your components
 */

// ============================================
// 1. OFFLINE INDICATOR COMPONENT
// ============================================
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 flex items-center gap-2 z-50">
      <WifiOff size={18} />
      <span>You are offline - Some features may be limited</span>
    </div>
  )
}

// ============================================
// 2. PWA STATUS COMPONENT
// ============================================
export function PWAStatus() {
  const [status, setStatus] = useState({
    isInstalled: false,
    isPWA: false,
    serviceWorkerActive: false,
  })

  useEffect(() => {
    setStatus({
      isInstalled: !!getInstallPrompt(),
      isPWA: isPWA(),
      serviceWorkerActive: 'serviceWorker' in navigator,
    })
  }, [])

  return (
    <div className="text-sm text-gray-600">
      {status.isPWA && <span className="text-green-600">✓ PWA Installed</span>}
      {status.serviceWorkerActive && !status.isPWA && (
        <span className="text-blue-600">✓ PWA Ready to Install</span>
      )}
      {!status.serviceWorkerActive && (
        <span className="text-gray-500">PWA Not Available</span>
      )}
    </div>
  )
}

// ============================================
// 3. NOTIFICATION DEMO COMPONENT
// ============================================
export function NotificationDemo() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleEnableNotifications = async () => {
    const enabled = await requestNotificationPermission()
    setNotificationsEnabled(enabled)
  }

  const handleSendNotification = () => {
    sendNotification('Test Notification', {
      body: 'This is a test notification from Gramin Bank',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'test-notification',
      requireInteraction: false,
    })
  }

  return (
    <div className="space-y-3">
      {!notificationsEnabled && (
        <button
          onClick={handleEnableNotifications}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Enable Notifications
        </button>
      )}

      {notificationsEnabled && (
        <>
          <p className="text-sm text-green-600">✓ Notifications enabled</p>
          <button
            onClick={handleSendNotification}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Bell size={18} />
            Send Test Notification
          </button>
        </>
      )}
    </div>
  )
}

// ============================================
// 4. SAFE API CALL WITH OFFLINE FALLBACK
// ============================================
export async function safeApiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      timeout: 5000, // Faster timeout for offline detection
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  } catch (error) {
    if (!navigator.onLine) {
      console.log('Offline - attempting cached response')
      // Try to get from cache
      const cache = await caches.open('api-cache')
      const cached = await cache.match(endpoint)
      if (cached) {
        return cached.json()
      }
      throw new Error('Offline and no cached data available')
    }
    throw error
  }
}

// ============================================
// 5. TRANSACTION NOTIFICATION EXAMPLE
// ============================================
export function useTransactionNotification() {
  const notifySuccess = (type, amount, reference) => {
    sendNotification(`${type} Successful`, {
      body: `Amount: ${amount} | Ref: ${reference}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: `transaction-${reference}`,
      actions: [
        {
          action: 'view',
          title: 'View Details',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    })
  }

  const notifyError = (message, reference) => {
    sendNotification('Transaction Failed', {
      body: message,
      icon: '/icon-192x192.png',
      tag: `error-${reference}`,
      requireInteraction: true,
    })
  }

  return { notifySuccess, notifyError }
}

// ============================================
// 6. CACHE MANAGEMENT UTILITIES
// ============================================
export async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))
  console.log('All caches cleared')
}

export async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0

  for (const name of cacheNames) {
    const cache = await caches.open(name)
    const keys = await cache.keys()
    totalSize += keys.length
  }

  return totalSize
}

// ============================================
// 7. PERIODIC SYNC EXAMPLE (Future Feature)
// ============================================
export async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register('sync-pending-transactions')
      console.log('Background sync registered')
    } catch (error) {
      console.error('Background sync failed:', error)
    }
  }
}

// ============================================
// 8. INSTALLATION TRACKING
// ============================================
export function useInstallTracking() {
  useEffect(() => {
    let installPrompt = null

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      installPrompt = event
      // Track that install prompt was shown
      console.log('Install prompt available')
    })

    window.addEventListener('appinstalled', () => {
      // Track successful installation
      console.log('App was installed')
      if ('gtag' in window) {
        gtag('event', 'app_installed')
      }
    })

    window.addEventListener('beforeuninstall', () => {
      console.log('App uninstall detected')
    })
  }, [])
}

// ============================================
// 9. UPDATE CHECKER COMPONENT
// ============================================
export function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              setUpdateAvailable(true)
            }
          })
        })

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Every minute
      })
    }
  }, [])

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      <p className="font-semibold mb-2">Update Available</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 text-sm font-semibold"
      >
        Reload Now
      </button>
    </div>
  )
}

// ============================================
// 10. COMPLETE EXAMPLE: DASHBOARD WITH PWA FEATURES
// ============================================
export function PWAEnhancedDashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { notifySuccess } = useTransactionNotification()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleDeposit = async () => {
    try {
      // Perform deposit
      const result = await safeApiCall('/api/deposits', {
        method: 'POST',
        body: JSON.stringify({ amount: 1000 }),
      })

      // Send notification if enabled
      if (notificationsEnabled) {
        notifySuccess('Deposit', '₹1000', result.reference)
      }
    } catch (error) {
      console.error('Deposit failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi size={18} className="text-green-600" />
              <span className="text-sm text-green-600">Online</span>
            </>
          ) : (
            <>
              <WifiOff size={18} className="text-yellow-600" />
              <span className="text-sm text-yellow-600">Offline</span>
            </>
          )}
        </div>
        <PWAStatus />
      </div>

      {/* Features */}
      <div className="space-y-3">
        <button
          onClick={handleDeposit}
          disabled={!isOnline}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Make Deposit
        </button>

        <NotificationDemo />

        <button
          onClick={() => clearAllCaches()}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
        >
          Clear Cache
        </button>
      </div>

      {/* Offline Message */}
      {!isOnline && (
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm rounded">
          You are offline. Some features may be limited. Data will sync when you go online.
        </div>
      )}
    </div>
  )
}

export default PWAEnhancedDashboard
