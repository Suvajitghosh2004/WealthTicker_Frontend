import {
  TwitterShareButton, FacebookShareButton,
  WhatsappShareButton, PinterestShareButton,
  XIcon, FacebookIcon, WhatsappIcon, PinterestIcon
} from 'react-share'

export default function ShareButtons({ url, title, image }) {
  const fullUrl = `${import.meta.env.VITE_SITE_URL || ''}${url}`

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-600">Share:</span>
      <TwitterShareButton url={fullUrl} title={title}>
        <XIcon size={36} round bgStyle={{ fill: '#000' }} />
      </TwitterShareButton>
      <FacebookShareButton url={fullUrl} quote={title}>
        <FacebookIcon size={36} round />
      </FacebookShareButton>
      <WhatsappShareButton url={fullUrl} title={title}>
        <WhatsappIcon size={36} round />
      </WhatsappShareButton>
      {image && (
        <PinterestShareButton url={fullUrl} media={image} description={title}>
          <PinterestIcon size={36} round />
        </PinterestShareButton>
      )}
    </div>
  )
}
