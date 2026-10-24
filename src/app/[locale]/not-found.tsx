import { useTranslations } from "next-intl";
import { Container, InternalButton } from "@/components/ui";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container as="section" className="py-24 text-center">
      <p className="font-mono text-xs tracking-[0.14em] text-arcilla">404</p>
      <h1 className="mt-3 font-serif text-4xl">{t("title")}</h1>
      <p className="mt-3 text-sm opacity-75">{t("text")}</p>
      <InternalButton href="/" className="mt-6">
        {t("cta")}
      </InternalButton>
    </Container>
  );
}
