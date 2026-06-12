import { Metadata } from "next";
import PlatformEffectsPage from "@/components/PlatformEffectsPage";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "YouTube Shorts AI Effects & Prompts",
  description: "AI photo prompts and effects for YouTube Shorts. Create Shorts content with copy-paste prompts.",
  path: "/youtube-shorts-effects",
});

export default function YouTubeShortsEffectsPage() {
  return (
    <PlatformEffectsPage
      platform="YouTube Shorts"
      title="YouTube Shorts Effects"
      subtitle="Effects and prompts tailored for YouTube Shorts creators, optimized for 9:16 visual storytelling."
    />
  );
}
