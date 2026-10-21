import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import LettersTable from '../components/LettersTable'
import { SITE_NAME, SITE_URL } from '../lib/content'
import { SYSTEMS, SystemKey } from '../lib/helper'

type PageInfo = {
  slug: string
  title: string
  description: string
  heading: string
  body: string[]
  system?: SystemKey
}

const pages: PageInfo[] = [
  {
    slug: 'abjad-kabir',
    title: 'ابجد کبیر آنلاین؛ جدول و محاسبه حروف',
    description:
      'ارزش حروف ابجد کبیر را ببینید و محاسبه کنید؛ جدول کامل، نمونه محاسبه و دسترسی به ابزار رایگان.',
    heading: 'ابجد کبیر چیست؟',
    system: 'kabir',
    body: [
      'ابجد کبیر یا حساب جمل، به هر حرف ارزش عددی مشخصی می‌دهد. با جمع ارزش حروف، عدد یک واژه یا عبارت به دست می‌آید. ترتیب مشهور از ا=۱ تا غ=۱۰۰۰ ادامه دارد.',
      'برای نمونه، «علی» در ابجد کبیر برابر است با ع=۷۰، ل=۳۰ و ی=۱۰؛ پس مجموع آن ۱۱۰ است. املای واژه و شیوه برخورد با حروف فارسی افزوده مانند پ، چ، ژ و گ می‌تواند بر نتیجه اثر بگذارد.',
    ],
  },
  {
    slug: 'abjad-vasit',
    title: 'ابجد وسیط آنلاین؛ جدول و روش محاسبه',
    description:
      'جدول ابجد وسیط و روش استفاده از مقادیر پیاده‌شده در این محاسبه‌گر را ببینید.',
    heading: 'ابجد وسیط و روایت این محاسبه‌گر',
    system: 'wasit',
    body: [
      'برای عنوان «وسیط» یک جدول واحد و مورد توافق همه منابع وجود ندارد. این ابزار از جدول عددی تعریف‌شده در کد محاسبه‌گر استفاده می‌کند؛ در آن مقادیر وسیط حروف به‌ترتیب ا، ب، ج، د، ه، و، ز، ح، ط، ی برابر ۱ تا ۱۰ و سپس ک=۸، ل=۶، م=۴، ن=۲، س=۰ است و مقادیر بعدی در جدول کامل آمده‌اند.',
      'بنابراین نتیجه وسیط را باید بر اساس همین قرارداد خواند و آن را با جدول‌های دیگر بدون بررسی تعریفشان مقایسه نکرد. جدول زیر مقادیر هر چهار سیستم همین سایت را نشان می‌دهد.',
    ],
  },
  {
    slug: 'abjad-saghir',
    title: 'ابجد صغیر آنلاین؛ جدول و نمونه محاسبه',
    description: 'تعریف ابجد صغیر، جدول حروف و نمونه محاسبه آنلاین را بخوانید.',
    heading: 'ابجد صغیر چیست؟',
    system: 'saghir',
    body: [
      'در قرارداد این سایت، مقدار صغیر هر حرف از باقی‌مانده مقدار کبیر آن بر ۹ به دست می‌آید؛ باقی‌مانده صفر برای ط، ص و ظ به صورت صفر نگه داشته شده است.',
      'برای نمونه، ارزش کبیر ل برابر ۳۰ است و ۳۰ بر ۹ باقی‌مانده ۳ دارد؛ پس ارزش صغیر ل در این جدول ۳ است. بعضی روش‌ها باقی‌مانده صفر را ۹ می‌گیرند، بنابراین هنگام مقایسه باید قرارداد را مشخص کرد.',
    ],
  },
  {
    slug: 'abjad-maghribi',
    title: 'ابجد مغربی آنلاین؛ جدول و تفاوت با مشرقی',
    description:
      'تفاوت ترتیب ابجد مغربی و مشرقی را با جدول حروف این محاسبه‌گر ببینید.',
    heading: 'ابجد مغربی چیست؟',
    system: 'maghribi',
    body: [
      'در جدول مغربی این ابزار، مقدار کبیر شش حرف با ترتیب مشرقی فرق دارد: ص=۶۰، ض=۹۰، س=۳۰۰، ش=۱۰۰۰، ظ=۸۰۰ و غ=۹۰۰. ارزش دیگر حروف مطابق جدول کبیر مشرقی باقی می‌ماند.',
      'برای نمونه، «س» در ترتیب مشرقی ۶۰ و در جدول مغربی این سایت ۳۰۰ است. جدول زیر هر دو مقدار را کنار هم نشان می‌دهد.',
    ],
  },
  {
    slug: 'abjad-table',
    title: 'جدول کامل ابجد؛ کبیر، وسیط، صغیر و مغربی',
    description:
      'جدول ارزش حروف فارسی و عربی در چهار سیستم ابجد این محاسبه‌گر.',
    heading: 'جدول کامل حروف ابجد',
    body: [
      'جدول زیر مقدار حروف را در چهار سیستم محاسبه‌گر نمایش می‌دهد. پ، چ، ژ و گ با حروف نزدیک خود نگاشت شده‌اند؛ گزینه ژ صفر در صفحه محاسبه‌گر می‌تواند مقدار آن را تغییر دهد.',
    ],
  },
  {
    slug: 'number-to-abjad',
    title: 'تبدیل عدد به حروف ابجد آنلاین',
    description:
      'عدد را به حروف ابجد کبیر تبدیل کنید و واژه‌های هم‌عدد را پیدا کنید.',
    heading: 'تبدیل عدد به حروف ابجد',
    body: [
      'در ابزار صفحه اصلی، عددی بین ۱ تا ۹۹٬۹۹۹ وارد کنید تا تجزیه حریصانه آن بر اساس مقادیر ابجد کبیر به حروف نمایش داده شود. برای مثال ۱۳۲۴ به غ، ش، ل، د تجزیه می‌شود.',
      'هم‌عدد‌یاب واژه‌های موجود در فهرست داخلی را نشان می‌دهد که با عدد و سیستم انتخاب‌شده برابر باشند؛ این فهرست کامل واژگان زبان نیست.',
    ],
  },
  {
    slug: 'hesab-jomal',
    title: 'حساب جمل چیست؟ تاریخچه و روش محاسبه ابجد',
    description:
      'با حساب جمل، کاربرد تاریخی ابجد و نمونه محاسبه حرف به حرف آشنا شوید.',
    heading: 'حساب جمل؛ ارزش عددی حروف',
    body: [
      'حساب جمل نام جمع ارزش عددی حروف یک کلمه یا عبارت است. در نسخه‌های تاریخی ابجد از این قرارداد برای ترتیب‌بندی و گاهی ثبت ماده‌تاریخ در شعر و نوشته‌ها استفاده شده است.',
      'برای نمونه «علی» در کبیر: ع=۷۰ + ل=۳۰ + ی=۱۰، برابر ۱۱۰ می‌شود. نتیجه به املای متن و جدولی که مبنا قرار می‌گیرد وابسته است؛ این محاسبه‌گر جنبه آموزشی دارد و نتیجه آن به‌تنهایی اثبات یا پیش‌بینی محسوب نمی‌شود.',
    ],
  },
]

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: pages.map(({ slug }) => ({ params: { slug } })),
  fallback: false,
})
export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { page: pages.find(({ slug }) => slug === params?.slug) },
})

