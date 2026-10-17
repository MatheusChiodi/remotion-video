import { palette } from "../fitforge";

// Proporção dos prints da listagem (434 x 847)
const SCREEN_RATIO = 434 / 847;
const BEZEL = 14;
const FOREHEAD = 38;

export const getPhoneSize = (height: number) => {
  const screenHeight = height - FOREHEAD - BEZEL;
  const screenWidth = Math.round(screenHeight * SCREEN_RATIO);
  return { screenWidth, screenHeight, width: screenWidth + BEZEL * 2, height };
};

export const PhoneMockup: React.FC<{
  height: number;
  children: React.ReactNode;
}> = ({ height, children }) => {
  const size = getPhoneSize(height);
  const radius = size.width * 0.11;

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        width: size.width,
        height: size.height,
        borderRadius: radius,
        background: `linear-gradient(145deg, ${palette.phoneEdge}, ${palette.phoneBody} 40%, #0c0b0d)`,
        boxShadow:
          "0 0 0 2px rgba(255,255,255,0.08), 0 50px 120px -30px rgba(0,0,0,0.9), 0 0 140px -20px rgba(255, 106, 26, 0.35)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: FOREHEAD / 2 - 4,
          left: "50%",
          width: 76,
          height: 8,
          marginLeft: -38,
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.14)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FOREHEAD,
          left: BEZEL,
          width: size.screenWidth,
          height: size.screenHeight,
          borderRadius: radius - BEZEL,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          top: size.height * 0.22,
          right: -5,
          width: 5,
          height: size.height * 0.09,
          borderRadius: "0 3px 3px 0",
          backgroundColor: palette.phoneEdge,
        }}
      />
    </div>
  );
};
