import { getTranslations } from "next-intl/server";
import { Container, Logo, Seal } from "./ui";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="bg-cafe py-9 text-kraft md:py-14">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo className="text-xl" />
          <p className="mt-2 max-w-sm text-[13px] opacity-65">{t("text")}</p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] opacity-45">{t("rights")}</p>
        </div>
        <Seal text={t("seal")} />
      </Container>
    </footer>
  );
}
