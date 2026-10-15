import { Head, Html, Main, NextScript } from 'next/document'

const themeScript =
  "try{var t=localStorage.getItem('abjad-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}"

export default function Document() {
  return (
    <Html lang="fa" dir="rtl">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#5b5bd6" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
