# محاسبه‌گر ابجد

ابزار فارسی محاسبه ابجد کبیر، وسیط، صغیر و مغربی، تبدیل عدد به حروف و یافتن
واژه‌های هم‌عدد. این پروژه با Next.js و Pages Router اجرا می‌شود.

## اجرا

```bash
bun install
bun dev
```

برای ساخت و اجرای نسخه production:

```bash
bun run build
bun start
```

## نشانی اصلی سایت و SEO

برای تنظیم canonical، Open Graph و نشانی‌های sitemap و robots، متغیر
`NEXT_PUBLIC_SITE_URL` را هنگام build به دامنه اصلی سایت تنظیم کنید؛ مقدار پیش‌فرض
در `src/lib/content.ts` قرار دارد. مسیرهای `/robots.txt` و `/sitemap.xml` بر اساس
همین دامنه تولید می‌شوند.
