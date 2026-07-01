import { useEffect, useRef } from 'react'

export default function Banner300x250() {
  const ref = useRef(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true

    const optionsScript = document.createElement('script')
    optionsScript.text = `
      atOptions = {
        'key' : '88300842e1274ed47612cd3fa85f042c',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `
    ref.current.appendChild(optionsScript)

    const invokeScript = document.createElement('script')
    invokeScript.src = 'https://www.highperformanceformat.com/88300842e1274ed47612cd3fa85f042c/invoke.js'
    ref.current.appendChild(invokeScript)
  }, [])

  return (
    <div className="my-6 flex justify-center">
      <div ref={ref} style={{ width: 300, minHeight: 250 }} />
    </div>
  )
}