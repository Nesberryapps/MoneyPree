'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as gtag from '@/lib/gtag'

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (gtag.GA_TRACKING_ID) {
        gtag.pageview(pathname)
    }
  }, [pathname])

  return null
}
