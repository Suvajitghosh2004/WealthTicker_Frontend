import { useEffect, useRef } from 'react'

export default function NativeBanner() {
  const ref = useRef(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true

    // Clear any previous content
    ref.current.innerHTML = ''

    const container = document.createElement('div')
    container.id = `container-37894012c8f7b6e34f8c5777af7be6ac-${Math.random().toString(36).slice(2)}`
    ref.current.appendChild(container)

    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = 'https://pl30148844.effectivecpmnetwork.com/37894012c8f7b6e34f8c5777af7be6ac/invoke.js'
    ref.current.appendChild(script)
  }, [])

  return (
    <div
      ref={ref}
      className="my-8 w-full min-h-[100px]"
    />
  )
}