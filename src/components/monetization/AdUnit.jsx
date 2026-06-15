import { useEffect, useRef } from 'react'

export default function AdUnit({ slot, format = 'auto', style = {} }) {
  const ref = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch (e) {}
  }, [])

  if (!import.meta.env.VITE_ADSENSE_ID) {
    // Dev placeholder
    return (
      <div className="ad-wrapper my-6 rounded-lg" style={{ minHeight: 90, ...style }}>
        <span className="text-xs text-gray-400">[ Ad Unit — {slot} ]</span>
      </div>
    )
  }

  return (
    <div className="ad-wrapper my-6" style={style} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
