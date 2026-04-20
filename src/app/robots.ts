import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Keeps search engines OUT of your admin panel
    },
    sitemap: 'https://www.fidaglobal.com/sitemap.xml',
  }
}
