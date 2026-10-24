import { ImageResponse } from "next/og";
import { BrandIcon } from "@/lib/brand-icon";

const SIZES = [192, 512];

export const dynamicParams = false;

export function generateStaticParams() {
  return SIZES.map((s) => ({ size: String(s) }));
}

export async function GET(_req: Request, ctx: RouteContext<"/pwa-icon/[size]">) {
  const { size } = await ctx.params;
  const px = Number(size);
  return new ImageResponse(<BrandIcon size={px} />, { width: px, height: px });
}
