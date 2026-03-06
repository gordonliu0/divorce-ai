export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="font-light text-4xl tracking-tight">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with the right team at SpeedyGhost AI
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-muted-foreground/20 p-6">
            <h2 className="font-medium text-xl">Sales & Partnerships</h2>
            <p className="text-muted-foreground text-sm">
              For inquiries about our products, pricing, and partnerships
            </p>
            <div>
              <a
                className="text-blue-500 text-sm hover:text-blue-600"
                href="mailto:sales@speedyghost.ai"
              >
                sales@speedyghost.ai
              </a>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-muted-foreground/20 p-6">
            <h2 className="font-medium text-xl">Support</h2>
            <p className="text-muted-foreground text-sm">
              For technical assistance and customer support
            </p>
            <div>
              <a
                className="text-blue-500 text-sm hover:text-blue-600"
                href="mailto:support@speedyghost.ai"
              >
                support@speedyghost.ai
              </a>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-muted-foreground/20 p-6">
            <h2 className="font-medium text-xl">Press & Media</h2>
            <p className="text-muted-foreground text-sm">
              For media inquiries, press kits, and brand assets
            </p>
            <div>
              <a
                className="text-blue-500 text-sm hover:text-blue-600"
                href="mailto:press@speedyghost.ai"
              >
                press@speedyghost.ai
              </a>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-muted-foreground/20 p-6">
            <h2 className="font-medium text-xl">General Inquiries</h2>
            <p className="text-muted-foreground text-sm">
              For all other questions and information
            </p>
            <div>
              <a
                className="text-blue-500 text-sm hover:text-blue-600"
                href="mailto:hello@speedyghost.ai"
              >
                hello@speedyghost.ai
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-sm">
          <p>We aim to respond to all inquiries within 24 business hours.</p>
        </div>
      </div>
    </div>
  );
}
