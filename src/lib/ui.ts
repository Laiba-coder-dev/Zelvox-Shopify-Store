/** Join class names, dropping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Shared button styles. */
export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-navy-700 hover:shadow-lift active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
  accent:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 hover:shadow-lift active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
  ghostLight:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60",
  small:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50 disabled:opacity-60",
};

/** Shared form field styles. */
export const field = {
  input:
    "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15 disabled:bg-surface-2",
  select:
    "w-full appearance-none rounded-lg border border-line-strong bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235f7288%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_0.85rem_center] bg-no-repeat px-3.5 py-2.5 pr-9 text-sm text-ink-900 transition focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15",
  textarea:
    "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15",
  label:
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600",
  error: "mt-1.5 text-xs font-medium text-red-600",
  hint: "mt-1.5 text-xs text-ink-500",
};
