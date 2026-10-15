import { writeFileSync } from 'node:fs'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://abjad-calculator-sooty.vercel.app'
).replace(/\/+$/, '')

writeFileSync(
  'public/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${siteUrl}/sitemap.xml\n`
)
writeFileSync(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`
)
