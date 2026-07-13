import { useEffect, useRef } from 'react'

let instanceCount = 0

export default function Banner300x250() {
  const ref = useRef(null)
  const loaded = useRef(false)
  const instanceId = useRef(`banner_${++instanceCount}_${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true

    const id = instanceId.current
    ref.current.innerHTML = ''

    // Scope atOptions to this instance using a unique variable name
    const optionsScript = document.createElement('script')
    optionsScript.innerHTML = `
      window['atOptions_${id}'] = {
        'key' : '88300842e1274ed47612cd3fa85f042c',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
      window.atOptions = window['atOptions_${id}'];
    `
    ref.current.appendChild(optionsScript)

    // Create a wrapper div for this instance
    const wrapper = document.createElement('div')
    wrapper.id = `banner-wrapper-${id}`
    ref.current.appendChild(wrapper)

    // Load invoke script into this wrapper
    const invokeScript = document.createElement('script')
    invokeScript.src = 'https://www.highperformanceformat.com/88300842e1274ed47612cd3fa85f042c/invoke.js'
    invokeScript.async = true
    invokeScript.setAttribute('data-instance', id)
    wrapper.appendChild(invokeScript)

    return () => {
      // Cleanup on unmount
      delete window[`atOptions_${id}`]
    }
  }, [])

  return (
    <div className="my-6 flex justify-center">
      <div
        ref={ref}
        style={{ width: 300, minHeight: 250 }}
      />
    </div>
  )
}