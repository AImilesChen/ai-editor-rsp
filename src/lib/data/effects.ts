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
    before_image: "/images/effects/double-exposure-travel-before.webp",
    after_image: "/images/effects/double-exposure-travel-after.webp",
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
    before_image: "/images/effects/horror-portrait-before.webp",
    after_image: "/images/effects/horror-portrait-after.webp",
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
    before_image: "/images/effects/diwali-glow-before.webp",
    after_image: "/images/effects/diwali-glow-after.webp",
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
    before_image: "/images/effects/babuaan-song-effect-before.webp",
    after_image: "/images/effects/babuaan-song-effect-after.webp",
    description: "Trending Bhojpuri song template with beat-sync transitions. Create short videos with automatic beat matching.",
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
    before_image: "/images/effects/3d-cartoon-effect-before.webp",
    after_image: "/images/effects/3d-cartoon-effect-after.webp",
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
    before_image: "/images/effects/bengali-folk-effect-before.webp",
    after_image: "/images/effects/bengali-folk-effect-after.webp",
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


const p1AdditionalEffects: Effect[] = [
{
  id: "7",
  slug: "p1-double-exposure-effect-7",
  title: "Double Exposure Creator Effect 7",
  category: "Double Exposure",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-double-exposure-effect-7-before.webp",
  after_image: "/images/effects/p1-double-exposure-effect-7-after.webp",
  description: "A double exposure before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "double exposure",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "8",
  slug: "p1-horror-effect-8",
  title: "Horror Creator Effect 8",
  category: "Horror",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-horror-effect-8-before.webp",
  after_image: "/images/effects/p1-horror-effect-8-after.webp",
  description: "A horror before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "horror",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "9",
  slug: "p1-festival-effect-9",
  title: "Festival Creator Effect 9",
  category: "Festival",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-festival-effect-9-before.webp",
  after_image: "/images/effects/p1-festival-effect-9-after.webp",
  description: "A festival before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "festival",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "10",
  slug: "p1-3d-cartoon-effect-10",
  title: "3D Cartoon Creator Effect 10",
  category: "3D Cartoon",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-3d-cartoon-effect-10-before.webp",
  after_image: "/images/effects/p1-3d-cartoon-effect-10-after.webp",
  description: "A 3d cartoon before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "3d cartoon",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "11",
  slug: "p1-bhojpuri-effect-11",
  title: "Bhojpuri Creator Effect 11",
  category: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "template",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-bhojpuri-effect-11-before.webp",
  after_image: "/images/effects/p1-bhojpuri-effect-11-after.webp",
  description: "A bhojpuri before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "bhojpuri",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "12",
  slug: "p1-bengali-effect-12",
  title: "Bengali Creator Effect 12",
  category: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "template",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-bengali-effect-12-before.webp",
  after_image: "/images/effects/p1-bengali-effect-12-after.webp",
  description: "A bengali before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "bengali",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "13",
  slug: "p1-cinematic-effect-13",
  title: "Cinematic Creator Effect 13",
  category: "Cinematic",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-cinematic-effect-13-before.webp",
  after_image: "/images/effects/p1-cinematic-effect-13-after.webp",
  description: "A cinematic before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "cinematic",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "14",
  slug: "p1-cyberpunk-effect-14",
  title: "Cyberpunk Creator Effect 14",
  category: "Cyberpunk",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-cyberpunk-effect-14-before.webp",
  after_image: "/images/effects/p1-cyberpunk-effect-14-after.webp",
  description: "A cyberpunk before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "cyberpunk",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "15",
  slug: "p1-double-exposure-effect-15",
  title: "Double Exposure Creator Effect 15",
  category: "Double Exposure",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-double-exposure-effect-15-before.webp",
  after_image: "/images/effects/p1-double-exposure-effect-15-after.webp",
  description: "A double exposure before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "double exposure",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "16",
  slug: "p1-horror-effect-16",
  title: "Horror Creator Effect 16",
  category: "Horror",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-horror-effect-16-before.webp",
  after_image: "/images/effects/p1-horror-effect-16-after.webp",
  description: "A horror before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "horror",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "17",
  slug: "p1-festival-effect-17",
  title: "Festival Creator Effect 17",
  category: "Festival",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-festival-effect-17-before.webp",
  after_image: "/images/effects/p1-festival-effect-17-after.webp",
  description: "A festival before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "festival",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "18",
  slug: "p1-3d-cartoon-effect-18",
  title: "3D Cartoon Creator Effect 18",
  category: "3D Cartoon",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-3d-cartoon-effect-18-before.webp",
  after_image: "/images/effects/p1-3d-cartoon-effect-18-after.webp",
  description: "A 3d cartoon before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "3d cartoon",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "19",
  slug: "p1-bhojpuri-effect-19",
  title: "Bhojpuri Creator Effect 19",
  category: "Bhojpuri",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "template",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-bhojpuri-effect-19-before.webp",
  after_image: "/images/effects/p1-bhojpuri-effect-19-after.webp",
  description: "A bhojpuri before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "bhojpuri",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "20",
  slug: "p1-bengali-effect-20",
  title: "Bengali Creator Effect 20",
  category: "Bengali",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "template",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-bengali-effect-20-before.webp",
  after_image: "/images/effects/p1-bengali-effect-20-after.webp",
  description: "A bengali before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "bengali",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "21",
  slug: "p1-cinematic-effect-21",
  title: "Cinematic Creator Effect 21",
  category: "Cinematic",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-cinematic-effect-21-before.webp",
  after_image: "/images/effects/p1-cinematic-effect-21-after.webp",
  description: "A cinematic before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "cinematic",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "22",
  slug: "p1-cyberpunk-effect-22",
  title: "Cyberpunk Creator Effect 22",
  category: "Cyberpunk",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-cyberpunk-effect-22-before.webp",
  after_image: "/images/effects/p1-cyberpunk-effect-22-after.webp",
  description: "A cyberpunk before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "cyberpunk",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "23",
  slug: "p1-double-exposure-effect-23",
  title: "Double Exposure Creator Effect 23",
  category: "Double Exposure",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-double-exposure-effect-23-before.webp",
  after_image: "/images/effects/p1-double-exposure-effect-23-after.webp",
  description: "A double exposure before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "double exposure",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "24",
  slug: "p1-horror-effect-24",
  title: "Horror Creator Effect 24",
  category: "Horror",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-horror-effect-24-before.webp",
  after_image: "/images/effects/p1-horror-effect-24-after.webp",
  description: "A horror before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "horror",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "25",
  slug: "p1-festival-effect-25",
  title: "Festival Creator Effect 25",
  category: "Festival",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-festival-effect-25-before.webp",
  after_image: "/images/effects/p1-festival-effect-25-after.webp",
  description: "A festival before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "festival",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
},
{
  id: "26",
  slug: "p1-3d-cartoon-effect-26",
  title: "3D Cartoon Creator Effect 26",
  category: "3D Cartoon",
  platform: [
    "TikTok",
    "Instagram Reels",
    "YouTube Shorts"
  ],
  type: "prompt",
  prompt_id: "p1-double-exposure-travel-rishikesh-14",
  before_image: "/images/effects/p1-3d-cartoon-effect-26-before.webp",
  after_image: "/images/effects/p1-3d-cartoon-effect-26-after.webp",
  description: "A 3d cartoon before-and-after direction for short-form creator edits with clear visual contrast and practical reuse notes.",
  tutorial_steps: [
    "Choose a clear portrait or clip",
    "Pick the matching prompt or CapCut direction",
    "Apply the style with balanced lighting",
    "Review for natural face details",
    "Export a 9:16 social-ready version"
  ],
  tags: [
    "3d cartoon",
    "before after",
    "creator",
    "p1"
  ],
  status: "active"
}
];

effects.push(...p1AdditionalEffects);
