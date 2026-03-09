import { useEffect, useRef } from 'react'

const AD_CLIENT = 'ca-pub-4571766420413441'
const SLOT = import.meta.env.VITE_ADSENSE_SLOT ?? ''

/**
 * Renders a single AdSense ad unit. The loader script must be in index.html.
 * Set VITE_ADSENSE_SLOT in .env / GitHub Actions to your ad unit slot ID from AdSense.
 * @param {Object} props
 * @param {string} [props.slot] - Override slot ID (default: VITE_ADSENSE_SLOT)
 * @param {string} [props.format='auto'] - "auto" | "rectangle" | "horizontal" | "vertical"
 * @param {string} [props.className] - Optional wrapper class
 */
export function AdSense({ slot: slotProp, format = 'auto', className = '' }) {
  const slot = slotProp ?? SLOT
  const insRef = useRef(null)
  const pushedRef = useRef(false)

  useEffect(() => {
    if (!slot || !insRef.current || pushedRef.current) return
    try {
      if (window.adsbygoogle) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        pushedRef.current = true
      }
    } catch (e) {
      console.warn('AdSense push failed', e)
    }
  }, [slot])

  if (!slot) return null

  return (
    <aside className={className} aria-label="Advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  )
}
