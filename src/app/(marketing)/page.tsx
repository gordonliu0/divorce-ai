import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-8 pt-40 pb-28 text-center">
        <h1 className="max-w-4xl font-serif text-5xl font-medium leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Stop reviewing bank statements for hours.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[hsl(0_0%_45%)]">
          Upload your client&apos;s financial documents. Get flagged anomalies,
          marital waste detection, and a court-ready report in minutes.
        </p>
        <Link
          href="/auth/signup"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[hsl(0_0%_12%)] px-6 py-3 text-sm font-medium text-[hsl(0_0%_96.5%)] transition-colors hover:bg-[hsl(0_0%_20%)]"
        >
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* Features */}
      <section className="bg-[hsl(0_0%_93%)] py-24">
        <div className="mx-auto w-full max-w-7xl px-8">
          <p className="text-sm font-medium uppercase tracking-widest text-[hsl(0_0%_45%)]">
            What DivorceAI does
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-16 sm:grid-cols-2">
            <Feature
              number="01"
              title="Automated document parsing"
              description="Upload hundreds of pages of bank statements, tax returns, and financial docs. Get structured, searchable data back instantly."
            />
            <Feature
              number="02"
              title="Marital waste detection"
              description="Every transaction scanned for red flags. Unexplained withdrawals, suspicious transfers, and hidden spending surfaced automatically."
            />
            <Feature
              number="03"
              title="Disclosure gap analysis"
              description="Cross-check Net Worth Statements against supporting docs. Missing accounts and timeline gaps caught before opposing counsel does."
            />
            <Feature
              number="04"
              title="Court-ready reports"
              description="One click to export a professional PDF with verified findings, flagged items, and full audit trail. Ready for court or client review."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center rounded-2xl bg-[hsl(0_0%_15%)] px-8 py-24 text-center">
          <h2 className="max-w-2xl font-serif text-3xl font-medium leading-tight tracking-tight text-[hsl(0_0%_96.5%)] sm:text-4xl">
            Get started with DivorceAI.
          </h2>
          <Link
            href="/auth/signup"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[hsl(0_0%_30%)] bg-[hsl(0_0%_22%)] px-6 py-3 text-sm font-medium text-[hsl(0_0%_96.5%)] transition-colors hover:bg-[hsl(0_0%_28%)]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(0_0%_10%)] px-8 py-16 text-[hsl(0_0%_70%)]">
        <div className="mx-auto flex w-full max-w-7xl justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight text-[hsl(0_0%_96.5%)]">
              DivorceAI
            </span>
            <span className="text-xs text-[hsl(0_0%_50%)]">
              &copy; {new Date().getFullYear()} DivorceAI. All rights reserved.
            </span>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-[hsl(0_0%_50%)]">
                Product
              </span>
              <Link href="/#features" className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]">
                Features
              </Link>
              <Link href="/pricing" className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]">
                Pricing
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-[hsl(0_0%_50%)]">
                Legal
              </span>
              <Link href="/privacy" className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]">
                Privacy
              </Link>
              <Link href="/tos" className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-[hsl(0_0%_80%)] pt-6">
      <span className="text-xs tabular-nums text-[hsl(0_0%_45%)]">{number}</span>
      <h3 className="mt-3 font-serif text-xl font-medium tracking-tight">
        {title}
      </h3>
      <p className="mt-3 leading-relaxed text-[hsl(0_0%_45%)]">
        {description}
      </p>
    </div>
  );
}
