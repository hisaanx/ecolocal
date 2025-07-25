// _document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Poppins Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />

        {/* Quicksand Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
