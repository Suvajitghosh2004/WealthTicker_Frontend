export default function AffiliateCard({ productName, productImage, amazonUrl, price, badge }) {
  const tag = import.meta.env.VITE_AMAZON_TAG
  const affiliateUrl = amazonUrl
    ? `${amazonUrl}${amazonUrl.includes('?') ? '&' : '?'}tag=${tag}`
    : '#'

  return (
    <div className="affiliate-card border-2 border-brand-200 rounded-2xl p-5 my-8 bg-brand-50">
      <div className="flex gap-4 items-start">
        {productImage && (
          <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white border border-gray-100">
            <img src={productImage} alt={productName} className="w-full h-full object-contain p-1" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-gray-900 leading-tight">{productName}</h4>
            {badge && (
              <span className="badge bg-brand-500 text-white text-xs flex-shrink-0">{badge}</span>
            )}
          </div>
          {price && (
            <p className="text-brand-700 font-bold text-lg mb-3">{price}</p>
          )}
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="btn-amazon rounded-lg inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 448 512" fill="currentColor">
              <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56.7c-29.1-20.7-51.6-46.9-51.6-96.4v-143.7c0-83.3-45.2-113-136-113-82.1 0-101.2 34.4-127.2 100.8l74 29.2c4.1-29.6 14.9-55.4 52.4-55.4 23.2 0 43.6 8.3 43.6 48.4v9.4c.1.1-21.6-2.2-21.6 2zm21.8 85.8c0 61.4-19.6 90.7-47.5 90.7-26.5 0-47.5-20.8-47.5-55.4 0-41.5 33.4-53.9 95-56.3v21zm-157.4 238.5c0 33.4-23.7 44.1-43.1 44.1-22.4 0-33.4-15.8-43.7-33.4l-40.9 24.3c13.5 27.9 41.4 52.1 86.4 52.1 55.9 0 82.9-34.8 82.9-82.1v-116.8h-41.6v111.8zm77.1 21.5l41.8 11.5c-3 16.4-11.6 46.1-51.9 46.1-45.5 0-59.7-38.4-59.7-75.6 0-44.6 20.2-82.5 60.3-82.5 40.4 0 52.3 35.1 52.3 62.9 0 5.5-.4 11.2-1.4 16.1h-70.6c1.6 28.9 15.3 40.5 31.6 40.5 19.3 0 28.1-12.6 31.3-18.5l-34.3-26.5 1.7-16.2 66.5 24.4c-4.3 12.7-17.7 35.1-62.8 35.1-41.2-.1-65.7-32.9-65.7-75.7 0-46.7 26.3-84.1 72.5-84.1 42.6 0 61.9 28.6 66.5 57.5z"/>
            </svg>
            View on Amazon
          </a>
          <p className="text-xs text-gray-400 mt-2">
            As an Amazon Associate, WealthTicker earns from qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  )
}
