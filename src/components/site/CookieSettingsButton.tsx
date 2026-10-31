"use client";

/** Re-opens the cookie banner from anywhere (footer link). */
export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("mge:cookie-settings"))}
      className="transition hover:text-white"
    >
      {label}
    </button>
  );
}
