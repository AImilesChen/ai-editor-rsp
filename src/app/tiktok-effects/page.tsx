import { Metadata } from "next";
import PlatformEffectsPage from "@/components/PlatformEffectsPage";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "TikTok AI Effects & Prompts",
  description: "Trending AI photo effects and prompts perfect for TikTok. Copy prompts and create TikTok content.",
  path: "/tiktok-effects",
});

export default function TikTokEffectsPage() {
  return (
    <PlatformEffectsPage
      platform="TikTok"
      title="TikTok Trending Effects"
      subtitle="AI prompts and effects that work great for TikTok videos. Browse visual examples, copy a prompt, and keep your edit flow simple."
    />
  );
}
