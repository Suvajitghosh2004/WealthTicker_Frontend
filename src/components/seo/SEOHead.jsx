import { Helmet } from 'react-helmet-async'

const SEOHead = ({
  title,
  description,
  ogImage,
  canonical,
  type = 'website',
  article,
  breadcrumb
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://wealthticker.vercel.app'
  const siteName = import.meta.env.VITE_SITE_NAME || 'WealthTicker'
  const defaultImage = `${siteUrl}/og-default.jpg`
  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} — Smart Money. Better Life.`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content={siteName} />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      <meta name="content-language" content="en-US" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      <meta name="twitter:site" content="@wealthticker" />

      {/* Article schema */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            image: article.ogImage || defaultImage,
            author: {
              '@type': 'Person',
              name: article.author || siteName
            },
            publisher: {
              '@type': 'Organization',
              name: siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/favicon.svg`
              }
            },
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            description: article.excerpt,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonical
            }
          })}
        </script>
      )}

      {/* Breadcrumb schema */}
      {breadcrumb && breadcrumb.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumb.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url
            }))
          })}
        </script>
      )}

      {/* Website schema */}
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            url: siteUrl,
            description: 'Smart Money. Better Life.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          })}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead