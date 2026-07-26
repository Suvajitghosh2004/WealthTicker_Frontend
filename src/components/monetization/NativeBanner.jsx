import { useEffect, useRef } from 'react'

const CONTAINER_ID = 'container-37894012c8f7b6e34f8c5777af7be6ac'
const SCRIPT_SRC = 'https://pl30148844.effectivecpmnetwork.com/37894012c8f7b6e34f8c5777af7be6ac/invoke.js'

export default function NativeBanner() {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    // Remove any existing script to avoid duplicates
    const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existingScript) existingScript.remove()

    // Make sure container exists
    const container = document.getElementById(CONTAINER_ID)
    if (!container) return

    // Load script after container is confirmed in DOM
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = SCRIPT_SRC
    document.body.appendChild(script)
  }, [])

  return (
    <div className="my-6 w-full min-h-[100px]">
      <div id={CONTAINER_ID} />
    </div>
  )
}