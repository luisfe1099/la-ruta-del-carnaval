"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicImage } from "@/data/public";

/** Mínimo de fotos para que la secuencia se sienta como un giro. */
export const MIN_360_FRAMES = 8;

const PX_PER_TURN = 320;

export function Viewer360({ frames }: { frames: PublicImage[] }) {
  const t = useTranslations("float");
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; start: number } | null>(null);

  const wrap = (p: number) => ((p % 1) + 1) % 1;
  const p = wrap(pos);
  const index = Math.floor(p * frames.length) % frames.length;
  const degrees = Math.round(p * 360);
  const placeholder = frames.every((f) => !f.src);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, start: pos };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPos(drag.current.start - (e.clientX - drag.current.x) / PX_PER_TURN);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 1 / frames.length;
      if (e.key === "ArrowRight") setPos((v) => v + step);
      else if (e.key === "ArrowLeft") setPos((v) => v - step);
      else return;
      e.preventDefault();
    },
    [frames.length],
  );

  return (
    <div>
      <div
        role="slider"
        tabIndex={0}
        aria-label={t("rotateLabel")}
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={degrees}
        aria-valuetext={`${degrees}°`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
        className={`relative h-[240px] select-none overflow-hidden bg-cafe md:h-[420px] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "pan-y" }}
      >
        {placeholder ? (
          // Sin fotos reales: simula el giro desplazando un degradado de tierra.
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundSize: "300% 100%",
              backgroundPosition: `${p * 150}% 0`,
              backgroundImage:
                "linear-gradient(90deg,#6b4430,#C98B2B,#A8553A,#4a2f20,#3b2a1e,#6b4430)",
            }}
          />
        ) : (
          frames.map((f, i) => (
            <div key={i} className="absolute inset-0" style={{ visibility: i === index ? "visible" : "hidden" }}>
              {f.src && (
                <Image
                  src={f.src}
                  alt={i === index ? f.alt : ""}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 700px, 100vw"
                  priority={i === 0}
                  className="pointer-events-none object-cover"
                />
              )}
            </div>
          ))
        )}
        <div className="absolute left-3 top-3 bg-kraft px-2 py-[5px] font-mono text-[10px] tracking-[0.1em]">
          360° · {degrees}°
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-3.5 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-white">
          ← {t("rotateHint")} →
        </div>
      </div>
      <div className="mt-2.5 h-[3px] bg-cafe/15" aria-hidden>
        <div className="h-[3px] bg-arcilla" style={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
}