export default function InfoPage({ page }: { page: PageInfo }) {
  const url = `${SITE_URL}/${page.slug}/`
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.heading, item: url },
    ],
  }
  return (
    <>
      <Head>
        <title>
          {page.title} | {SITE_NAME}
        </title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </Head>
      <div className="container">
        <header className="site-header">
          <Link href="/">{SITE_NAME}</Link>
        </header>
        <main>
          <nav className="section" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link> ← {page.heading}
          </nav>
          <article className="section card prose">
            <h1>{page.heading}</h1>
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {page.system && (
              <p>
                <Link href={`/?system=${page.system}#calculator`}>
                  محاسبه با ابجد{' '}
                  {SYSTEMS.find((s) => s.key === page.system)?.label} ←
                </Link>
              </p>
            )}
            {page.slug === 'abjad-table' && <LettersTable zhZero={false} />}
            <h2>صفحه‌های مرتبط</h2>
            <ul>
              {pages
                .filter((p) => p.slug !== page.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}/`}>{p.heading}</Link>
                  </li>
                ))}
            </ul>
            <p>
              <Link href="/">رفتن به محاسبه‌گر ابجد</Link>
            </p>
          </article>
        </main>
        <footer className="footer">
          <Link href="/">صفحه اصلی {SITE_NAME}</Link>
        </footer>
      </div>
    </>
  )
}
