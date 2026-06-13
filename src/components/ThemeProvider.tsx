'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export default function ThemeProvider() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}
