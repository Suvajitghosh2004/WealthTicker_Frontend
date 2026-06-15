import { Helmet } from 'react-helmet-async'

const SEOHead = ({
  title,
  description,
  ogImage,
  canonical,
  type = 'website',
  article
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://wealthticker.com'
  const siteName = import.meta.env.VITE_SITE_NAME || 'WealthTicker'
  const defaultImage = `${siteUrl}/og-default.jpg`

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : `${siteName} — Smart Money. Better Life.`}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Article schema */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            image: article.ogImage || defaultImage,
            author: { '@type': 'Person', name: article.author },
            publisher: {
              '@type': 'Organization',
              name: siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`
              }
            },
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            description: article.excerpt
          })}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead
