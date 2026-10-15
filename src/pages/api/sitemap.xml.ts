import type { NextApiRequest, NextApiResponse } from 'next'
import { SITE_URL } from '../../lib/content'

export default function handler(
  _request: NextApiRequest,
  response: NextApiResponse
) {
  response.setHeader('Content-Type', 'application/xml; charset=utf-8')
  response.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=86400, stale-while-revalidate'
  )
  response.status(200).send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>`
  )
}
