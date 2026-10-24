"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

/** Convierte una URL de YouTube/Vimeo en URL embebible; null si no se reconoce. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video/${u.pathname.slice(1)}?autoplay=1`;
  } catch {}
  return null;
}

export function VideoModal({ url, className = "" }: { url: string; className?: string }) {
  const t = useTranslations("float");
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const embed = toEmbedUrl(url);

  if (!embed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        <PlayLabel label={t("watchIntro")} />
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          ref.current?.showModal();
        }}
        className={className}
      >
        <PlayLabel label={t("watchIntro")} />
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        onClose={() => setOpen(false)}
        aria-label={t("watchIntro")}
        className="m-auto w-[min(92vw,900px)] bg-cafe p-0 text-kraft backdrop:bg-cafe/80"
      >
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="block w-full px-4 py-3 text-right font-mono text-[11px] tracking-[0.08em]"
        >
          {t("closeVideo").toUpperCase()} ✕
        </button>
        <div className="aspect-video w-full">
          {open && (
            <iframe
              src={embed}
              title={t("watchIntro")}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          )}
        </div>
      </dialog>
    </>
  );
}

function PlayLabel({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-white">
      <i className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-xs not-italic">▶</i>
      {label}
    </span>
  );
}
