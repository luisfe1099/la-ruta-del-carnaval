import { ExternalButton } from "./ui";

/** Botón fijo móvil: queda justo encima de la barra inferior. */
export function StickyCta({ href, label }: { href: string; label: string }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] z-40 bg-gradient-to-b from-transparent to-kraft to-40% px-3.5 py-2.5 md:hidden">
      <ExternalButton href={href} size="lg" className="w-full">
        {label}
      </ExternalButton>
    </div>
  );
}
