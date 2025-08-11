'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setTheme } from '@/store/slices/uiSlice'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(state => state.ui.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(systemPrefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(e.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return <>{children}</>
}