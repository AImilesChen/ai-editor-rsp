export interface Prompt {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategories: string[];
  platform: string[];
  prompt: string;
  negative_prompt?: string;
  tool: string;
  tool_alternatives: string[];
  input_image_required: boolean;
  input_image_description?: string;
  before_image?: string;
  after_image?: string;
  attribution: string;
  source_url?: string;
  tags: string[];
  difficulty: string;
  estimated_time: string;
  safety_notes?: string;
  copyright_notes?: string;
  status: string;
}

export const prompts: Prompt[] = [
  {
    id: "1",
    slug: "double-exposure-travel-rishikesh",
    title: "Double Exposure Travel — Rishikesh",
    category: "Double Exposure",
    subcategories: ["Travel", "Portrait"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A double exposure portrait of a person silhouetted against the Rishikesh skyline and Ganges river at sunset, ethereal lighting, cinematic composition, warm golden tones blending with cool river blues, dreamlike atmosphere, ultra detailed, 8k resolution",
    negative_prompt: "blurry, low quality, distorted face, extra limbs",
    tool: "ChatGPT",
    tool_alternatives: ["Gemini", "Bing Image Creator"],
    input_image_required: false,
    input_image_description: "Optional: upload a portrait photo for better personalization",
    before_image: "/images/prompts/double-exposure-travel-rishikesh-card.webp",
    after_image: "/images/prompts/double-exposure-travel-rishikesh-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["double exposure", "travel", "rishikesh", "portrait", "sunset"],
    difficulty: "Easy",
    estimated_time: "2-3 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "2",
    slug: "horror-girlfriend-ai-photo",
    title: "Horror Girlfriend AI Photo",
    category: "Horror",
    subcategories: ["Portrait", "Dark"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A horror-style portrait of a woman with haunting glowing eyes, dark shadows creeping across her face, eerie atmosphere, cinematic horror lighting, ultra detailed, dramatic contrast, foggy background, gothic aesthetic",
    negative_prompt: "cartoon, anime, bright colors, cheerful",
    tool: "Gemini",
    tool_alternatives: ["ChatGPT", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/horror-girlfriend-ai-photo-card.webp",
    after_image: "/images/prompts/horror-girlfriend-ai-photo-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["horror", "portrait", "dark", "cinematic", "gothic"],
    difficulty: "Medium",
    estimated_time: "3-5 minutes",
    safety_notes: "Contains dark themes; viewer discretion advised",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "3",
    slug: "lofi-girl-vibes",
    title: "Lofi Girl Vibes",
    category: "Lofi",
    subcategories: ["Aesthetic", "Anime"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A lofi anime-style girl studying by a window at night, warm lamp light casting soft shadows, vinyl record player on the desk, rain outside the window, cozy atmosphere, pastel colors, soft focus background, highly detailed, peaceful mood",
    negative_prompt: "bright neon colors, chaotic, cluttered, modern tech",
    tool: "Bing Image Creator",
    tool_alternatives: ["ChatGPT", "Gemini"],
    input_image_required: false,
    before_image: "/images/prompts/lofi-girl-vibes-card.webp",
    after_image: "/images/prompts/lofi-girl-vibes-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["lofi", "anime", "aesthetic", "cozy", "pastel"],
    difficulty: "Easy",
    estimated_time: "2-3 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "4",
    slug: "3d-cartoon-selfie",
    title: "3D Cartoon Selfie",
    category: "3D Cartoon",
    subcategories: ["Portrait", "Cartoon"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A 3D Pixar-style cartoon character portrait, glossy skin with subtle subsurface scattering, big expressive eyes with catchlights, soft studio lighting, vibrant colors, highly detailed render, friendly smile, clean background",
    negative_prompt: "realistic, photorealistic, dark, scary, low poly",
    tool: "ChatGPT",
    tool_alternatives: ["Gemini", "Bing Image Creator"],
    input_image_required: true,
    input_image_description: "Upload a selfie or portrait photo to convert",
    before_image: "/images/prompts/3d-cartoon-selfie-card.webp",
    after_image: "/images/prompts/3d-cartoon-selfie-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["3d", "cartoon", "pixar", "portrait", "colorful"],
    difficulty: "Easy",
    estimated_time: "2-3 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "5",
    slug: "diwali-light-portrait",
    title: "Diwali Light Portrait",
    category: "Festival",
    subcategories: ["Portrait", "Lights"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A portrait surrounded by glowing Diwali diyas and golden bokeh lights, warm festive atmosphere, traditional Indian attire with rich colors, soft focus background with light orbs, celebratory mood, ultra detailed, cinematic lighting",
    negative_prompt: "dark, gloomy, western clothing, modern background",
    tool: "Gemini",
    tool_alternatives: ["ChatGPT", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/diwali-light-portrait-card.webp",
    after_image: "/images/prompts/diwali-light-portrait-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["diwali", "festival", "lights", "portrait", "indian"],
    difficulty: "Medium",
    estimated_time: "3-5 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "6",
    slug: "cinematic-movie-poster",
    title: "Cinematic Movie Poster",
    category: "Cinematic",
    subcategories: ["Poster", "Dramatic"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A cinematic movie poster style portrait, dramatic side lighting with strong shadows, teal and orange color grade, lens flares, subtle film grain, epic composition with negative space for title text, Hollywood blockbuster aesthetic, ultra detailed",
    negative_prompt: "flat lighting, desaturated, snapshot, casual",
    tool: "ChatGPT",
    tool_alternatives: ["Gemini", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/cinematic-movie-poster-card.webp",
    after_image: "/images/prompts/cinematic-movie-poster-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["cinematic", "movie poster", "dramatic", "teal orange", "hollywood"],
    difficulty: "Medium",
    estimated_time: "3-5 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "7",
    slug: "neon-cyberpunk-portrait",
    title: "Neon Cyberpunk Portrait",
    category: "Cyberpunk",
    subcategories: ["Portrait", "Neon"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A cyberpunk portrait with neon pink and blue lighting, reflective wet streets in background, futuristic fashion with LED accents, holographic elements, dystopian cityscape, ultra detailed, blade runner aesthetic, 8k resolution",
    negative_prompt: "natural lighting, daytime, rural, historical",
    tool: "ChatGPT",
    tool_alternatives: ["Gemini", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/neon-cyberpunk-portrait-card.webp",
    after_image: "/images/prompts/neon-cyberpunk-portrait-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["cyberpunk", "neon", "futuristic", "portrait", "dystopian"],
    difficulty: "Medium",
    estimated_time: "3-5 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "8",
    slug: "vintage-film-look",
    title: "Vintage Film Look",
    category: "Vintage",
    subcategories: ["Film", "Retro"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A vintage film photography style portrait, warm sepia tones, visible film grain and dust scratches, soft vignette edges, 1970s fashion aesthetic, nostalgic mood, slightly faded colors, analog camera look, Kodak Portra 400 style",
    negative_prompt: "digital look, sharp, modern, crisp, hdr",
    tool: "Gemini",
    tool_alternatives: ["ChatGPT", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/vintage-film-look-card.webp",
    after_image: "/images/prompts/vintage-film-look-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["vintage", "film", "retro", "sepia", "nostalgic"],
    difficulty: "Easy",
    estimated_time: "2-3 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "9",
    slug: "underwater-fantasy",
    title: "Underwater Fantasy",
    category: "Fantasy",
    subcategories: ["Underwater", "Magical"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "An underwater fantasy portrait with floating hair and fabric, bioluminescent sea creatures around, caustic light patterns from surface, ethereal blue and turquoise tones, magical bubbles, dreamy atmosphere, ultra detailed, cinematic composition",
    negative_prompt: "dry land, dark, murky, realistic underwater gear",
    tool: "Bing Image Creator",
    tool_alternatives: ["ChatGPT", "Gemini"],
    input_image_required: false,
    before_image: "/images/prompts/underwater-fantasy-card.webp",
    after_image: "/images/prompts/underwater-fantasy-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["underwater", "fantasy", "magical", "bioluminescent", "ethereal"],
    difficulty: "Hard",
    estimated_time: "5-8 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "10",
    slug: "minimalist-line-art",
    title: "Minimalist Line Art",
    category: "Minimalist",
    subcategories: ["Line Art", "Abstract"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A minimalist line art portrait, single continuous line drawing style, black lines on white background, elegant and simple, modern aesthetic, clean composition, artistic and sophisticated, vector-like quality",
    negative_prompt: "colorful, detailed, realistic, shaded, complex background",
    tool: "ChatGPT",
    tool_alternatives: ["Gemini", "Bing Image Creator"],
    input_image_required: true,
    input_image_description: "Upload a portrait photo to convert to line art",
    before_image: "/images/prompts/minimalist-line-art-card.webp",
    after_image: "/images/prompts/minimalist-line-art-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["minimalist", "line art", "abstract", "black and white", "modern"],
    difficulty: "Easy",
    estimated_time: "2-3 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "11",
    slug: "oil-painting-masterpiece",
    title: "Oil Painting Masterpiece",
    category: "Artistic",
    subcategories: ["Painting", "Classical"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "An oil painting style portrait in the style of classical masters, rich impasto texture, warm chiaroscuro lighting, Renaissance composition, deep colors with gold accents, museum quality, visible brush strokes, timeless elegance",
    negative_prompt: "photorealistic, modern, digital art, flat colors",
    tool: "Gemini",
    tool_alternatives: ["ChatGPT", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/oil-painting-masterpiece-card.webp",
    after_image: "/images/prompts/oil-painting-masterpiece-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["oil painting", "classical", "renaissance", "artistic", "masterpiece"],
    difficulty: "Medium",
    estimated_time: "3-5 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
  {
    id: "12",
    slug: "holographic-fashion",
    title: "Holographic Fashion",
    category: "Fashion",
    subcategories: ["Holographic", "Futuristic"],
    platform: ["ChatGPT", "Gemini", "Bing Image Creator"],
    prompt: "A fashion portrait with holographic iridescent clothing, prismatic light reflections, futuristic makeup with glitter accents, neon studio lighting, high fashion editorial style, ultra detailed, avant-garde aesthetic, metallic textures",
    negative_prompt: "casual clothing, natural makeup, outdoor, vintage",
    tool: "ChatGPT",
    tool_alternatives: ["Gemini", "Bing Image Creator"],
    input_image_required: false,
    before_image: "/images/prompts/holographic-fashion-card.webp",
    after_image: "/images/prompts/holographic-fashion-detail.webp",
    attribution: "RSP Editing style",
    source_url: "#",
    tags: ["fashion", "holographic", "futuristic", "editorial", "iridescent"],
    difficulty: "Medium",
    estimated_time: "3-5 minutes",
    safety_notes: "Safe for all audiences",
    copyright_notes: "Original prompt inspired by RSP Editing tutorials",
    status: "active",
  },
];


const p1AdditionalPrompts: Prompt[] = [
{
  id: "14",
  slug: "p1-double-exposure-travel-rishikesh-14",
  title: "River City Blend 14",
  category: "Double Exposure",
  subcategories: [
    "Double Exposure",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a double exposure RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 14.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-double-exposure-travel-rishikesh-14-card.webp",
  after_image: "/images/prompts/p1-double-exposure-travel-rishikesh-14-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "double exposure",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "15",
  slug: "p1-horror-girlfriend-ai-photo-15",
  title: "Moonlit Shadow Portrait 15",
  category: "Horror",
  subcategories: [
    "Horror",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a horror RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 15.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-horror-girlfriend-ai-photo-15-card.webp",
  after_image: "/images/prompts/p1-horror-girlfriend-ai-photo-15-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "horror",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "16",
  slug: "p1-lofi-girl-vibes-16",
  title: "Cozy Study Glow 16",
  category: "Lofi",
  subcategories: [
    "Lofi",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a lofi RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 16.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-lofi-girl-vibes-16-card.webp",
  after_image: "/images/prompts/p1-lofi-girl-vibes-16-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "lofi",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "17",
  slug: "p1-3d-cartoon-selfie-17",
  title: "Rounded Avatar Studio 17",
  category: "3D Cartoon",
  subcategories: [
    "3D Cartoon",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a 3d cartoon RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 17.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-3d-cartoon-selfie-17-card.webp",
  after_image: "/images/prompts/p1-3d-cartoon-selfie-17-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "3d cartoon",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "18",
  slug: "p1-diwali-light-portrait-18",
  title: "Lantern Festival Mood 18",
  category: "Festival",
  subcategories: [
    "Festival",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a festival RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 18.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-diwali-light-portrait-18-card.webp",
  after_image: "/images/prompts/p1-diwali-light-portrait-18-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "festival",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "19",
  slug: "p1-cinematic-movie-poster-19",
  title: "Film Poster Closeup 19",
  category: "Cinematic",
  subcategories: [
    "Cinematic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cinematic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 19.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-cinematic-movie-poster-19-card.webp",
  after_image: "/images/prompts/p1-cinematic-movie-poster-19-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cinematic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "20",
  slug: "p1-neon-cyberpunk-portrait-20",
  title: "Neon Rain Profile 20",
  category: "Cyberpunk",
  subcategories: [
    "Cyberpunk",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cyberpunk RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 20.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-neon-cyberpunk-portrait-20-card.webp",
  after_image: "/images/prompts/p1-neon-cyberpunk-portrait-20-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cyberpunk",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "21",
  slug: "p1-vintage-film-look-21",
  title: "Retro Film Memory 21",
  category: "Vintage",
  subcategories: [
    "Vintage",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a vintage RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 21.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-vintage-film-look-21-card.webp",
  after_image: "/images/prompts/p1-vintage-film-look-21-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "vintage",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "22",
  slug: "p1-underwater-fantasy-22",
  title: "Underwater Dream Scene 22",
  category: "Fantasy",
  subcategories: [
    "Fantasy",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fantasy RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 22.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-underwater-fantasy-22-card.webp",
  after_image: "/images/prompts/p1-underwater-fantasy-22-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fantasy",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "23",
  slug: "p1-minimalist-line-art-23",
  title: "Clean Line Portrait 23",
  category: "Minimalist",
  subcategories: [
    "Minimalist",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a minimalist RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 23.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-minimalist-line-art-23-card.webp",
  after_image: "/images/prompts/p1-minimalist-line-art-23-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "minimalist",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "24",
  slug: "p1-oil-painting-masterpiece-24",
  title: "Gallery Oil Portrait 24",
  category: "Artistic",
  subcategories: [
    "Artistic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a artistic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 24.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-oil-painting-masterpiece-24-card.webp",
  after_image: "/images/prompts/p1-oil-painting-masterpiece-24-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "artistic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "25",
  slug: "p1-holographic-fashion-25",
  title: "Chrome Fashion Editorial 25",
  category: "Fashion",
  subcategories: [
    "Fashion",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fashion RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 25.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-holographic-fashion-25-card.webp",
  after_image: "/images/prompts/p1-holographic-fashion-25-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fashion",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "26",
  slug: "p1-double-exposure-travel-rishikesh-26",
  title: "River City Blend 26",
  category: "Double Exposure",
  subcategories: [
    "Double Exposure",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a double exposure RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 26.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-double-exposure-travel-rishikesh-26-card.webp",
  after_image: "/images/prompts/p1-double-exposure-travel-rishikesh-26-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "double exposure",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "27",
  slug: "p1-horror-girlfriend-ai-photo-27",
  title: "Moonlit Shadow Portrait 27",
  category: "Horror",
  subcategories: [
    "Horror",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a horror RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 27.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-horror-girlfriend-ai-photo-27-card.webp",
  after_image: "/images/prompts/p1-horror-girlfriend-ai-photo-27-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "horror",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "28",
  slug: "p1-lofi-girl-vibes-28",
  title: "Cozy Study Glow 28",
  category: "Lofi",
  subcategories: [
    "Lofi",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a lofi RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 28.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-lofi-girl-vibes-28-card.webp",
  after_image: "/images/prompts/p1-lofi-girl-vibes-28-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "lofi",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "29",
  slug: "p1-3d-cartoon-selfie-29",
  title: "Rounded Avatar Studio 29",
  category: "3D Cartoon",
  subcategories: [
    "3D Cartoon",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a 3d cartoon RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 29.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-3d-cartoon-selfie-29-card.webp",
  after_image: "/images/prompts/p1-3d-cartoon-selfie-29-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "3d cartoon",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "30",
  slug: "p1-diwali-light-portrait-30",
  title: "Lantern Festival Mood 30",
  category: "Festival",
  subcategories: [
    "Festival",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a festival RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 30.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-diwali-light-portrait-30-card.webp",
  after_image: "/images/prompts/p1-diwali-light-portrait-30-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "festival",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "31",
  slug: "p1-cinematic-movie-poster-31",
  title: "Film Poster Closeup 31",
  category: "Cinematic",
  subcategories: [
    "Cinematic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cinematic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 31.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-cinematic-movie-poster-31-card.webp",
  after_image: "/images/prompts/p1-cinematic-movie-poster-31-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cinematic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "32",
  slug: "p1-neon-cyberpunk-portrait-32",
  title: "Neon Rain Profile 32",
  category: "Cyberpunk",
  subcategories: [
    "Cyberpunk",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cyberpunk RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 32.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-neon-cyberpunk-portrait-32-card.webp",
  after_image: "/images/prompts/p1-neon-cyberpunk-portrait-32-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cyberpunk",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "33",
  slug: "p1-vintage-film-look-33",
  title: "Retro Film Memory 33",
  category: "Vintage",
  subcategories: [
    "Vintage",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a vintage RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 33.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-vintage-film-look-33-card.webp",
  after_image: "/images/prompts/p1-vintage-film-look-33-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "vintage",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "34",
  slug: "p1-underwater-fantasy-34",
  title: "Underwater Dream Scene 34",
  category: "Fantasy",
  subcategories: [
    "Fantasy",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fantasy RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 34.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-underwater-fantasy-34-card.webp",
  after_image: "/images/prompts/p1-underwater-fantasy-34-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fantasy",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "35",
  slug: "p1-minimalist-line-art-35",
  title: "Clean Line Portrait 35",
  category: "Minimalist",
  subcategories: [
    "Minimalist",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a minimalist RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 35.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-minimalist-line-art-35-card.webp",
  after_image: "/images/prompts/p1-minimalist-line-art-35-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "minimalist",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "36",
  slug: "p1-oil-painting-masterpiece-36",
  title: "Gallery Oil Portrait 36",
  category: "Artistic",
  subcategories: [
    "Artistic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a artistic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 36.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-oil-painting-masterpiece-36-card.webp",
  after_image: "/images/prompts/p1-oil-painting-masterpiece-36-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "artistic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "37",
  slug: "p1-holographic-fashion-37",
  title: "Chrome Fashion Editorial 37",
  category: "Fashion",
  subcategories: [
    "Fashion",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fashion RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 37.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-holographic-fashion-37-card.webp",
  after_image: "/images/prompts/p1-holographic-fashion-37-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fashion",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "38",
  slug: "p1-double-exposure-travel-rishikesh-38",
  title: "River City Blend 38",
  category: "Double Exposure",
  subcategories: [
    "Double Exposure",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a double exposure RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 38.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-double-exposure-travel-rishikesh-38-card.webp",
  after_image: "/images/prompts/p1-double-exposure-travel-rishikesh-38-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "double exposure",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "39",
  slug: "p1-horror-girlfriend-ai-photo-39",
  title: "Moonlit Shadow Portrait 39",
  category: "Horror",
  subcategories: [
    "Horror",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a horror RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 39.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-horror-girlfriend-ai-photo-39-card.webp",
  after_image: "/images/prompts/p1-horror-girlfriend-ai-photo-39-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "horror",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "40",
  slug: "p1-lofi-girl-vibes-40",
  title: "Cozy Study Glow 40",
  category: "Lofi",
  subcategories: [
    "Lofi",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a lofi RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 40.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-lofi-girl-vibes-40-card.webp",
  after_image: "/images/prompts/p1-lofi-girl-vibes-40-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "lofi",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "41",
  slug: "p1-3d-cartoon-selfie-41",
  title: "Rounded Avatar Studio 41",
  category: "3D Cartoon",
  subcategories: [
    "3D Cartoon",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a 3d cartoon RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 41.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-3d-cartoon-selfie-41-card.webp",
  after_image: "/images/prompts/p1-3d-cartoon-selfie-41-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "3d cartoon",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "42",
  slug: "p1-diwali-light-portrait-42",
  title: "Lantern Festival Mood 42",
  category: "Festival",
  subcategories: [
    "Festival",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a festival RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 42.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-diwali-light-portrait-42-card.webp",
  after_image: "/images/prompts/p1-diwali-light-portrait-42-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "festival",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "43",
  slug: "p1-cinematic-movie-poster-43",
  title: "Film Poster Closeup 43",
  category: "Cinematic",
  subcategories: [
    "Cinematic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cinematic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 43.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-cinematic-movie-poster-43-card.webp",
  after_image: "/images/prompts/p1-cinematic-movie-poster-43-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cinematic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "44",
  slug: "p1-neon-cyberpunk-portrait-44",
  title: "Neon Rain Profile 44",
  category: "Cyberpunk",
  subcategories: [
    "Cyberpunk",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cyberpunk RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 44.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-neon-cyberpunk-portrait-44-card.webp",
  after_image: "/images/prompts/p1-neon-cyberpunk-portrait-44-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cyberpunk",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "45",
  slug: "p1-vintage-film-look-45",
  title: "Retro Film Memory 45",
  category: "Vintage",
  subcategories: [
    "Vintage",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a vintage RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 45.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-vintage-film-look-45-card.webp",
  after_image: "/images/prompts/p1-vintage-film-look-45-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "vintage",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "46",
  slug: "p1-underwater-fantasy-46",
  title: "Underwater Dream Scene 46",
  category: "Fantasy",
  subcategories: [
    "Fantasy",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fantasy RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 46.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-underwater-fantasy-46-card.webp",
  after_image: "/images/prompts/p1-underwater-fantasy-46-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fantasy",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "47",
  slug: "p1-minimalist-line-art-47",
  title: "Clean Line Portrait 47",
  category: "Minimalist",
  subcategories: [
    "Minimalist",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a minimalist RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 47.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-minimalist-line-art-47-card.webp",
  after_image: "/images/prompts/p1-minimalist-line-art-47-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "minimalist",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "48",
  slug: "p1-oil-painting-masterpiece-48",
  title: "Gallery Oil Portrait 48",
  category: "Artistic",
  subcategories: [
    "Artistic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a artistic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 48.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-oil-painting-masterpiece-48-card.webp",
  after_image: "/images/prompts/p1-oil-painting-masterpiece-48-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "artistic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "49",
  slug: "p1-holographic-fashion-49",
  title: "Chrome Fashion Editorial 49",
  category: "Fashion",
  subcategories: [
    "Fashion",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fashion RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 49.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-holographic-fashion-49-card.webp",
  after_image: "/images/prompts/p1-holographic-fashion-49-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fashion",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "50",
  slug: "p1-double-exposure-travel-rishikesh-50",
  title: "River City Blend 50",
  category: "Double Exposure",
  subcategories: [
    "Double Exposure",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a double exposure RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 50.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-double-exposure-travel-rishikesh-50-card.webp",
  after_image: "/images/prompts/p1-double-exposure-travel-rishikesh-50-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "double exposure",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "51",
  slug: "p1-horror-girlfriend-ai-photo-51",
  title: "Moonlit Shadow Portrait 51",
  category: "Horror",
  subcategories: [
    "Horror",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a horror RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 51.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-horror-girlfriend-ai-photo-51-card.webp",
  after_image: "/images/prompts/p1-horror-girlfriend-ai-photo-51-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "horror",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "52",
  slug: "p1-lofi-girl-vibes-52",
  title: "Cozy Study Glow 52",
  category: "Lofi",
  subcategories: [
    "Lofi",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a lofi RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 52.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-lofi-girl-vibes-52-card.webp",
  after_image: "/images/prompts/p1-lofi-girl-vibes-52-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "lofi",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "53",
  slug: "p1-3d-cartoon-selfie-53",
  title: "Rounded Avatar Studio 53",
  category: "3D Cartoon",
  subcategories: [
    "3D Cartoon",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a 3d cartoon RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 53.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-3d-cartoon-selfie-53-card.webp",
  after_image: "/images/prompts/p1-3d-cartoon-selfie-53-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "3d cartoon",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "54",
  slug: "p1-diwali-light-portrait-54",
  title: "Lantern Festival Mood 54",
  category: "Festival",
  subcategories: [
    "Festival",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a festival RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 54.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-diwali-light-portrait-54-card.webp",
  after_image: "/images/prompts/p1-diwali-light-portrait-54-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "festival",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "55",
  slug: "p1-cinematic-movie-poster-55",
  title: "Film Poster Closeup 55",
  category: "Cinematic",
  subcategories: [
    "Cinematic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cinematic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 55.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-cinematic-movie-poster-55-card.webp",
  after_image: "/images/prompts/p1-cinematic-movie-poster-55-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cinematic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "56",
  slug: "p1-neon-cyberpunk-portrait-56",
  title: "Neon Rain Profile 56",
  category: "Cyberpunk",
  subcategories: [
    "Cyberpunk",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a cyberpunk RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 56.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-neon-cyberpunk-portrait-56-card.webp",
  after_image: "/images/prompts/p1-neon-cyberpunk-portrait-56-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "cyberpunk",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "57",
  slug: "p1-vintage-film-look-57",
  title: "Retro Film Memory 57",
  category: "Vintage",
  subcategories: [
    "Vintage",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a vintage RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 57.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-vintage-film-look-57-card.webp",
  after_image: "/images/prompts/p1-vintage-film-look-57-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "vintage",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "58",
  slug: "p1-underwater-fantasy-58",
  title: "Underwater Dream Scene 58",
  category: "Fantasy",
  subcategories: [
    "Fantasy",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fantasy RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 58.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-underwater-fantasy-58-card.webp",
  after_image: "/images/prompts/p1-underwater-fantasy-58-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fantasy",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "59",
  slug: "p1-minimalist-line-art-59",
  title: "Clean Line Portrait 59",
  category: "Minimalist",
  subcategories: [
    "Minimalist",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a minimalist RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 59.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-minimalist-line-art-59-card.webp",
  after_image: "/images/prompts/p1-minimalist-line-art-59-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "minimalist",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "60",
  slug: "p1-oil-painting-masterpiece-60",
  title: "Gallery Oil Portrait 60",
  category: "Artistic",
  subcategories: [
    "Artistic",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a artistic RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 60.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-oil-painting-masterpiece-60-card.webp",
  after_image: "/images/prompts/p1-oil-painting-masterpiece-60-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "artistic",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "61",
  slug: "p1-holographic-fashion-61",
  title: "Chrome Fashion Editorial 61",
  category: "Fashion",
  subcategories: [
    "Fashion",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a fashion RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 61.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-holographic-fashion-61-card.webp",
  after_image: "/images/prompts/p1-holographic-fashion-61-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "fashion",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "62",
  slug: "p1-double-exposure-travel-rishikesh-62",
  title: "River City Blend 62",
  category: "Double Exposure",
  subcategories: [
    "Double Exposure",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a double exposure RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 62.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Bing Image Creator",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-double-exposure-travel-rishikesh-62-card.webp",
  after_image: "/images/prompts/p1-double-exposure-travel-rishikesh-62-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "double exposure",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "63",
  slug: "p1-horror-girlfriend-ai-photo-63",
  title: "Moonlit Shadow Portrait 63",
  category: "Horror",
  subcategories: [
    "Horror",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a horror RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 63.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "ChatGPT",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-horror-girlfriend-ai-photo-63-card.webp",
  after_image: "/images/prompts/p1-horror-girlfriend-ai-photo-63-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "horror",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Medium",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
},
{
  id: "64",
  slug: "p1-lofi-girl-vibes-64",
  title: "Cozy Study Glow 64",
  category: "Lofi",
  subcategories: [
    "Lofi",
    "P1 Collection"
  ],
  platform: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  prompt: "Create a lofi RSP-style creator portrait with a clear subject, textured background, cinematic lighting, social-ready composition, detailed face, balanced contrast, and warm editorial color grading. Variation 64.",
  negative_prompt: "blurry, low quality, distorted face, extra fingers, watermark",
  tool: "Gemini",
  tool_alternatives: [
    "ChatGPT",
    "Gemini",
    "Bing Image Creator"
  ],
  input_image_required: false,
  before_image: "/images/prompts/p1-lofi-girl-vibes-64-card.webp",
  after_image: "/images/prompts/p1-lofi-girl-vibes-64-detail.webp",
  attribution: "RSP Editing style",
  source_url: "#",
  tags: [
    "lofi",
    "rsp style",
    "creator",
    "p1"
  ],
  difficulty: "Easy",
  estimated_time: "2-4 minutes",
  safety_notes: "Use only photos you have permission to edit.",
  copyright_notes: "Independent prompt reference for educational use.",
  status: "active"
}
];

prompts.push(...p1AdditionalPrompts);
