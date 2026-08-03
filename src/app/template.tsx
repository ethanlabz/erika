'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

export default function GlobalTemplate({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return;

    animate(contentRef.current, {
      opacity: [0, 1],
      translateY: [10, 0], 
      ease: 'outQuart',
      duration: 400,
      delay: 50,
    })
  }, [])

  return (
    <div ref={contentRef} className="opacity-0 w-full h-full">
      {children}
    </div>
  )
}