'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ThemeTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement

    // Check the URL and set the exact data-theme attribute
    if (pathname.includes('/core')) {
      root.setAttribute('data-theme', 'core')
    } else if (pathname.includes('/labs')) {
      root.setAttribute('data-theme', 'labs')
    } else if (pathname.includes('/projects')) {
      root.setAttribute('data-theme', 'projects')
    } else {
      // If on the Overview/Home page, clear it to default back to Purple
      root.removeAttribute('data-theme')
    }
  }, [pathname])

  return null
}