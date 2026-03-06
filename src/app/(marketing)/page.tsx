import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-8 pt-40 pb-28 text-center">
        <h1 className="max-w-4xl font-medium font-serif text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Stop reviewing bank statements for hours.
        </h1>
        <p className="mt-6 max-w-xl text-[hsl(0_0%_45%)] text-lg leading-relaxed">
          Upload your client&apos;s financial documents. Get flagged anomalies,
          marital waste detection, and a court-ready report in minutes.
        </p>
        <Link
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[hsl(0_0%_12%)] px-6 py-3 font-medium text-[hsl(0_0%_96.5%)] text-sm transition-colors hover:bg-[hsl(0_0%_20%)]"
          href="/auth/signup"
        >
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* Features */}
      <section className="bg-[hsl(0_0%_93%)] py-24">
        <div className="mx-auto w-full max-w-7xl px-8">
          <p className="font-medium text-[hsl(0_0%_45%)] text-sm uppercase tracking-widest">
            What DivorceAI does
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-16 sm:grid-cols-2">
            <Feature
              description="Upload hundreds of pages of bank statements, tax returns, and financial docs. Get structured, searchable data back instantly."
              number="01"
              title="Automated document parsing"
            />
            <Feature
              description="Every transaction scanned for red flags. Unexplained withdrawals, suspicious transfers, and hidden spending surfaced automatically."
              number="02"
              title="Marital waste detection"
            />
            <Feature
              description="Cross-check Net Worth Statements against supporting docs. Missing accounts and timeline gaps caught before opposing counsel does."
              number="03"
              title="Disclosure gap analysis"
            />
            <Feature
              description="One click to export a professional PDF with verified findings, flagged items, and full audit trail. Ready for court or client review."
              number="04"
              title="Court-ready reports"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center rounded-2xl bg-[hsl(0_0%_15%)] px-8 py-24 text-center">
          <h2 className="max-w-2xl font-medium font-serif text-3xl text-[hsl(0_0%_96.5%)] leading-tight tracking-tight sm:text-4xl">
            Get started with DivorceAI.
          </h2>
          <Link
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[hsl(0_0%_30%)] bg-[hsl(0_0%_22%)] px-6 py-3 font-medium text-[hsl(0_0%_96.5%)] text-sm transition-colors hover:bg-[hsl(0_0%_28%)]"
            href="/auth/signup"
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
            <span className="font-semibold font-serif text-[hsl(0_0%_96.5%)] text-lg tracking-tight">
              DivorceAI
            </span>
            <span className="text-[hsl(0_0%_50%)] text-xs">
              &copy; {new Date().getFullYear()} DivorceAI. All rights reserved.
            </span>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-medium text-[hsl(0_0%_50%)] text-xs uppercase tracking-widest">
                Product
              </span>
              <Link
                className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]"
                href="/#features"
              >
                Features
              </Link>
              <Link
                className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]"
                href="/pricing"
              >
                Pricing
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-medium text-[hsl(0_0%_50%)] text-xs uppercase tracking-widest">
                Legal
              </span>
              <Link
                className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]"
                href="/privacy"
              >
                Privacy
              </Link>
              <Link
                className="text-sm transition-colors hover:text-[hsl(0_0%_96.5%)]"
                href="/tos"
              >
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
    <div className="border-[hsl(0_0%_80%)] border-t pt-6">
      <span className="text-[hsl(0_0%_45%)] text-xs tabular-nums">
        {number}
      </span>
      <h3 className="mt-3 font-medium font-serif text-xl tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-[hsl(0_0%_45%)] leading-relaxed">{description}</p>
    </div>
  );
}
