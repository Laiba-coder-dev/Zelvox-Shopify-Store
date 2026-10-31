"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import type { Dict } from "@/locales/en";
import { setPreferences } from "@/lib/client";

type Props = { dict: Dict; initialOpen: boolean };

/**
 * Cookie controls: a consent banner on first visit plus a footer trigger that
 * re-opens it. Only functional cookies exist on this site — see /privacy.
 */
export default function CookieConsent({ dict, initialOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOpen(initialOpen);
    const reopen = () => {
      setSaved(false);
      setOpen(true);
    };
    window.addEventListener("mge:cookie-settings", reopen);
    return () => window.removeEventListener("mge:cookie-settings", reopen);
  }, [initialOpen]);

  if (!open) return null;

  const choose = async (value: "accepted" | "essential") => {
    const ok = await setPreferences({ cookieConsent: value });
    if (ok) {
      setSaved(true);
      setOpen(false);
    }
  };

  return (
    <div
      role="region"
      aria-label={dict.cookies.title}
      className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-lift sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-950">{dict.cookies.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-600">
              {saved ? dict.cookies.saved : dict.cookies.body} {dict.cookies.bannerAlt}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:ml-auto sm:flex-row">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-lg border border-line-strong px-4 py-2.5 text-xs font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50"
          >
            {dict.cookies.essential}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-lg bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-navy-700"
          >
            {dict.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
