import Head from 'next/head'
import Link from 'next/link'
import { BrandLogo } from '../components/BrandLogo'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>صفحه پیدا نشد | ابجد</title>
        <meta name="description" content="صفحه‌ای که درخواست کردید پیدا نشد." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="error-page">
        <div className="error-card">
          <BrandLogo size="lg" />
          <p className="error-code">404</p>
          <h1>صفحه‌ای که دنبال آن بودید پیدا نشد.</h1>
          <p className="error-text">
            ممکن است آدرس اشتباه باشد، صفحه حذف شده باشد یا لینک قدیمی شده باشد.
          </p>
          <Link href="/" className="error-cta">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </>
  )
}
