import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AbjadAbout from '../components/AbjadAbout'
import { BrandLogo } from '../components/BrandLogo'
import LettersTable from '../components/LettersTable'
import {
  FAQS,
  SEO_DESCRIPTION,
  SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from '../lib/content'
import {
  SYSTEMS,
  SystemKey,
  calculateAbjad,
  digitalRoot,
  findWords,
  formatNumber,
  numberToLetters,
  parseNumberInput,
} from '../lib/helper'
import AppInstallBanner from '../components/AppInstallBanner'

type Tab = 'text' | 'number'

const EXAMPLES = ['غم عشق', 'محمد', 'عدل مظفر', 'یا علی', 'الله']
const HISTORY_KEY = 'abjad-history'
const PREFS_KEY = 'abjad-prefs'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'fa-IR',
    },
    {
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SEO_DESCRIPTION,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      inLanguage: 'fa-IR',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'IRR' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

const HomePage = () => {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('text')
  const [text, setText] = useState('')
  const [numInput, setNumInput] = useState('')
  const [active, setActive] = useState<SystemKey>('kabir')
  const [zhZero, setZhZero] = useState(false)
  const [faDigits, setFaDigits] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [toast, setToast] = useState('')

  // بارگذاری تنظیمات و تاریخچه ذخیره‌شده
  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY)
      if (h) setHistory(JSON.parse(h))
      const p = localStorage.getItem(PREFS_KEY)
      if (p) {
        const prefs = JSON.parse(p)
        if (typeof prefs.zhZero === 'boolean') setZhZero(prefs.zhZero)
        if (typeof prefs.faDigits === 'boolean') setFaDigits(prefs.faDigits)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ zhZero, faDigits }))
    } catch {}
  }, [zhZero, faDigits])

  // لینک مستقیم: /?q=محمد
  useEffect(() => {
    if (!router.isReady) return
    const q = router.query.q
    if (typeof q === 'string' && q.trim()) setText(q.slice(0, 500))
  }, [router.isReady, router.query.q])

  const result = useMemo(() => calculateAbjad(text, { zhZero }), [text, zhZero])
  const hasResult = result.letterCount > 0
  const fmt = useCallback((n: number) => formatNumber(n, faDigits), [faDigits])

  // ذخیره خودکار در تاریخچه بعد از مکث کوتاه
  useEffect(() => {
    const t = text.trim()
    if (!t || !hasResult) return
    const id = setTimeout(() => {
      setHistory((prev) => {
        const next = [t, ...prev.filter((x) => x !== t)].slice(0, 8)
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
        } catch {}
        return next
      })
    }, 1500)
    return () => clearTimeout(id)
  }, [text, hasResult])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const copy = async (value: string, msg = 'کپی شد ✓') => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setToast(msg)
  }

  const summary = () =>
    `«${text.trim()}» ← ` +
    SYSTEMS.map((s) => `${s.label}: ${fmt(result.totals[s.key])}`).join(' | ')

  const share = async () => {
    const url = `${SITE_URL}/?q=${encodeURIComponent(text.trim())}`
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: SITE_NAME,
          text: summary(),
          url,
        })
        return
      } catch {}
    }
    copy(url, 'لینک اشتراک‌گذاری کپی شد ✓')
  }

  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {}
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const cur =
      root.dataset.theme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    const next = cur === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem('abjad-theme', next)
    } catch {}
  }

  // تب عدد به حرف
  const n = parseNumberInput(numInput)
  const letters = n ? numberToLetters(n) : ''
  const matches = useMemo(
    () => (n ? findWords(n, active, zhZero) : []),
    [n, active, zhZero]
  )

  return (
    <>
      <Head>
        <title>{SEO_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta
          name="keywords"
          content="ابجد, حروف ابجد, تبدیل ابجد, محاسبه ابجد, حساب جمل, ابجد کبیر, ابجد وسیط, ابجد صغیر, ابجد اسم, عدد ابجدی نام, ابجد مغربی"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESCRIPTION} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta
          name="google-site-verification"
          content="6ChpeaxAvopKBnRBFoZFtjvB8mf0O0RWb8P7tcrRTAA"
        />
      </Head>

      <AppInstallBanner />

      <div className="container">
        <header className="site-header">
          <div className="brand">
            <BrandLogo size="sm" />
            <span className="brand-name">{SITE_NAME}</span>
          </div>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="تغییر حالت روشن/تاریک"
            title="حالت روشن / تاریک"
          >
            🌓
          </button>
        </header>

        <section className="hero">
          <span className="badge">رایگان · سریع · بدون نیاز به ثبت‌نام</span>
          <h1>
            تبدیل <span>حروف ابجد</span> به عدد
          </h1>
          <p>
            نام یا عبارت خود را بنویسید تا ابجد کبیر، وسیط، صغیر و مغربی آن
            همزمان محاسبه شود. عدد را هم می‌توانید به حروف ابجد برگردانید.
          </p>
        </section>

        <main>
          <div className="card" id="calculator">
            <div className="tabs" role="tablist">
              <button
                role="tab"
                aria-selected={tab === 'text'}
                className={'tab' + (tab === 'text' ? ' active' : '')}
                onClick={() => setTab('text')}
              >
                متن به عدد
              </button>
              <button
                role="tab"
                aria-selected={tab === 'number'}
                className={'tab' + (tab === 'number' ? ' active' : '')}
                onClick={() => setTab('number')}
              >
                عدد به حرف و هم‌عدد‌یاب
              </button>
            </div>

            {tab === 'text' ? (
              <>
                <div className="field">
                  <label htmlFor="abjad">
                    کلمه یا عبارت مورد نظر را وارد کنید:
                  </label>
                  <textarea
                    id="abjad"
                    value={text}
                    maxLength={500}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="مثلاً: غم عشق"
                    autoFocus
                  />
                </div>

                <div className="chips">
                  <span className="label">نمونه:</span>
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      className="chip"
                      onClick={() => setText(ex)}
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                <div className="options">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={zhZero}
                      onChange={(e) => setZhZero(e.target.checked)}
                    />
                    ارزش «ژ» برابر صفر باشد
                  </label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={faDigits}
                      onChange={(e) => setFaDigits(e.target.checked)}
                    />
                    ارقام فارسی
                  </label>
                </div>

                {hasResult ? (
                  <>
                    <div className="results" aria-live="polite">
                      {SYSTEMS.map((s) => (
                        <button
                          key={s.key}
                          className={
                            'res-card' + (active === s.key ? ' active' : '')
                          }
                          onClick={() => setActive(s.key)}
                          title="نمایش جزئیات حروف با این سیستم"
                        >
                          <span className="res-name">ابجد {s.label}</span>
                          <span className="res-num">
                            {fmt(result.totals[s.key])}
                          </span>
                          <span className="res-hint">{s.hint}</span>
                        </button>
                      ))}
                    </div>

                    <div className="stats">
                      <div className="stat">
                        <b>{fmt(result.words.length)}</b>کلمه
                      </div>
                      <div className="stat">
                        <b>{fmt(result.letterCount)}</b>حرف
                      </div>
                      <div className="stat">
                        <b>{fmt(digitalRoot(result.totals[active]))}</b>ریشه
                        عددی
                      </div>
                      <div className="stat">
                        <b>{result.totals[active] % 2 === 0 ? 'زوج' : 'فرد'}</b>
                        نوع عدد
                      </div>
                    </div>

                    <div className="toolbar">
                      <button
                        className="btn btn-primary"
                        onClick={() => copy(summary())}
                      >
                        کپی نتیجه
                      </button>
                      <button className="btn" onClick={share}>
                        اشتراک‌گذاری
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setNumInput(String(result.totals.kabir))
                          setActive('kabir')
                          setTab('number')
                        }}
                      >
                        یافتن هم‌عدد
                      </button>
                      <button className="btn" onClick={() => setText('')}>
                        پاک کردن
                      </button>
                    </div>

                    {result.words.map((w, i) => (
                      <div className="word" key={i}>
                        <div className="word-head">
                          <strong>{w.word}</strong>
                          <span>{fmt(w[active])}</span>
                        </div>
                        <div className="letters">
                          {w.letters.map((l, j) => (
                            <span className="letter" key={j}>
                              <b>{l.ch}</b>
                              <i>{fmt(l[active])}</i>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {result.ignored.length > 0 && (
                      <p className="hint">
                        نویسه‌های نادیده‌گرفته‌شده: {result.ignored.join(' ')}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="hint">
                    {text
                      ? 'در متن وارد شده حرف فارسی یا عربی پیدا نشد.'
                      : 'فقط حروف فارسی و عربی به ابجد تبدیل می‌شوند.'}
                  </p>
                )}

                {history.length > 0 && (
                  <div className="history">
                    <span
                      className="label"
                      style={{ fontSize: 13, color: 'var(--muted)' }}
                    >
                      اخیر:
                    </span>
                    {history.map((h) => (
                      <button
                        key={h}
                        className="chip"
                        onClick={() => setText(h)}
                      >
                        {h}
                      </button>
                    ))}
                    <button
                      className="chip"
                      onClick={clearHistory}
                      aria-label="پاک کردن تاریخچه"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="alert" role="note">
                  در بعضی از نسخه‌های ابجد ارزش حرف «ژ» برابر با (۰) است؛ با
                  گزینه بالا می‌توانید این حالت را فعال کنید.
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="abjad-num">
                    عددی بین ۱ تا ۹۹٬۹۹۹ وارد کنید:
                  </label>
                  <input
                    id="abjad-num"
                    type="text"
                    inputMode="numeric"
                    value={numInput}
                    onChange={(e) => setNumInput(e.target.value)}
                    placeholder="مثلاً ۱۳۲۴"
                    dir="ltr"
                  />
                </div>

                <div className="options">
                  {SYSTEMS.map((s) => (
                    <label className="switch" key={s.key}>
                      <input
                        type="radio"
                        name="sys"
                        checked={active === s.key}
                        onChange={() => setActive(s.key)}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      هم‌عدد در {s.label}
                    </label>
                  ))}
                </div>

                {n ? (
                  <>
                    <div className="hint">
                      نمایش با ابجد کبیر برای عدد {formatNumber(n, faDigits)}
                    </div>
                    <div className="big-letters" aria-live="polite">
                      {letters}
                    </div>
                    <div
                      className="toolbar"
                      style={{ justifyContent: 'center' }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => copy(letters)}
                      >
                        کپی حروف
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setText(letters)
                          setActive('kabir')
                          setTab('text')
                        }}
                      >
                        بررسی در محاسبه‌گر
                      </button>
                    </div>

                    <div className="section" style={{ marginTop: 20 }}>
                      <h3 style={{ fontSize: 16 }}>
                        نام‌ها و واژه‌های هم‌عدد در ابجد{' '}
                        {SYSTEMS.find((s) => s.key === active)?.label}
                      </h3>
                      {matches.length ? (
                        <div className="chips">
                          {matches.map((m) => (
                            <button
                              key={m}
                              className="chip"
                              onClick={() => {
                                setText(m)
                                setTab('text')
                              }}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="hint" style={{ textAlign: 'right' }}>
                          در فهرست واژه‌های سایت مورد هم‌عدد پیدا نشد. می‌توانید
                          عبارت دلخواه را در تب «متن به عدد» بسنجید.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="hint">
                    {numInput
                      ? 'یک عدد صحیح بین ۱ تا ۹۹٬۹۹۹ وارد کنید.'
                      : 'مثلاً ۱۳۲۴ را وارد کنید و ببینید معادل ابجد آن چیست.'}
                  </p>
                )}
              </>
            )}
          </div>

          <nav className="section internal-links" aria-label="راهنمای ابجد">
            <Link href="/abjad-kabir/">ابجد کبیر</Link>
            <Link href="/abjad-vasit/">ابجد وسیط</Link>
            <Link href="/abjad-saghir/">ابجد صغیر</Link>
            <Link href="/abjad-maghribi/">ابجد مغربی</Link>
            <Link href="/abjad-table/">جدول ابجد</Link>
            <Link href="/number-to-abjad/">عدد به ابجد</Link>
            <Link href="/hesab-jomal/">حساب جمل</Link>
          </nav>

          <section className="section" id="table">
            <h2>جدول کامل ارزش حروف ابجد</h2>
            <LettersTable zhZero={zhZero} />
          </section>

          <AbjadAbout />
        </main>

        <footer className="footer">
          <nav className="internal-links" aria-label="صفحه‌های سایت">
            <Link href="/hesab-jomal/">درباره حساب جمل</Link>
            <Link href="/abjad-table/">جدول حروف</Link>
            <Link href="/number-to-abjad/">تبدیل عدد به حرف</Link>
          </nav>
          {SITE_NAME} · محاسبه ابجد کبیر، وسیط، صغیر و مغربی
          <br />
          <span>
            © ۱۴۰۵{' '}
            <a
              className="internal-ehsan"
              href="https://ehsan-kazemi.ir/"
              target="_blank"
            >
              احسان کاظمی
            </a>
            . تمامی حقوق محفوظ است.
          </span>
        </footer>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  )
}

export default HomePage
