import type { NextApiRequest, NextApiResponse } from 'next'
import { SITE_URL } from '../../lib/content'

export default function handler(
  _request: NextApiRequest,
  response: NextApiResponse
) {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=86400, stale-while-revalidate'
  )
  response.status(200).send(
    `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`
  )
}
