# محاسبه‌گر ابجد

ابزار فارسی محاسبه ابجد کبیر، وسیط، صغیر و مغربی، تبدیل عدد به حروف و یافتن
واژه‌های هم‌عدد. این پروژه با Next.js و Pages Router اجرا می‌شود.

## اجرا

```bash
bun install
bun dev
```

برای ساخت نسخهٔ production (خروجی ایستا در `out/`):

```bash
bun run build
```

محتویات `out/` را می‌توان روی میزبان فایل ایستا منتشر کرد.

## نشانی اصلی سایت و SEO

برای تنظیم canonical، Open Graph و نشانی‌های sitemap و robots، متغیر
`NEXT_PUBLIC_SITE_URL` را هنگام build به دامنه اصلی سایت تنظیم کنید؛ مقدار پیش‌فرض
در `src/lib/content.ts` قرار دارد. مسیرهای `/robots.txt` و `/sitemap.xml` بر اساس
همین دامنه تولید می‌شوند.

## اپ اندروید (Capacitor)

اپ اندروید نسخهٔ ثابت سایت را درون APK بسته‌بندی می‌کند؛ محاسبه، جدول و تاریخچه
بدون اینترنت کار می‌کنند. Android Studio و JDK 21 را نصب کنید، سپس اجرا کنید:

```powershell
bun install
bun run android:build
```

پروژهٔ بومی در `android/` ساخته می‌شود و APK آزمایشی در
`android/app/build/outputs/apk/debug/app-debug.apk` قرار می‌گیرد. برای باز کردن
پروژه در Android Studio از `bunx cap open android` استفاده کنید. برای انتشار
نسخهٔ Release، کلید امضای اندروید را تنظیم و از دستور زیر استفاده کنید:

```powershell
./build-android.ps1 -Release
```
