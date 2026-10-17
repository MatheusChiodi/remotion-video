import { Img, staticFile } from "remotion";
import { assets } from "../fitforge";

// `heat` 1 = metal recém-forjado, 0 = frio
export const AppIcon: React.FC<{ size: number; heat?: number }> = ({
  size,
  heat = 0,
}) => (
  <div
    style={{
      position: "relative",
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: size * 0.22,
      overflow: "hidden",
      boxShadow: `0 0 ${50 + heat * 160}px ${heat * 30}px rgba(255, 110, 30, ${0.22 + heat * 0.7}), 0 30px 80px -20px rgba(0,0,0,0.8)`,
    }}
  >
    <Img
      src={staticFile(assets.icon)}
      style={{
        width: "100%",
        height: "100%",
        filter: `brightness(${1 + heat * 0.7}) sepia(${heat}) saturate(${1 + heat * 2.5}) hue-rotate(${-heat * 18}deg)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 50% 55%, #fff3c4, #ff7a1a 55%, #e0301e)",
        mixBlendMode: "screen",
        opacity: heat * 0.75,
      }}
    />
  </div>
);
