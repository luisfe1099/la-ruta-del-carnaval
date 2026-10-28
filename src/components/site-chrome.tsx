"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Logo } from "./ui";

type Section = "home" | "detail" | "list";

function sectionOf(pathname: string): Section {
  if (pathname === "/") return "home";
  if (/^\/(carrozas|creadores|experiencias)\/[^/]+$/.test(pathname)) return "detail";
  return "list";
}

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

function LangSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <span className={`font-mono text-[11px] tracking-[0.08em] ${className}`} role="group" aria-label={t("language")}>
      {routing.locales.map((l, i) => (
        <span key={l}>
          {i > 0 && <span aria-hidden> · </span>}
          <Link
            href={pathname}
            locale={l}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "underline underline-offset-4" : "opacity-70 hover:opacity-100"}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </span>
  );
}

const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 18 18",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;

const Icons = {
  floats: (
    <svg {...icon}>
      <rect x="2" y="3" width="14" height="12" />
      <path d="M2 11l4-4 4 4 3-3 3 3" />
    </svg>
  ),
  map: (
    <svg {...icon}>
      <path d="M9 16s5-4.5 5-8.5a5 5 0 10-10 0C4 11.5 9 16 9 16z" />
      <circle cx="9" cy="7.5" r="1.6" />
    </svg>
  ),
  creators: (
    <svg {...icon}>
      <circle cx="9" cy="6" r="2.8" />
      <path d="M3.5 15.5c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
    </svg>
  ),
  dynamics: (
    <svg {...icon}>
      <path d="M9 2.5l1.9 4 4.4.5-3.3 3 .9 4.4L9 12.2 5.1 14.4 6 10 2.7 7l4.4-.5z" />
    </svg>
  ),
  more: (
    <svg {...icon} fill="currentColor" stroke="none">
      <circle cx="3.5" cy="9" r="1.4" />
      <circle cx="9" cy="9" r="1.4" />
      <circle cx="14.5" cy="9" r="1.4" />
    </svg>
  ),
};

export function SiteChrome() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const section = sectionOf(pathname);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSheetOpen(false);
  }
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (sheetOpen && !d.open) d.showModal();
    if (!sheetOpen && d.open) d.close();
  }, [sheetOpen]);


  const overlay = section !== "list";
  const backHref = pathname.startsWith("/creadores") ? "/creadores" : "/carrozas";

  const desktopLinks = [
    { href: "/carrozas", label: t("floats") },
    { href: "/mapa", label: t("map") },
    { href: "/creadores", label: t("creators") },
    { href: "/experiencias", label: t("experiences") },
    { href: "/dinamicas", label: t("dynamics") },
    { href: "/el-carnaval", label: t("carnival") },
    { href: "/como-participar", label: t("howTo") },
    { href: "/contacto", label: t("contact") },
  ];

  const sheetLinks = [
    { href: "/creadores", label: t("creators") },
    { href: "/experiencias", label: t("experiences") },
    { href: "/dinamicas", label: t("dynamics") },
    { href: "/el-carnaval", label: t("carnival") },
    { href: "/como-participar", label: t("howTo") },
    { href: "/contacto", label: t("contact") },
  ];

  const tabs = [
    { href: "/carrozas", label: t("floats"), icon: Icons.floats },
    { href: "/mapa", label: t("map"), icon: Icons.map },
    { href: "/creadores", label: t("creators"), icon: Icons.creators },
    { href: "/dinamicas", label: t("dynamics"), icon: Icons.dynamics },
  ];

  const tabClass = (active: boolean) =>
    `flex h-full flex-col items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity max-[360px]:text-[8.5px] max-[360px]:tracking-[0.03em] ${
      active ? "opacity-100" : "opacity-70 hover:opacity-100"
    }`;

  return (
    <>
      <header
        className={`z-40 ${
          overlay
            ? "absolute inset-x-0 top-0 text-kraft md:sticky md:border-b md:border-cafe/10 md:bg-kraft/90 md:text-cafe md:backdrop-blur"
            : "sticky top-0 border-b border-cafe/10 bg-kraft/95 text-cafe backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-[18px] md:px-8 md:py-4">
          {/* Móvil */}
          {section === "detail" ? (
            <Link href={backHref} className="font-mono text-[11px] tracking-[0.08em] md:hidden">
              ← {t("back").toUpperCase()}
            </Link>
          ) : (
            <Link href="/" aria-label={t("home")} className="text-[17px] md:hidden">
              <Logo />
            </Link>
          )}
          {section === "detail" && (
            <Link href="/" aria-label={t("home")} className="text-[17px] md:hidden">
              <span className="font-serif font-semibold">
                La Ruta<span className="text-bermellon">.</span>
              </span>
            </Link>
          )}
          {section === "home" ? (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="font-mono text-[11px] tracking-[0.08em] md:hidden"
            >
              {t("menu").toUpperCase()}
            </button>
          ) : (
            <LangSwitch className="md:hidden" />
          )}

          {/* Escritorio */}
          <Link href="/" aria-label={t("home")} className="hidden text-xl md:block">
            <Logo />
          </Link>
          <nav aria-label={t("primary")} className="hidden items-center gap-7 md:flex">
            {desktopLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.1em] transition-opacity ${
                  isActive(pathname, l.href) ? "underline underline-offset-[6px]" : "opacity-75 hover:opacity-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <LangSwitch />
          </nav>
        </div>
      </header>

      <nav
        aria-label={t("mobile")}
        className="fixed inset-x-3 bottom-[calc(var(--tabbar-gap)+env(safe-area-inset-bottom))] z-50 rounded-2xl bg-cafe text-kraft shadow-[0_8px_28px_rgba(43,29,20,0.35)] md:hidden"
      >
        <ul
          className="grid h-[var(--tabbar-h)] grid-cols-5 items-center gap-0.5 px-1"
        >
          {tabs.map((tab) => (
            <li key={tab.href} className="h-full">
              <Link
                href={tab.href}
                aria-current={isActive(pathname, tab.href) ? "page" : undefined}
                className={tabClass(isActive(pathname, tab.href))}
              >
                {tab.icon}
                {tab.label}
              </Link>
            </li>
          ))}
          <li className="h-full">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              className={`${tabClass(false)} w-full`}
            >
              {Icons.more}
              {t("more")}
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={dialogRef}
        onClose={() => setSheetOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setSheetOpen(false)}
        aria-label={t("more")}
        className="m-0 mt-auto w-full max-w-none bg-cafe p-0 text-kraft backdrop:bg-cafe/60 md:hidden"
      >
        <div className="px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">{t("menu")}</span>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="font-mono text-[11px] tracking-[0.08em]"
            >
              {t("close").toUpperCase()} ✕
            </button>
          </div>
          <ul className="mt-4">
            {sheetLinks.map((l) => (
              <li key={l.href} className="border-t border-kraft/15">
                <Link href={l.href} className="block py-4 font-serif text-2xl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-kraft/15 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] opacity-60">{t("language")}</span>
            <LangSwitch />
          </div>
        </div>
      </dialog>
    </>
  );
}
