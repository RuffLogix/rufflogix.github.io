import '../styles/globals.css'
import '../public/prismjs/themes/prism-github.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
