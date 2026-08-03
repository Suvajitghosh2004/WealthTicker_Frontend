import { useEffect, useRef } from 'react'

const CONTAINER_ID = 'container-37894012c8f7b6e34f8c5777af7be6ac'
const SCRIPT_SRC = 'https://pl30148844.effectivecpmnetwork.com/37894012c8f7b6e34f8c5777af7be6ac/invoke.js'

export default function NativeBanner() {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existingScript) existingScript.remove()

    const container = document.getElementById(CONTAINER_ID)
    if (!container) return

    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = SCRIPT_SRC
    document.body.appendChild(script)
  }, [])

  return (
    <div
      className="my-6 w-full"
      style={{ minHeight: '120px' }} // ← Reserve space to prevent CLS
    >
      <div id={CONTAINER_ID} />
    </div>
  )
}