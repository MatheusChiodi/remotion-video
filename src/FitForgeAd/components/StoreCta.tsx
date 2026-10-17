import { Img, staticFile } from "remotion";
import { assets, copy, palette } from "../fitforge";
import { fonts } from "../theme";

export const StoreButton: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      padding: `${size * 0.42}px ${size * 1.05}px`,
      borderRadius: 9999,
      background: `linear-gradient(180deg, ${palette.emberHot}, ${palette.ember} 55%, ${palette.emberDeep})`,
      boxShadow: "0 24px 70px -18px rgba(255, 106, 26, 0.75)",
      fontFamily: fonts.title,
      fontSize: size,
      lineHeight: 1.1,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      color: "#1a0a02",
      whiteSpace: "nowrap",
    }}
  >
    {copy.cta.button}
  </div>
);

// Badge oficial só quando o arquivo existe em public/fitforge; senão, texto
export const StoreBadge: React.FC<{ size: number }> = ({ size }) =>
  assets.playBadge ? (
    <Img src={staticFile(assets.playBadge)} style={{ height: size * 2.6 }} />
  ) : (
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 500,
        fontSize: size,
        color: palette.textDim,
      }}
    >
      {copy.cta.badgeFallback}
    </div>
  );
