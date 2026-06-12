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
    preview_image: "/images/templates/v2-babuaan-phone-preview.webp",
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
    preview_image: "/images/templates/v2-ankhon-phone-preview.webp",
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
    preview_image: "/images/templates/v2-ekdin-phone-preview.webp",
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


const p1AdditionalTemplates: Template[] = [
{
  id: "10",
  slug: "p1-bhojpuri-capcut-template-10",
  title: "Bhojpuri Creator Cut Template 10",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 10",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-10",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-10-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 80,
  status: "active"
},
{
  id: "11",
  slug: "p1-bengali-capcut-template-11",
  title: "Bengali Creator Cut Template 11",
  category: "Bengali",
  song_name: "Bengali Creator Beat 11",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-11",
  preview_image: "/images/templates/p1-bengali-capcut-template-11-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 81,
  status: "active"
},
{
  id: "12",
  slug: "p1-hindi-capcut-template-12",
  title: "Hindi Creator Cut Template 12",
  category: "Hindi",
  song_name: "Hindi Creator Beat 12",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-12",
  preview_image: "/images/templates/p1-hindi-capcut-template-12-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 82,
  status: "active"
},
{
  id: "13",
  slug: "p1-english-capcut-template-13",
  title: "English Creator Cut Template 13",
  category: "English",
  song_name: "English Creator Beat 13",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-13",
  preview_image: "/images/templates/p1-english-capcut-template-13-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 83,
  status: "active"
},
{
  id: "14",
  slug: "p1-bhojpuri-capcut-template-14",
  title: "Bhojpuri Creator Cut Template 14",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 14",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-14",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-14-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 84,
  status: "active"
},
{
  id: "15",
  slug: "p1-bengali-capcut-template-15",
  title: "Bengali Creator Cut Template 15",
  category: "Bengali",
  song_name: "Bengali Creator Beat 15",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-15",
  preview_image: "/images/templates/p1-bengali-capcut-template-15-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 85,
  status: "active"
},
{
  id: "16",
  slug: "p1-hindi-capcut-template-16",
  title: "Hindi Creator Cut Template 16",
  category: "Hindi",
  song_name: "Hindi Creator Beat 16",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-16",
  preview_image: "/images/templates/p1-hindi-capcut-template-16-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 86,
  status: "active"
},
{
  id: "17",
  slug: "p1-english-capcut-template-17",
  title: "English Creator Cut Template 17",
  category: "English",
  song_name: "English Creator Beat 17",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-17",
  preview_image: "/images/templates/p1-english-capcut-template-17-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 87,
  status: "active"
},
{
  id: "18",
  slug: "p1-bhojpuri-capcut-template-18",
  title: "Bhojpuri Creator Cut Template 18",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 18",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-18",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-18-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 88,
  status: "active"
},
{
  id: "19",
  slug: "p1-bengali-capcut-template-19",
  title: "Bengali Creator Cut Template 19",
  category: "Bengali",
  song_name: "Bengali Creator Beat 19",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-19",
  preview_image: "/images/templates/p1-bengali-capcut-template-19-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 89,
  status: "active"
},
{
  id: "20",
  slug: "p1-hindi-capcut-template-20",
  title: "Hindi Creator Cut Template 20",
  category: "Hindi",
  song_name: "Hindi Creator Beat 20",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-20",
  preview_image: "/images/templates/p1-hindi-capcut-template-20-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 90,
  status: "active"
},
{
  id: "21",
  slug: "p1-english-capcut-template-21",
  title: "English Creator Cut Template 21",
  category: "English",
  song_name: "English Creator Beat 21",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-21",
  preview_image: "/images/templates/p1-english-capcut-template-21-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 91,
  status: "active"
},
{
  id: "22",
  slug: "p1-bhojpuri-capcut-template-22",
  title: "Bhojpuri Creator Cut Template 22",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 22",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-22",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-22-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 92,
  status: "active"
},
{
  id: "23",
  slug: "p1-bengali-capcut-template-23",
  title: "Bengali Creator Cut Template 23",
  category: "Bengali",
  song_name: "Bengali Creator Beat 23",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-23",
  preview_image: "/images/templates/p1-bengali-capcut-template-23-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 93,
  status: "active"
},
{
  id: "24",
  slug: "p1-hindi-capcut-template-24",
  title: "Hindi Creator Cut Template 24",
  category: "Hindi",
  song_name: "Hindi Creator Beat 24",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-24",
  preview_image: "/images/templates/p1-hindi-capcut-template-24-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 94,
  status: "active"
},
{
  id: "25",
  slug: "p1-english-capcut-template-25",
  title: "English Creator Cut Template 25",
  category: "English",
  song_name: "English Creator Beat 25",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-25",
  preview_image: "/images/templates/p1-english-capcut-template-25-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 70,
  status: "active"
},
{
  id: "26",
  slug: "p1-bhojpuri-capcut-template-26",
  title: "Bhojpuri Creator Cut Template 26",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 26",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-26",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-26-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 71,
  status: "active"
},
{
  id: "27",
  slug: "p1-bengali-capcut-template-27",
  title: "Bengali Creator Cut Template 27",
  category: "Bengali",
  song_name: "Bengali Creator Beat 27",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-27",
  preview_image: "/images/templates/p1-bengali-capcut-template-27-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 72,
  status: "active"
},
{
  id: "28",
  slug: "p1-hindi-capcut-template-28",
  title: "Hindi Creator Cut Template 28",
  category: "Hindi",
  song_name: "Hindi Creator Beat 28",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-28",
  preview_image: "/images/templates/p1-hindi-capcut-template-28-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 73,
  status: "active"
},
{
  id: "29",
  slug: "p1-english-capcut-template-29",
  title: "English Creator Cut Template 29",
  category: "English",
  song_name: "English Creator Beat 29",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-29",
  preview_image: "/images/templates/p1-english-capcut-template-29-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 74,
  status: "active"
},
{
  id: "30",
  slug: "p1-bhojpuri-capcut-template-30",
  title: "Bhojpuri Creator Cut Template 30",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 30",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-30",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-30-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 75,
  status: "active"
},
{
  id: "31",
  slug: "p1-bengali-capcut-template-31",
  title: "Bengali Creator Cut Template 31",
  category: "Bengali",
  song_name: "Bengali Creator Beat 31",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-31",
  preview_image: "/images/templates/p1-bengali-capcut-template-31-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 76,
  status: "active"
},
{
  id: "32",
  slug: "p1-hindi-capcut-template-32",
  title: "Hindi Creator Cut Template 32",
  category: "Hindi",
  song_name: "Hindi Creator Beat 32",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-32",
  preview_image: "/images/templates/p1-hindi-capcut-template-32-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 77,
  status: "active"
},
{
  id: "33",
  slug: "p1-english-capcut-template-33",
  title: "English Creator Cut Template 33",
  category: "English",
  song_name: "English Creator Beat 33",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-33",
  preview_image: "/images/templates/p1-english-capcut-template-33-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 78,
  status: "active"
},
{
  id: "34",
  slug: "p1-bhojpuri-capcut-template-34",
  title: "Bhojpuri Creator Cut Template 34",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 34",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-34",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-34-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 79,
  status: "active"
},
{
  id: "35",
  slug: "p1-bengali-capcut-template-35",
  title: "Bengali Creator Cut Template 35",
  category: "Bengali",
  song_name: "Bengali Creator Beat 35",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-35",
  preview_image: "/images/templates/p1-bengali-capcut-template-35-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 80,
  status: "active"
},
{
  id: "36",
  slug: "p1-hindi-capcut-template-36",
  title: "Hindi Creator Cut Template 36",
  category: "Hindi",
  song_name: "Hindi Creator Beat 36",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-36",
  preview_image: "/images/templates/p1-hindi-capcut-template-36-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 81,
  status: "active"
},
{
  id: "37",
  slug: "p1-english-capcut-template-37",
  title: "English Creator Cut Template 37",
  category: "English",
  song_name: "English Creator Beat 37",
  artist: "Creator Mix",
  language: "English",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-37",
  preview_image: "/images/templates/p1-english-capcut-template-37-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "english",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 82,
  status: "active"
},
{
  id: "38",
  slug: "p1-bhojpuri-capcut-template-38",
  title: "Bhojpuri Creator Cut Template 38",
  category: "Bhojpuri",
  song_name: "Bhojpuri Creator Beat 38",
  artist: "Creator Mix",
  language: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-38",
  preview_image: "/images/templates/p1-bhojpuri-capcut-template-38-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bhojpuri",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 83,
  status: "active"
},
{
  id: "39",
  slug: "p1-bengali-capcut-template-39",
  title: "Bengali Creator Cut Template 39",
  category: "Bengali",
  song_name: "Bengali Creator Beat 39",
  artist: "Creator Mix",
  language: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-39",
  preview_image: "/images/templates/p1-bengali-capcut-template-39-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "bengali",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 84,
  status: "active"
},
{
  id: "40",
  slug: "p1-hindi-capcut-template-40",
  title: "Hindi Creator Cut Template 40",
  category: "Hindi",
  song_name: "Hindi Creator Beat 40",
  artist: "Creator Mix",
  language: "Hindi",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  tool: "CapCut",
  template_url: "https://www.capcut.com/templates/p1-template-40",
  preview_image: "/images/templates/p1-hindi-capcut-template-40-thumbnail.webp",
  tutorial_steps: [
    "Open CapCut app on your phone",
    "Tap the template link",
    "Select your photos or clips",
    "Review timing and text",
    "Export for your social channel"
  ],
  attribution: "CapCut template",
  source_url: "https://www.capcut.com",
  tags: [
    "hindi",
    "capcut",
    "creator",
    "short-form"
  ],
  trending_score: 85,
  status: "active"
}
];

templates.push(...p1AdditionalTemplates);
