export default function hello() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-bold text-3xl">Cookie Policy</h1>

      <p className="mb-8 text-muted-foreground text-sm">
        Last updated: August 7th, 2025
      </p>

      <p className="mb-8">
        SpeedyGhost AI, LLC ("SpeedyGhost", "we", "us", or "our") uses cookies
        and similar technologies on our website. This policy explains what
        cookies are, how we use them, and your choices regarding cookies.
      </p>

      <h2 className="mb-4 font-semibold text-2xl">What Are Cookies</h2>
      <p className="mb-8">
        Cookies are small text files stored on your device when you visit our
        website. They help us remember your preferences and understand how you
        use our site.
      </p>

      <h2 className="mb-4 font-semibold text-2xl">Types of Cookies We Use</h2>

      <h3 className="mb-2 font-medium text-xl">Essential Cookies:</h3>
      <ul className="mb-6 list-disc pl-6">
        <li>Required for basic website functionality</li>
        <li>Remember your login status and preferences</li>
        <li>Cannot be disabled without affecting site performance</li>
      </ul>

      <h3 className="mb-2 font-medium text-xl">Analytics Cookies:</h3>
      <ul className="mb-6 list-disc pl-6">
        <li>Help us understand how visitors use our website</li>
        <li>Provide insights on popular pages and user behavior</li>
        <li>Used to improve our website and services</li>
      </ul>

      <h3 className="mb-2 font-medium text-xl">Marketing Cookies:</h3>
      <ul className="mb-8 list-disc pl-6">
        <li>Track visitors across websites for advertising purposes</li>
        <li>Help us show relevant ads and measure campaign effectiveness</li>
        <li>May be set by third-party advertising partners</li>
      </ul>

      <h2 className="mb-4 font-semibold text-2xl">How We Use Cookies</h2>
      <p className="mb-2">We use cookies to:</p>
      <ul className="mb-8 list-disc pl-6">
        <li>Keep you logged in during your visit</li>
        <li>Remember your preferences and settings</li>
        <li>Analyze website traffic and performance</li>
        <li>Improve user experience</li>
        <li>Deliver relevant marketing content</li>
      </ul>

      <h2 className="mb-4 font-semibold text-2xl">Third-Party Cookies</h2>
      <p className="mb-2">
        We may use third-party services that set their own cookies, including:
      </p>
      <ul className="mb-4 list-disc pl-6">
        <li>Google Analytics (website analytics)</li>
        <li>Social media platforms (sharing buttons)</li>
        <li>Advertising networks (targeted ads)</li>
      </ul>
      <p className="mb-8">
        These third parties have their own cookie policies governing their use
        of cookies.
      </p>

      <h2 className="mb-4 font-semibold text-2xl">Your Cookie Choices</h2>
      <h3 className="mb-2 font-medium text-xl">Browser Settings:</h3>
      <p className="mb-2">
        You can control cookies through your browser settings. Most browsers
        allow you to:
      </p>
      <ul className="mb-6 list-disc pl-6">
        <li>View and delete cookies</li>
        <li>Block cookies from specific sites</li>
        <li>Block all cookies (may affect website functionality)</li>
      </ul>

      <h3 className="mb-2 font-medium text-xl">Opt-Out:</h3>
      <p className="mb-2">
        You can opt out of analytics and advertising cookies through:
      </p>
      <ul className="mb-8 list-disc pl-6">
        <li>
          Google Analytics Opt-out:{" "}
          <a
            className="text-primary hover:underline"
            href="https://tools.google.com/dlpage/gaoptout"
          >
            tools.google.com/dlpage/gaoptout
          </a>
        </li>
        <li>
          Industry opt-out tools:{" "}
          <a
            className="text-primary hover:underline"
            href="http://optout.aboutads.info"
          >
            optout.aboutads.info
          </a>
        </li>
      </ul>

      <h2 className="mb-4 font-semibold text-2xl">Cookie Retention</h2>
      <p className="mb-2">Cookies are retained for different periods:</p>
      <ul className="mb-8 list-disc pl-6">
        <li>Session cookies: Deleted when you close your browser</li>
        <li>
          Persistent cookies: Remain until expiration date or manual deletion
        </li>
        <li>Typical retention: 30 days to 2 years depending on purpose</li>
      </ul>

      <h2 className="mb-4 font-semibold text-2xl">Updates to This Policy</h2>
      <p className="mb-8">
        We may update this Cookie Policy periodically. Check this page for the
        most current version.
      </p>

      <h2 className="mb-4 font-semibold text-2xl">Contact Us</h2>
      <p className="mb-2">
        For questions about our use of cookies, contact us at:
      </p>
      <p className="mb-1">Email: privacy@speedyghost.ai</p>
      <p className="mb-8">
        Address: SpeedyGhost AI, LLC 8613 Hawthorn Dr, The Colony, TX 75056
      </p>

      <p className="text-muted-foreground text-sm">
        By continuing to use our website, you consent to our use of cookies as
        described in this policy.
      </p>
    </div>
  );
}
