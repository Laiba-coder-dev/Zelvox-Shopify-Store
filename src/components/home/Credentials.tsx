import Link from "next/link";
import { ArrowRight, Award, FileText } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type Credential, type Localized } from "@/lib/content";

type Props = {
  dict: Dict;
  locale: Locale;
  credentials: Credential[];
  note: Localized;
};

/**
 * Certifications are only rendered when the administrator has entered and
 * verified them — the site never fabricates credentials.
 */
export default function Credentials({ dict, locale, credentials, note }: Props) {
  return (
    <section className="bg-white py-14" aria-labelledby="credentials-title">
      <div className="container-x">
        <div className="rounded-3xl border border-line bg-surface-2 p-7 sm:p-10">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">{dict.home.credentialsTitle}</p>
              <h2 id="credentials-title" className="mt-4 text-2xl font-bold sm:text-3xl">
                {pick(note, locale) === ""
                  ? dict.home.isoNote
                  : locale === "de"
                    ? "Nachweise auf Nachfrage"
                    : "Documentation shared with qualified buyers"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{pick(note, locale)}</p>
            </div>
            <Link
              href="/about#credentials"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50"
            >
              {dict.about.credentials}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {credentials.length > 0 && (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {credentials.map((credential) => (
                <li
                  key={`${credential.name}-${credential.reference ?? ""}`}
                  className="rounded-2xl border border-line bg-white p-5"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Award className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink-950">{credential.name}</p>
                  <p className="mt-1 text-xs text-ink-500">{credential.issuer}</p>
                  {credential.reference && (
                    <p className="mt-1 font-mono text-[11px] text-ink-400">{credential.reference}</p>
                  )}
                  {credential.note && (
                    <p className="mt-2 text-xs leading-relaxed text-ink-600">{credential.note}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {credentials.length === 0 && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-ink-600">
              <FileText className="h-4 w-4 text-navy-700" aria-hidden="true" />
              {locale === "de"
                ? "Registrierungs-, Steuer- und Produktunterlagen werden qualifizierten Einkäufern im Onboarding bereitgestellt."
                : "Registration, tax and product documentation is shared with qualified buyers during onboarding."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
