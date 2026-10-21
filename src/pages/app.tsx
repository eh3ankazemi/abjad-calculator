import Head from 'next/head'
import Link from 'next/link'
import { APP_LINKS, APP_NAME } from '../lib/appLinks'

const STORES = [
  {
    key: 'bazaar',
    title: 'کافه‌بازار',
    desc: 'نصب از بازار؛ با به‌روزرسانی خودکار',
    href: APP_LINKS.bazaar,
    icon: '🛍️',
    external: true,
  },
  {
    key: 'myket',
    title: 'مایکت',
    desc: 'نصب از مایکت؛ با به‌روزرسانی خودکار',
    href: APP_LINKS.myket,
    icon: '📦',
    external: true,
  },
  {
    key: 'direct',
    title: 'دانلود مستقیم',
    desc: 'فایل APK را مستقیم از سایت دانلود کنید',
    href: APP_LINKS.direct,
    icon: '⬇️',
    external: false,
  },
]

const AppPage = () => (
  <>
    <Head>
      <title>{`دانلود اپلیکیشن ${APP_NAME}`}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex, follow" />
    </Head>

    <div className="container app-page">
      <Link href="/" className="back">
        → بازگشت به محاسبه‌گر
      </Link>

      <section className="hero">
        <h1>
          دانلود اپلیکیشن <span>{APP_NAME}</span>
        </h1>
        <p>یکی از روش‌های زیر را برای نصب انتخاب کنید.</p>
      </section>

      <div className="stores">
        {STORES.map((s) => (
          <a
            key={s.key}
            className={s.external ? 'store disable' : 'store'}
            href={s.external ? '#' : s.href}
            {...(s.external
              ? {}
              : // ? { target: '_blank', rel: 'noopener noreferrer' }
                { download: true })}
          >
            <span className="store-icon" aria-hidden>
              {s.icon}
            </span>
            <span className="store-body">
              <b>{s.title}</b>
              <small>{s.desc}</small>
            </span>
            <span className="store-arrow" aria-hidden>
              ‹
            </span>
          </a>
        ))}
      </div>

      <p className="note">
        برای نصب فایل APK ممکن است لازم باشد در تنظیمات گوشی، نصب از منابع
        ناشناس را برای مرورگر فعال کنید.
      </p>

      <style jsx>{`
        .app-page {
          padding-top: 24px;
          padding-bottom: 48px;
        }
        :global(.back) {
          display: inline-block;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--muted, #777);
          text-decoration: none;
        }
        .stores {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 520px;
          margin: 24px auto 0;
        }
        .store {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 16px;
          background: var(--card, #fff);
          border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
          color: inherit;
          text-decoration: none;
          transition:
            transform 0.15s ease,
            border-color 0.15s ease;
        }
        .store:hover,
        .store:focus-visible {
          transform: translateY(-2px);
          border-color: var(--accent, #2563eb);
        }
        .store-icon {
          font-size: 28px;
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(127, 127, 127, 0.12);
          flex-shrink: 0;
        }
        .store-body {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }
        .store-body b {
          font-size: 16px;
        }
        .store-body small {
          font-size: 13px;
          color: var(--muted, #777);
        }
        .store-arrow {
          font-size: 22px;
          color: var(--muted, #777);
        }
        .note {
          max-width: 520px;
          margin: 20px auto 0;
          font-size: 12.5px;
          line-height: 1.9;
          color: var(--muted, #777);
          text-align: center;
        }
        .disable {
          opacity: 50%;
          cursor: no-drop;
        }
      `}</style>
    </div>
  </>
)

export default AppPage
