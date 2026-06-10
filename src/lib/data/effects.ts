export interface Effect {
  id: string;
  slug: string;
  title: string;
  category: string;
  platform: string[];
  type: string;
  prompt_id?: string;
  template_id?: string;
  before_image?: string;
  after_image?: string;
  video_preview_url?: string;
  description: string;
  tutorial_steps: string[];
  tags: string[];
  status: string;
}

export const effects: Effect[] = [
  {
    id: "1",
    slug: "double-exposure-travel",
    title: "Travel Portrait Blend",
    category: "Double Exposure",
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    type: "prompt",
    prompt_id: "double-exposure-travel-rishikesh",
    before_image: "/images/effects/double-exposure-travel-comparison.webp",
    after_image: "/images/effects/double-exposure-travel-comparison.webp",
    description: "Portrait fused with cityscape for cinematic travel vibes. Blend a portrait photo with iconic landmarks to create a dreamy double exposure effect.",
    tutorial_steps: [
      "Choose a clear portrait photo with good lighting",
      "Select a travel landmark or scenery image",
      "Use the prompt: 'A double exposure portrait of [subject] silhouetted against [landmark]...'",
      "Adjust the blend ratio in your AI tool",
      "Fine-tune colors and lighting for cohesion"
    ],
    tags: ["double exposure", "travel", "portrait", "cinematic"],
    status: "active",
  },
  {
    id: "2",
    slug: "horror-portrait",
    title: "Dark Portrait Transform",
    category: "Horror",
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    type: "prompt",
    prompt_id: "horror-girlfriend-ai-photo",
    before_image: "/images/effects/horror-portrait-comparison.webp",
    after_image: "/images/effects/horror-portrait-comparison.webp",
    description: "Ordinary photo turned into a haunting horror scene. Transform any portrait into a dark, eerie image with cinematic horror lighting.",
    tutorial_steps: [
      "Start with a regular portrait photo",
      "Use the horror prompt with dark shadow descriptors",
      "Add keywords like 'haunting eyes', 'eerie atmosphere'",
      "Adjust contrast and shadows for maximum impact",
      "Add subtle fog or mist effects if desired"
    ],
    tags: ["horror", "dark", "portrait", "cinematic"],
    status: "active",
  },
  {
    id: "3",
    slug: "diwali-glow",
    title: "Diwali Glow Effect",
    category: "Festival",
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    type: "prompt",
    prompt_id: "diwali-light-portrait",
    before_image: "/images/effects/diwali-glow-comparison.webp",
    after_image: "/images/effects/diwali-glow-comparison.webp",
    description: "Add warm festive lights and golden bokeh to any portrait. Perfect for Diwali, Christmas, or any celebration with lights.",
    tutorial_steps: [
      "Choose a portrait with space around the subject",
      "Use the festival prompt with light descriptors",
      "Add 'golden bokeh', 'warm lights', 'festive atmosphere'",
      "Adjust the intensity of light effects",
      "Fine-tune color temperature for warmth"
    ],
    tags: ["festival", "lights", "diwali", "bokeh", "warm"],
    status: "active",
  },
  {
    id: "4",
    slug: "babuaan-song-effect",
    title: "Babuaan Beat Sync",
    category: "Bhojpuri",
    platform: ["CapCut"],
    type: "template",
    template_id: "babuaan-song-capcut-template-2026",
    before_image: "/images/effects/babuaan-song-effect-comparison.webp",
    after_image: "/images/effects/babuaan-song-effect-comparison.webp",
    description: "Trending Bhojpuri song template with beat-sync transitions. Create viral videos with automatic beat matching.",
    tutorial_steps: [
      "Open CapCut and search for 'Babuaan' template",
      "Select 3-5 photos or video clips",
      "Let CapCut auto-sync to the beat",
      "Add text overlays if desired",
      "Export in 9:16 format for TikTok/Reels"
    ],
    tags: ["bhojpuri", "beat-sync", "trending", "capcut"],
    status: "active",
  },
  {
    id: "5",
    slug: "3d-cartoon-effect",
    title: "Pixar Style Transform",
    category: "3D Cartoon",
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    type: "prompt",
    prompt_id: "3d-cartoon-selfie",
    before_image: "/images/effects/3d-cartoon-effect-comparison.webp",
    after_image: "/images/effects/3d-cartoon-effect-comparison.webp",
    description: "Turn any photo into a Pixar-style 3D cartoon character. Great for profile pictures and social media avatars.",
    tutorial_steps: [
      "Upload a clear front-facing portrait",
      "Use the 3D cartoon prompt with Pixar descriptors",
      "Add 'glossy skin', 'big expressive eyes'",
      "Adjust the stylization level",
      "Download and use as your new avatar"
    ],
    tags: ["3d", "cartoon", "pixar", "avatar", "fun"],
    status: "active",
  },
  {
    id: "6",
    slug: "bengali-folk-effect",
    title: "Bengali Folk Lyrical",
    category: "Bengali",
    platform: ["CapCut"],
    type: "template",
    template_id: "bengali-folk-song-template",
    before_image: "/images/effects/bengali-folk-effect-comparison.webp",
    after_image: "/images/effects/bengali-folk-effect-comparison.webp",
    description: "Soft Bengali folk song template with lyrical overlays. Perfect for emotional and cultural content.",
    tutorial_steps: [
      "Open CapCut and search for Bengali folk templates",
      "Select photos that match the song mood",
      "Add Bengali text overlays for lyrics",
      "Use soft transitions and fade effects",
      "Export with emotional color grading"
    ],
    tags: ["bengali", "folk", "lyrical", "emotional", "cultural"],
    status: "active",
  },
];
