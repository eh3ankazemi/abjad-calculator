import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ir.ehsan-kazemi.abjad',
  appName: 'محاسبه‌گر ابجد',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://abjad-calculator-sooty.vercel.app',
    cleartext: process.env.CAPACITOR_ALLOW_CLEARTEXT === 'true',
  },
}

export default config
