import { AbsoluteFill, Composition, Series } from "remotion";
import { Background } from "./Background";
import {
  AlertScene,
  CtaScene,
  NameScene,
  ProjectScene,
  StackScene,
  Statement,
  StatsScene,
  YearScene,
} from "./scenes";
import { colors } from "./theme";

const FPS = 30;
// Soma das 23 cenas abaixo (30s)
const DURATION = 900;

export const MyComposition = () => {
  return (
    <Composition
      id="MChiodiPromo"
      component={MChiodiPromo}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

export const MChiodiPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Series>
        {/* Ato 1 — o alerta */}
        <Series.Sequence durationInFrames={42} name="01 Pedágio">
          <Statement text="Em algum lugar, um carro chega na praça de pedágio." />
        </Series.Sequence>
        <Series.Sequence durationInFrames={32} name="02 Cancela">
          <Statement text="A cancela não abre." fontSize={136} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={36} name="03 Alerta">
          <AlertScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={30} name="04 Alguém">
          <Statement text="Alguém precisa entrar." fontSize={136} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={30} name="05 Eu">
          <Statement text="Esse alguém sou eu." fontSize={136} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={44} name="06 Nome">
          <NameScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={50} name="07 Papel">
          <Statement
            eyebrow="Tech Lead Fullstack"
            eyebrowColor={colors.coral}
            text="Cuido dos sistemas que não podem parar."
            fontSize={112}
          />
        </Series.Sequence>

        {/* Ato 2 — a jornada */}
        <Series.Sequence durationInFrames={32} name="08 Antes">
          <Statement text="Mas essa história começa antes." />
        </Series.Sequence>
        <Series.Sequence durationInFrames={38} name="09 2021">
          <YearScene
            step={0}
            company="FI Sistemas"
            role="Desenvolvedor Fullstack"
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={42} name="10 LGPD">
          <Statement
            text="Liderei a implementação da LGPD."
            support="Quatro anos e meio de sistemas em produção."
            fontSize={112}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={38} name="11 2025">
          <YearScene step={1} company="Move Mais" role="Development Analyst" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={42} name="12 Do zero">
          <Statement
            text="Criei apps e sistemas do zero."
            support="E modernizei o legado mantendo a estabilidade."
            fontSize={112}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={42} name="13 2026">
          <YearScene
            step={2}
            company="Move Mais"
            role="Tech Lead de Sustentação"
            badge="Promoção"
          />
        </Series.Sequence>

        {/* Ato 3 — como eu trabalho */}
        <Series.Sequence durationInFrames={32} name="14 Causa raiz">
          <Statement text="Do alerta à causa raiz." fontSize={136} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={40} name="15 Decisão">
          <Statement text="Hotfix de hoje ou arquitetura do trimestre?" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={40} name="16 Stack">
          <StackScene />
        </Series.Sequence>

        {/* Ato 4 — fora do expediente */}
        <Series.Sequence durationInFrames={40} name="17 Ferramentas">
          <Statement
            text="Fora do expediente, as dores do trabalho viram ferramentas."
            fontSize={104}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={40} name="18 AgentTeam-Memory">
          <ProjectScene
            category="Open source"
            title="AgentTeam-Memory"
            highlight="Cérebro compartilhado para agentes de IA."
            stack={["Node.js", "Obsidian", "CLI"]}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={40} name="19 CyberAudit">
          <ProjectScene
            category="Extensão VS Code"
            title="CyberAudit"
            highlight="Segurança de dependências no fluxo do editor."
            stack={["TypeScript", "Node.js", "PDF e XLSX"]}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={38} name="20 Números">
          <StatsScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={36} name="21 Canal">
          <Statement
            eyebrow="Canal MChiodi"
            text="Desenvolvimento sem a parte romantizada."
            fontSize={104}
          />
        </Series.Sequence>

        {/* Ato 5 — fecho */}
        <Series.Sequence durationInFrames={28} name="22 Continua">
          <Statement text="E a história continua." fontSize={136} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={68} name="23 CTA">
          <CtaScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
