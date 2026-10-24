/** Icono de marca para favicon / PWA: sello circular + punto bermellón. */
export function BrandIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#2B1D14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: size * 0.72,
          height: size * 0.72,
          borderRadius: "50%",
          border: `${Math.max(1, size * 0.015)}px solid #E4D3B8`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F3EBDD",
          fontSize: size * 0.42,
          fontWeight: 700,
        }}
      >
        R
        <span style={{ color: "#C8341E" }}>.</span>
      </div>
    </div>
  );
}
