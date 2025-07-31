'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setTheme } from '@/store/slices/uiSlice'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const theme = useAppSelector(state => state.ui.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(newTheme))
    setIsOpen(false)
  }

  const currentIcon = theme === 'dark' ? <Moon className="h-5 w-5" /> : theme === 'light' ? <Sun className="h-5 w-5" /> : <Monitor className="h-5 w-5" />

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        className="text-primary"
        variant="ghost"
        size="icon"
        title="Toggle Theme"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentIcon}
      </Button>
      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 p-1 z-10 min-w-[120px] shadow-lg animate-fade-in">
          <CardContent className="p-0">
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleThemeChange('system')}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}