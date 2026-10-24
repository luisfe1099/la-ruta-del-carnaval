import Image from "next/image";
import type { PublicImage } from "@/data/public";

/**
 * Imagen optimizada (next/image) o placeholder tierra/cartón si aún no hay foto.
 * El contenedor padre debe ser `relative` y tener tamaño.
 */
export function Media({
  image,
  sizes,
  priority = false,
  className = "",
}: {
  image: PublicImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={`tone-${image.tone} absolute inset-0 ${className}`}
    />
  );
}
