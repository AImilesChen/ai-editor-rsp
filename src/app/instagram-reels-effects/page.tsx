import { Metadata } from "next";
import PlatformEffectsPage from "@/components/PlatformEffectsPage";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Instagram Reels AI Effects & Prompts",
  description: "AI photo effects and prompts optimized for Instagram Reels. Copy, create, and share on Reels.",
  path: "/instagram-reels-effects",
});

export default function InstagramReelsEffectsPage() {
  return (
    <PlatformEffectsPage
      platform="Instagram Reels"
      title="Instagram Reels Effects"
      subtitle="Prompts and effects that shine on Instagram Reels, with clear previews and copy-ready prompt directions."
    />
  );
}
