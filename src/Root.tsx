import { MyComposition } from "./Composition";
import { EditorMchiodiAdCompositions } from "./EditorMchiodiAd/register";
import { FitForgeAdCompositions } from "./FitForgeAd/register";
import { PrompterAdCompositions } from "./PrompterAd/register";
import { CockpitAdCompositions } from "./CockpitAd/register";
import { VoxelStoryCompositions } from "./voxel-story/compositions";
import { VoiceoverCompositions } from "./Voiceover/register";
import { FlintpadAdCompositions } from "./FlintpadAd/register";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <FitForgeAdCompositions />
      <VoxelStoryCompositions />
      <EditorMchiodiAdCompositions />
      <CockpitAdCompositions />
      <PrompterAdCompositions />
      <VoiceoverCompositions />
      <FlintpadAdCompositions />
    </>
  );
};
