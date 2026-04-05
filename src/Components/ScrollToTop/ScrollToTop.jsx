import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'


// ── ScrollToTop ──
// It watches the URL and scrolls to top on every route change

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname])
  return null // renders nothing — purely a side-effect component
}