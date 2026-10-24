"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicImage } from "@/data/public";
import { Media } from "./media";

const pad = (n: number) => String(n).padStart(2, "0");

export function GalleryCarousel({ images }: { images: PublicImage[] }) {
  const t = useTranslations("float");
  const track = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(0);
  const total = images.length;

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement | null;
    if (!item) return;
    const step = item.offsetWidth + 10;
    setCurrent(Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  const go = (dir: number) => {
    const el = track.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (el && item) el.scrollBy({ left: dir * (item.offsetWidth + 10), behavior: "smooth" });
  };

  const openZoom = (i: number) => {
    setZoom(i);
    dialog.current?.showModal();
  };
  const step = (dir: number) => setZoom((z) => (z + dir + total) % total);

  return (
    <div>
      <ul
        ref={track}
        onScroll={onScroll}
        className="-mx-[22px] flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-[22px] pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        aria-label={t("gallery")}
      >
        {images.map((g, i) => (
          <li key={i} className="w-[80%] shrink-0 snap-start md:w-[60%] lg:w-[70%]">
            <button
              type="button"
              onClick={() => openZoom(i)}
              aria-label={`${t("expand")} ${i + 1}/${total}`}
              className="relative block h-[300px] w-full cursor-zoom-in overflow-hidden rounded-lg md:h-[380px]"
            >
              <Media image={g} sizes="(min-width: 1024px) 480px, 80vw" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between font-mono text-[11px] tracking-[0.1em]">
        <span aria-live="polite">
          {pad(current + 1)} / {pad(total)}
        </span>
        <span className="hidden gap-2 md:flex">
          <button type="button" onClick={() => go(-1)} aria-label={t("prev")} className="px-2 py-1 hover:text-arcilla">
            ←
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t("next")} className="px-2 py-1 hover:text-arcilla">
            →
          </button>
        </span>
      </div>

      <dialog
        ref={dialog}
        aria-label={t("gallery")}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-cafe/95 p-0 text-kraft backdrop:bg-cafe"
      >
        <div className="flex items-center justify-between px-4 py-3 font-mono text-[11px] tracking-[0.1em]">
          <span>
            {pad(zoom + 1)} / {pad(total)}
          </span>
          <button type="button" onClick={() => dialog.current?.close()} className="px-2 py-1">
            {t("closeGallery").toUpperCase()} ✕
          </button>
        </div>
        <div className="relative mx-auto h-[calc(100dvh-110px)] w-full max-w-5xl overflow-hidden rounded-lg">
          <Media key={zoom} image={images[zoom]} sizes="100vw" className="!object-contain" />
        </div>
        {total > 1 && (
          <div className="flex justify-center gap-10 py-3 font-mono text-lg">
            <button type="button" onClick={() => step(-1)} aria-label={t("prev")} className="px-4">
              ←
            </button>
            <button type="button" onClick={() => step(1)} aria-label={t("next")} className="px-4">
              →
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
