'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ComponentProps } from 'react'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider> & {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
