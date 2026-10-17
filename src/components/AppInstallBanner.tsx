import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { APP_NAME, APP_PAGE_PATH } from '../lib/appLinks'
import { Capacitor } from '@capacitor/core'

const DISMISS_KEY = 'abjad-app-banner-dismissed'
const SNOOZE_DAYS = 7

/**
 * بنر پیشنهاد نصب اپ؛ فقط روی اندروید نمایش داده می‌شود
 * (بازار و مایکت مخصوص اندروید هستند).
 * با بستن، به‌مدت ۷ روز دوباره نمایش داده نمی‌شود.
 */
const AppInstallBanner = () => {
  if (Capacitor.isNativePlatform()) return

  const router = useRouter()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (!/android/i.test(navigator.userAgent)) return
      //   if (window.matchMedia('(display-mode: standalone)').matches) return
      const last = Number(localStorage.getItem(DISMISS_KEY) || 0)
      if (last && Date.now() - last < SNOOZE_DAYS * 86400000) return
    } catch {}
    const id = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(id)
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {}
  }

  if (!visible || router.pathname === APP_PAGE_PATH) return null

  return (
    <div className="app-banner" role="complementary" aria-label="نصب اپلیکیشن">
      <div className="app-banner-icon" aria-hidden>
        📱
      </div>
      <div className="app-banner-text">
        <strong>اپلیکیشن {APP_NAME} را نصب کنید</strong>
        {/* <span>سریع‌تر، بدون نیاز به مرورگر و همیشه در دسترس</span> */}
        <span>برای تجربه‌ی سریع‌تر، اپ را نصب کنید.</span>
      </div>
      <Link href={APP_PAGE_PATH} className="app-banner-cta" onClick={dismiss}>
        نصب
      </Link>
      <button className="app-banner-close" onClick={dismiss} aria-label="بستن">
        ✕
      </button>
    </div>
  )
}

export default AppInstallBanner
