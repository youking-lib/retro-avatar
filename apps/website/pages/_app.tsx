import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { SSRProvider } from '@react-aria/ssr'
import { Analytics } from '@vercel/analytics/react'
import { isProd } from '@utils'
import { pageview, options } from '@common/gtag'
import Head from 'next/head'
import Script from 'next/script'

import '../styles.css'

const ga = options()

const App = ({ Component, pageProps }) => {
  const router = useRouter()

  useEffect(() => {
    if (!ga) return

    const handleRouteChange = (url: string) => {
      pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {ga && (
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: ga.html
            }}
          />
        </Head>
      )}

      {ga && <Script strategy='afterInteractive' src={ga.url} />}

      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
      {isProd && <Analytics />}
    </>
  )
}

const sans = Inter({
  adjustFontFallback: true,
  display: 'optional',
  fallback: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"'
  ],
  preload: true,
  style: 'normal',
  subsets: ['latin'],
  weight: 'variable'
})

export const fonts = {
  sans: sans.style.fontFamily
}

export default App
