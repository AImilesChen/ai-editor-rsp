export interface Template {
  id: string;
  slug: string;
  title: string;
  category: string;
  song_name: string;
  artist: string;
  language: string;
  platform: string[];
  tool: string;
  template_url: string;
  template_url_backup?: string;
  preview_image?: string;
  preview_video?: string;
  tutorial_steps: string[];
  attribution: string;
  source_url?: string;
  tags: string[];
  trending_score: number;
  status: string;
}

export const templates: Template[] = [
  {
    id: "1",
    slug: "babuaan-song-capcut-template-2026",
    title: "Babuaan Song CapCut Template 2026",
    category: "Bhojpuri",
    song_name: "Babuaan",
    artist: "Trending Artist",
    language: "Bhojpuri",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/babuaan-2026",
    template_url_backup: "https://www.capcut.com/templates/babuaan-2026-alt",
    preview_image: "/images/templates/babuaan-song-capcut-template-2026-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["bhojpuri", "trending", "2026", "beat-sync"],
    trending_score: 95,
    status: "active",
  },
  {
    id: "2",
    slug: "ankhon-ankhon-ka-masla",
    title: "Ankhon Ankhon Ka Masla — Bhojpuri",
    category: "Bhojpuri",
    song_name: "Ankhon Ankhon Ka Masla",
    artist: "Bhojpuri Star",
    language: "Bhojpuri",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/ankhon-ankhon-ka-masla",
    preview_image: "/images/templates/ankhon-ankhon-ka-masla-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["bhojpuri", "romantic", "emotional", "slow-mo"],
    trending_score: 88,
    status: "active",
  },
  {
    id: "3",
    slug: "ekdin-tomay-ghire",
    title: "Ekdin Tomay Ghire — Bengali Folk",
    category: "Bengali",
    song_name: "Ekdin Tomay Ghire",
    artist: "Bengali Folk Artist",
    language: "Bengali",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/ekdin-tomay-ghire",
    preview_image: "/images/templates/ekdin-tomay-ghire-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["bengali", "folk", "lyrical", "soft"],
    trending_score: 82,
    status: "active",
  },
  {
    id: "4",
    slug: "bengali-folk-song-template",
    title: "Bengali Folk Song Template",
    category: "Bengali",
    song_name: "Folk Melody",
    artist: "Various Artists",
    language: "Bengali",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/bengali-folk",
    preview_image: "/images/templates/bengali-folk-song-template-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["bengali", "folk", "traditional", "cultural"],
    trending_score: 75,
    status: "active",
  },
  {
    id: "5",
    slug: "bollywood-trending-template",
    title: "Bollywood Trending Template",
    category: "Hindi",
    song_name: "Bollywood Hit",
    artist: "Bollywood Star",
    language: "Hindi",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/bollywood-trending",
    preview_image: "/images/templates/bollywood-trending-template-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["hindi", "bollywood", "high-energy", "quick-cuts"],
    trending_score: 92,
    status: "active",
  },
  {
    id: "6",
    slug: "hindi-romantic-template",
    title: "Hindi Romantic Template",
    category: "Hindi",
    song_name: "Romantic Ballad",
    artist: "Popular Singer",
    language: "Hindi",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/hindi-romantic",
    preview_image: "/images/templates/hindi-romantic-template-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["hindi", "romantic", "slow", "emotional"],
    trending_score: 78,
    status: "active",
  },
  {
    id: "7",
    slug: "english-pop-trending-template",
    title: "English Pop Trending Template",
    category: "English",
    song_name: "Pop Hit 2026",
    artist: "Global Artist",
    language: "English",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/english-pop-trending",
    preview_image: "/images/templates/english-pop-trending-template-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["english", "pop", "trending", "global"],
    trending_score: 90,
    status: "active",
  },
  {
    id: "8",
    slug: "english-edm-template",
    title: "English EDM Template",
    category: "English",
    song_name: "EDM Drop",
    artist: "DJ Producer",
    language: "English",
    platform: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    tool: "CapCut",
    template_url: "https://www.capcut.com/templates/english-edm",
    preview_image: "/images/templates/english-edm-template-thumbnail.webp",
    tutorial_steps: [
      "Open CapCut app on your phone",
      "Tap 'Use Template' button above",
      "Select your photos/videos",
      "Adjust timing if needed",
      "Export and share to your platform"
    ],
    attribution: "CapCut template",
    source_url: "https://www.capcut.com",
    tags: ["english", "edm", "high-energy", "festival"],
    trending_score: 85,
    status: "active",
  },
];
