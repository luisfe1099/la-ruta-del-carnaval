import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif font-semibold tracking-[-0.01em] ${className}`}>
      La Ruta del Carnaval<span className="text-bermellon">.</span>
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.14em] text-arcilla ${className}`}>
      {children}
    </p>
  );
}

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
}) {
  return <Tag className={`mx-auto w-full max-w-6xl px-[22px] md:px-8 ${className}`}>{children}</Tag>;
}

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-sans font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.98]";
const variants: Record<Variant, string> = {
  primary: "bg-bermellon text-white hover:bg-[#b02d19]",
  ghost: "border border-current hover:bg-cafe/5",
};
const sizes = { md: "px-5 py-3.5 text-sm", lg: "px-5 py-4 text-[15px]", sm: "px-4 py-3 text-[13px]" };

/** Enlace externo (WhatsApp, mapas) con estilo de botón. */
export function ExternalButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Omit<ComponentProps<"a">, "href"> & {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}

/** Enlace interno con estilo de botón. */
export function InternalButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link {...props} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} />;
}

export function Seal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex h-[72px] w-[72px] items-center justify-center whitespace-pre-line rounded-full border border-carton text-center font-mono text-[8px] leading-[1.5] tracking-[0.12em] opacity-80 ${className}`}
    >
      {text}
    </div>
  );
}

export function ArrowUpRight() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l6-6M4 3h5v5" />
    </svg>
  );
}
