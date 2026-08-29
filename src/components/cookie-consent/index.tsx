'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { analyticsConfig } from '@/lib/analytics.config'

// Tracking IDs live in src/lib/analytics.config.ts — edit them there.
const GA_MEASUREMENT_ID = analyticsConfig.gaMeasurementId
const META_PIXEL_ID = analyticsConfig.metaPixelId
const CLARITY_PROJECT_ID = analyticsConfig.clarityProjectId

// Define type for GTM dataLayer events
interface DataLayerEvent {
  event: string
  [key: string]: string | number | boolean | undefined
}

// Extend Window interface to include dataLayer and openCookiePreferences
declare global {
  interface Window {
    dataLayer: DataLayerEvent[]
    openCookiePreferences?: () => void
  }
}

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be changed
    functional: true, // Always true, cannot be changed - includes Zeffy donation forms
    analytics: false,
    marketing: false,
  })
  const [savedPreferencesBackup, setSavedPreferencesBackup] =
    useState<CookiePreferences>(preferences)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const loadGoogleAnalytics = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      !document.querySelector('script[src*="googletagmanager.com/gtag"]')
    ) {
      const gaScript = document.createElement('script')
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(gaScript)

      const gaConfigScript = document.createElement('script')
      const secureFlag =
        typeof window !== 'undefined' && window.location.protocol === 'https:' ? ';Secure' : ''
      gaConfigScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          'anonymize_ip': true,
          'cookie_flags': 'SameSite=Lax${secureFlag}'
        });
      `
      document.head.appendChild(gaConfigScript)
    }
  }, [])

  const loadMetaPixel = useCallback(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="fbevents.js"]')) {
      const fbScript = document.createElement('script')
      fbScript.textContent = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(fbScript)

      const fbNoScript = document.createElement('noscript')
      const img = document.createElement('img')
      img.height = 1
      img.width = 1
      img.style.display = 'none'
      img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`
      fbNoScript.appendChild(img)
      document.body.appendChild(fbNoScript)
    }
  }, [])

  const loadMicrosoftClarity = useCallback(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="clarity.ms"]')) {
      const clarityScript = document.createElement('script')
      clarityScript.textContent = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `
      document.head.appendChild(clarityScript)
    }
  }, [])

  const deleteAnalyticsCookies = useCallback(() => {
    // List of static cookie names to delete
    const cookiesToDelete = ['_ga', '_gid', '_fbp', 'fr', '_clck', '_clsk']

    // Delete static cookies
    cookiesToDelete.forEach((name) => {
      // Delete for current domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      // Also try to delete with domain specification
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
    })

    // Dynamically delete all cookies matching _ga_* (e.g., _ga_G-XXXXXXXXXX)
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach((cookie) => {
        const cookieName = cookie.split('=')[0].trim()
        if (cookieName.startsWith('_ga_')) {
          // Delete for current domain
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          // Also try to delete with domain specification
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
        }
      })
    }
  }, [])

  const applyConsent = useCallback(
    (prefs: CookiePreferences, previousPrefs?: CookiePreferences) => {
      // Set a cookie to indicate consent status with Secure flag (only on HTTPS)
      const cookieValue = JSON.stringify(prefs)
      const secureFlag =
        typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `cookie-consent=${encodeURIComponent(cookieValue)}; path=/; max-age=31536000; SameSite=Lax${secureFlag}`

      // Check if consent was withdrawn and delete cookies if needed
      if (previousPrefs) {
        if (
          (previousPrefs.analytics && !prefs.analytics) ||
          (previousPrefs.marketing && !prefs.marketing)
        ) {
          deleteAnalyticsCookies()
        }
      }

      // Push consent update to GTM dataLayer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'consent_update',
          functional_consent: prefs.functional ? 'granted' : 'denied',
          analytics_consent: prefs.analytics ? 'granted' : 'denied',
          marketing_consent: prefs.marketing ? 'granted' : 'denied',
        })
      }

      // Load scripts based on consent independently
      if (prefs.analytics) {
        loadGoogleAnalytics()
        loadMicrosoftClarity()
      }
      if (prefs.marketing) {
        loadMetaPixel()
      }
    },
    [deleteAnalyticsCookies, loadGoogleAnalytics, loadMetaPixel, loadMicrosoftClarity]
  )

  // Helper to load preferences from localStorage and update state
  const loadPreferencesFromLocalStorage = useCallback(
    (showBannerIfMissing = true) => {
      try {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
          if (showBannerIfMissing) setShowBanner(true)
          return
        }
        let savedPreferences: CookiePreferences
        try {
          savedPreferences = JSON.parse(consent)
        } catch {
          if (showBannerIfMissing) setShowBanner(true)
          return
        }

        // Validate the structure (functional is optional for backward compatibility)
        if (
          typeof savedPreferences === 'object' &&
          savedPreferences !== null &&
          typeof savedPreferences.necessary === 'boolean' &&
          typeof savedPreferences.analytics === 'boolean' &&
          typeof savedPreferences.marketing === 'boolean'
        ) {
          // Ensure functional is always true (for backward compatibility with old saved preferences)
          // Create a new object to avoid mutation
          const updatedPreferences: CookiePreferences = {
            ...savedPreferences,
            functional: true,
          }
          setPreferences(updatedPreferences)
          setSavedPreferencesBackup(updatedPreferences)
          applyConsent(updatedPreferences)
        } else {
          // Invalid data, show banner again
          if (showBannerIfMissing) setShowBanner(true)
        }
      } catch {
        // If localStorage is unavailable or data is corrupted, show banner
        if (showBannerIfMissing) setShowBanner(true)
      }
    },
    [applyConsent]
  )

  const handleCancelPreferences = useCallback(() => {
    // Restore the backed-up preferences
    setPreferences(savedPreferencesBackup)
    setShowPreferences(false)
  }, [savedPreferencesBackup])

  // Initialize state from localStorage on mount - this is the correct pattern for hydration
  useEffect(() => {
    // Expose method to window for reopening preferences from other components
    window.openCookiePreferences = () => {
      setShowBanner(true)
      setShowPreferences(true)
      loadPreferencesFromLocalStorage(false)
    }

    // Check if user has already made a choice with error handling
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPreferencesFromLocalStorage(true)

    // Cleanup function to remove the window method
    return () => {
      delete window.openCookiePreferences
    }
  }, [loadPreferencesFromLocalStorage])

  // Focus management for modal
  useEffect(() => {
    if (showPreferences && modalRef.current) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus the first focusable element in the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancelPreferences()
        }
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        // Restore focus when modal closes
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }
  }, [showPreferences, handleCancelPreferences])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    } catch (e) {
      // If localStorage is unavailable, continue anyway
      console.warn('Unable to save preferences to localStorage:', e)
    }
    applyConsent(allAccepted, savedPreferencesBackup)
    setSavedPreferencesBackup(allAccepted)
    setShowBanner(false)
  }

  const handleDeclineAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: true, // Functional cookies (Zeffy) are always enabled for donations
      analytics: false,
      marketing: false,
    }
    setPreferences(onlyNecessary)
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    } catch (e) {
      // If localStorage is unavailable, continue anyway
      console.warn('Unable to save preferences to localStorage:', e)
    }

    // Delete third-party cookies when consent is withdrawn
    deleteAnalyticsCookies()

    applyConsent(onlyNecessary, savedPreferencesBackup)
    setSavedPreferencesBackup(onlyNecessary)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    } catch (e) {
      // If localStorage is unavailable, continue anyway
      console.warn('Unable to save preferences to localStorage:', e)
    }
    applyConsent(preferences, savedPreferencesBackup)
    setSavedPreferencesBackup(preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleShowPreferences = () => {
    // Backup current preferences in case user cancels
    setSavedPreferencesBackup(preferences)
    setShowPreferences(true)
  }

  if (!showBanner) {
    return null
  }

  if (showPreferences) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        onClick={(e) => {
          // Only close if clicking the overlay itself, not the modal content
          if (e.target === e.currentTarget) {
            handleCancelPreferences()
          }
        }}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <h2 id="cookie-preferences-title" className="text-2xl font-bold text-gray-900 mb-4">
              Cookie Preferences
            </h2>
            <p className="text-gray-600 mb-6">
              We use cookies to enhance your browsing experience and analyze our traffic. You can
              choose which types of cookies you allow.
            </p>

            {/* Necessary Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Necessary Cookies</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-5 h-5 text-blue-600 bg-gray-300 rounded cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-500">Always Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                These cookies are essential for the website to function properly. They enable basic
                features like page navigation and access to secure areas. The website cannot
                function properly without these cookies.
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    disabled
                    className="w-5 h-5 text-blue-600 bg-gray-300 rounded cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-500">Always Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                These cookies enable enhanced functionality and features that are essential for our
                core services. This includes our donation processing and application form systems
                which require cookies to function properly.
              </p>
              <p className="text-xs text-gray-500">
                Services: Zeffy (Donation Processing), Microsoft Forms (Application Forms - may
                include HubSpot analytics)
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="sr-only peer"
                    aria-label="Enable analytics cookies"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                These cookies help us understand how visitors interact with our website by
                collecting and reporting information anonymously. We use Google Analytics and
                Microsoft Clarity.
              </p>
              <p className="text-xs text-gray-500">Services: Google Analytics, Microsoft Clarity</p>
            </div>

            {/* Marketing Cookies */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="sr-only peer"
                    aria-label="Enable marketing cookies"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                These cookies are used to track visitors across websites. The intention is to
                display ads that are relevant and engaging for the individual user.
              </p>
              <p className="text-xs text-gray-500">Services: Meta Pixel (Facebook)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={handleCancelPreferences}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl"
      role="region"
      aria-label="Cookie consent notice"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">We Value Your Privacy</h3>
            <p className="text-sm text-gray-600 mb-3">
              We use cookies to improve your experience on our site, analyze traffic, and enable
              certain features. By clicking &quot;Accept All&quot;, you consent to our use of
              cookies for analytics and marketing purposes. You can manage your preferences or
              decline non-essential cookies.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="/privacy-policy" className="text-blue-600 underline">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-blue-600 underline">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={handleDeclineAll}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
            >
              Decline All
            </button>
            <button
              onClick={handleShowPreferences}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
