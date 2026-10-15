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

## اپ اندروید (Capacitor)

اپ اندروید محتوای سایت منتشرشده را در WebView نمایش می‌دهد و برای کارکرد به
اینترنت نیاز دارد. Android Studio و JDK سازگار با Android Gradle Plugin را نصب
کنید، سپس اجرا کنید:

```powershell
bun install
bun run android:build
```

پروژهٔ بومی در `android/` ساخته می‌شود و APK آزمایشی در
`android/app/build/outputs/apk/debug/app-debug.apk` قرار می‌گیرد. برای باز کردن
پروژه در Android Studio از `bunx cap open android` استفاده کنید. نشانی پیش‌فرض
از متغیر `NEXT_PUBLIC_SITE_URL` خوانده می‌شود؛ می‌توانید آن را هنگام ساخت عوض کنید:

```powershell
./build-android.ps1 -ServerUrl https://example.com
```
