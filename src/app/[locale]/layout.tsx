import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { SiteChrome } from "@/components/site-chrome";
import { SwRegister } from "@/components/sw-register";
import { isLocale, routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2B1D14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("titleHome"), template: `%s · ${SITE_NAME}` },
    description: t("description"),
    applicationName: SITE_NAME,
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "es" ? "es_CO" : "en_US",
      title: t("titleHome"),
      description: t("description"),
    },
    twitter: { card: "summary_large_image" },
    appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <a
            href="#contenido"
            className="sr-only z-[200] bg-cafe px-4 py-2 text-kraft focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
          >
            {nav("skip")}
          </a>
          <SiteChrome />
          <div className="pb-tabbar">
            <main id="contenido">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <SwRegister />
      </body>
    </html>
  );
}
