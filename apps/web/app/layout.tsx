import { ThemeProvider } from '@/providers/theme-provider'
import { ThirdwebProvider } from '@/providers/thirdweb-provider'
import { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'

import '@repo/ui/globals.css'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    template: '%s | GUM',
    default: 'GUM',
  },
  icons: {
    icon: '/gum-logo.svg',
  },
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
          <ThirdwebProvider>{children}</ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
