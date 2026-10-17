import { AbsoluteFill, Img, staticFile } from "remotion";
import { Feature, palette } from "../fitforge";
import { fonts } from "../theme";

// Tela exibida dentro do celular: o print real ou, sem print, um placeholder neutro
export const FeatureSlide: React.FC<{ feature: Feature }> = ({ feature }) => {
  if (feature.screen) {
    return (
      <Img
        src={staticFile(feature.screen)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#17161a",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "70px 20px",
          borderRadius: 28,
          border: "3px dashed rgba(255,255,255,0.22)",
          textAlign: "center",
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 46,
          color: palette.textDim,
        }}
      >
        {feature.placeholder}
      </div>
    </AbsoluteFill>
  );
};
