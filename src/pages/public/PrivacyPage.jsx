import SEOHead from '../../components/seo/SEOHead.jsx'

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="WealthTicker privacy policy — how we collect, use, and protect your data."
        canonical={`${import.meta.env.VITE_SITE_URL}/privacy`}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly (name, email for newsletter subscriptions, comments) and information collected automatically (IP address, browser type, pages visited, time on site) via cookies and analytics tools.</p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To send newsletters you have subscribed to</li>
              <li>To display and moderate comments</li>
              <li>To improve our content and user experience</li>
              <li>To serve relevant advertising via Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2>3. Google AdSense & Cookies</h2>
            <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this and other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
          </section>

          <section>
            <h2>4. Amazon Associates</h2>
            <p>WealthTicker is a participant in the Amazon Services LLC Associates Program. When you click Amazon affiliate links, Amazon may set cookies to track purchases. Amazon's privacy policy applies to all interactions on their platform.</p>
          </section>

          <section>
            <h2>5. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with trusted service providers (email delivery, hosting, analytics) solely to operate this website.</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You may request deletion of your personal data, unsubscribe from our newsletter at any time, and opt out of cookies via your browser settings.</p>
          </section>

          <section>
            <h2>7. Children's Privacy</h2>
            <p>WealthTicker is not directed at children under 13. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>Questions about this policy? <a href="/contact">Contact us here</a>.</p>
          </section>
        </div>
      </div>
    </>
  )
}
