export interface PromptPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  category: string;
  categoryLabel: string;
  sampleImage: string;
  sampleImageAlt: string;
  heroText: string;
  ctaText: string;
  whatItIs: string;
  bestFor: string[];
  prompts: Array<{ title: string; prompt: string }>;
  tips: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ slug: string; title: string }>;
}

export const promptPages: PromptPage[] = [
  {
    slug: "ai-headshot",
    title: "AI Headshot Prompts for Professional Profile Photos",
    metaDescription:
      "Create polished AI headshots for LinkedIn, resumes, websites, and personal branding with ready-to-use professional headshot prompts.",
    h1: "AI Headshot Prompts for Professional Profile Photos",
    category: "Professional",
    categoryLabel: "Professional",
    sampleImage: "/images/generated/vintage-film-look.webp",
    sampleImageAlt: "Example professional AI headshot with warm studio lighting",
    heroText:
      "Create clean, realistic AI headshots for LinkedIn, resumes, team pages, and personal branding. Start with a ready-made prompt, then adjust outfit, background, and lighting to fit your role.",
    ctaText: "Use an AI headshot prompt",
    whatItIs:
      "AI headshot prompts help turn a simple portrait idea into a polished profile image. They usually describe the subject, outfit, background, lighting, camera angle, and overall tone.",
    bestFor: [
      "LinkedIn profile photos",
      "Resume and portfolio headshots",
      "Startup founder pages",
      "Freelancer profiles",
      "Speaker bios",
      "About pages",
    ],
    prompts: [
      {
        title: "Professional startup founder headshot",
        prompt:
          "A realistic professional headshot of an adult startup founder, confident natural expression, smart casual blazer, clean neutral background, soft studio lighting, eye-level camera angle, sharp facial details, modern business portrait, high-resolution photography style",
      },
      {
        title: "LinkedIn corporate headshot",
        prompt:
          "A polished LinkedIn profile photo of an adult professional, wearing a navy blazer and light shirt, subtle smile, blurred modern office background, soft natural window light, realistic skin texture, professional business photography, clean composition",
      },
      {
        title: "Creative freelancer headshot",
        prompt:
          "A modern headshot of an adult creative freelancer, relaxed confident pose, minimal black t-shirt and casual jacket, warm neutral studio backdrop, soft directional lighting, editorial portrait photography, natural expression, realistic details",
      },
      {
        title: "Remote work profile photo",
        prompt:
          "A friendly professional headshot of an adult remote worker, seated in a clean home office, soft daylight, laptop subtly visible in the background, approachable expression, realistic portrait photo, balanced composition, high clarity",
      },
      {
        title: "Executive portrait",
        prompt:
          "A realistic executive headshot of an adult business leader, dark tailored suit, calm confident expression, premium grey studio background, cinematic softbox lighting, shallow depth of field, professional corporate portrait style",
      },
      {
        title: "Warm personal brand headshot",
        prompt:
          "A warm personal brand headshot of an adult consultant, natural smile, beige blazer, soft cream background, bright natural lighting, clean editorial photography, trustworthy and approachable mood, realistic photo details",
      },
    ],
    tips: [
      "Specify outfit, background, and lighting.",
      "Use \"realistic skin texture\" and \"natural expression\".",
      "Avoid over-editing words like flawless, perfect, or plastic skin.",
      "Keep the background simple for professional use.",
    ],
    faqs: [
      {
        question: "Can I use AI headshots for LinkedIn?",
        answer:
          "Yes, if the image represents you honestly and follows platform rules.",
      },
      {
        question: "Are AI headshots the same as passport photos?",
        answer:
          "No. Do not use AI-generated images for government ID or legal documents.",
      },
      {
        question: "Should I upload my own photo?",
        answer:
          "If the product supports image editing, uploading your own photo can help keep likeness consistent.",
      },
    ],
    related: [
      { slug: "linkedin-profile-photo", title: "LinkedIn Profile Photo Prompts" },
      { slug: "cinematic-portrait", title: "Cinematic Portrait Prompts" },
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
    ],
  },
  {
    slug: "linkedin-profile-photo",
    title: "LinkedIn Profile Photo Prompts for Professional AI Headshots",
    metaDescription:
      "Use ready-to-copy LinkedIn profile photo prompts to create professional, realistic, and approachable AI headshots.",
    h1: "LinkedIn Profile Photo Prompts",
    category: "Professional",
    categoryLabel: "Professional",
    sampleImage: "/images/generated/hero-photo.webp",
    sampleImageAlt: "Example LinkedIn-style profile photo with realistic portrait lighting",
    heroText:
      "A strong LinkedIn photo should feel professional, clear, and approachable. These prompts help you create profile-ready AI portraits for founders, freelancers, job seekers, and remote professionals.",
    ctaText: "Create a LinkedIn-style photo",
    whatItIs:
      "LinkedIn profile photo prompts focus on clarity, trust, and professionalism. The best prompts avoid heavy filters and keep the person, lighting, and background realistic.",
    bestFor: [
      "Job seekers",
      "Founders",
      "Consultants",
      "Freelancers",
      "Sales and customer-facing professionals",
      "Remote team profiles",
    ],
    prompts: [
      {
        title: "Classic LinkedIn headshot",
        prompt:
          "A realistic LinkedIn profile photo of an adult professional, shoulders-up framing, wearing a clean blazer, soft smile, neutral grey background, natural studio lighting, sharp eyes, professional photography style, trustworthy and approachable mood",
      },
      {
        title: "Tech founder LinkedIn photo",
        prompt:
          "A modern LinkedIn profile portrait of an adult tech founder, smart casual outfit, clean startup office background softly blurred, confident but friendly expression, natural daylight, realistic skin texture, professional editorial photo",
      },
      {
        title: "Consultant profile image",
        prompt:
          "A polished professional profile photo of an adult consultant, beige blazer, simple white background, calm confident expression, soft diffused lighting, realistic business portrait, clean and minimal composition",
      },
      {
        title: "Creative professional LinkedIn photo",
        prompt:
          "A realistic profile photo of an adult creative professional, black turtleneck, warm studio background, relaxed confident expression, soft side lighting, modern editorial portrait, clean high-resolution photography",
      },
      {
        title: "Remote professional photo",
        prompt:
          "A friendly LinkedIn-style portrait of an adult remote professional, simple home office background, natural window light, neat casual outfit, approachable expression, realistic photo style, shallow depth of field",
      },
      {
        title: "Executive LinkedIn portrait",
        prompt:
          "An executive LinkedIn profile photo of an adult leader, dark suit, subtle smile, premium office background, cinematic softbox lighting, realistic professional portrait, crisp details, balanced composition",
      },
    ],
    tips: [
      "Avoid sunglasses, extreme angles, or busy backgrounds.",
      "Keep clothing simple and professional.",
      "Use \"approachable\" instead of \"powerful\" if you want a friendly result.",
      "Add your industry if relevant: tech, finance, coaching, design, real estate.",
    ],
    faqs: [
      {
        question: "What makes a good LinkedIn profile photo?",
        answer:
          "Clear face, good lighting, professional outfit, simple background, and natural expression.",
      },
      {
        question: "Can I use casual clothing?",
        answer:
          "Yes, especially for startup, creator, and freelance profiles.",
      },
      {
        question: "Should I mention my industry in the prompt?",
        answer: "Yes. Industry context helps the image feel more relevant.",
      },
    ],
    related: [
      { slug: "ai-headshot", title: "AI Headshot Prompts" },
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
      { slug: "fashion-editorial", title: "Fashion Editorial Prompts" },
    ],
  },
  {
    slug: "cinematic-portrait",
    title: "Cinematic Portrait Prompts for Movie-Style AI Photos",
    metaDescription:
      "Create movie-style AI portraits with cinematic lighting, dramatic composition, and ready-to-copy prompt examples.",
    h1: "Cinematic Portrait Prompts for Movie-Style AI Photos",
    category: "Creator",
    categoryLabel: "Creator",
    sampleImage: "/images/generated/neon-shadows-portrait.webp",
    sampleImageAlt: "Example cinematic portrait with rainy neon city lighting",
    heroText:
      "Turn a simple portrait idea into a moody, movie-style image. These cinematic portrait prompts focus on lighting, composition, atmosphere, and emotion.",
    ctaText: "Generate a cinematic portrait",
    whatItIs:
      "Cinematic portraits use film-inspired lighting, shallow depth of field, dramatic color grading, and strong framing. They work well for social media avatars, posters, profile images, and creative projects.",
    bestFor: [
      "Instagram portraits",
      "Profile photos with mood",
      "Poster-style visuals",
      "Creator branding",
      "Musician or artist pages",
      "Editorial social content",
    ],
    prompts: [
      {
        title: "Rainy night cinematic portrait",
        prompt:
          "A cinematic portrait of an adult person standing on a rainy city street at night, soft neon reflections, dramatic side lighting, shallow depth of field, subtle film grain, moody atmosphere, realistic photography, 35mm lens look",
      },
      {
        title: "Golden hour movie portrait",
        prompt:
          "A warm cinematic portrait of an adult person during golden hour, backlit hair glow, soft lens flare, natural expression, outdoor field background, film photography color grading, shallow depth of field, emotional movie still look",
      },
      {
        title: "Noir-style portrait",
        prompt:
          "A dramatic black-and-white cinematic portrait of an adult person, strong shadow and light contrast, classic noir mood, simple dark background, serious expression, realistic film photography, crisp facial details",
      },
      {
        title: "Desert road portrait",
        prompt:
          "A cinematic portrait of an adult traveler on an empty desert road, warm sunset light, wind-swept outfit, wide composition, soft film grain, realistic photo, dramatic but natural expression, movie poster atmosphere",
      },
      {
        title: "Urban rooftop portrait",
        prompt:
          "A cinematic rooftop portrait of an adult person overlooking a city skyline, blue hour lighting, soft background bokeh, modern jacket, calm confident pose, realistic editorial photography, cinematic color grading",
      },
      {
        title: "Studio cinematic close-up",
        prompt:
          "A close-up cinematic portrait of an adult person in a dark studio, soft key light from one side, subtle rim light, rich shadows, realistic skin texture, shallow depth of field, high-end film still style",
      },
    ],
    tips: [
      "Add time of day: golden hour, blue hour, night, dawn.",
      "Add lighting: neon, backlight, rim light, soft key light.",
      "Add mood: calm, mysterious, hopeful, dramatic.",
      "Avoid naming specific directors or copyrighted franchises.",
    ],
    faqs: [
      {
        question: "What makes a portrait cinematic?",
        answer:
          "Lighting, mood, color grading, composition, and depth of field.",
      },
      {
        question: "Can I use these prompts for profile pictures?",
        answer:
          "Yes, especially if you want a more creative personal brand image.",
      },
      {
        question: "Should I use color or black-and-white?",
        answer:
          "Both work. Black-and-white is better for noir and dramatic portraits.",
      },
    ],
    related: [
      { slug: "fashion-editorial", title: "Fashion Editorial Prompts" },
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
      { slug: "ai-headshot", title: "AI Headshot Prompts" },
    ],
  },
  {
    slug: "fashion-editorial",
    title: "Fashion Editorial Prompts for Magazine-Style AI Photos",
    metaDescription:
      "Create stylish fashion editorial AI photos with ready-to-use prompts for magazine-style portraits, studio lighting, and polished social visuals.",
    h1: "Fashion Editorial Prompts for Magazine-Style AI Photos",
    category: "Creator",
    categoryLabel: "Creator",
    sampleImage: "/images/generated/hero-editorial.webp",
    sampleImageAlt: "Example fashion editorial portrait with atmospheric lighting",
    heroText:
      "Create polished fashion-editorial images with studio lighting, curated outfits, and magazine-style composition. These prompts are designed for stylish, fully dressed, social-ready portraits.",
    ctaText: "Try a fashion editorial prompt",
    whatItIs:
      "Fashion editorial prompts describe wardrobe, pose, lighting, background, and visual mood. The goal is a high-end styled image focused on clothing, composition, and polished presentation.",
    bestFor: [
      "Instagram posts",
      "Personal brand visuals",
      "Model-style portfolios",
      "Creator thumbnails",
      "Fashion concept boards",
      "Magazine-inspired portraits",
    ],
    prompts: [
      {
        title: "Minimal studio editorial",
        prompt:
          "A high-end fashion editorial portrait of an adult model, fully styled in a tailored black blazer and wide-leg trousers, minimal grey studio backdrop, softbox lighting, elegant pose, realistic magazine photography, polished but natural skin texture",
      },
      {
        title: "Luxury neutral editorial",
        prompt:
          "A luxury fashion editorial photo of an adult person wearing a cream suit, warm beige background, refined styling, soft diffused lighting, calm confident expression, full outfit visible, realistic editorial photography, sophisticated mood",
      },
      {
        title: "Color pop editorial",
        prompt:
          "A bold fashion editorial portrait of an adult model in a vibrant cobalt blue coat, clean studio background, dramatic but tasteful lighting, confident pose, high-fashion magazine composition, realistic photo details, non-sexual styling",
      },
      {
        title: "Street fashion editorial",
        prompt:
          "A street-style fashion editorial photo of an adult person, layered outfit, urban background softly blurred, natural daylight, confident walking pose, realistic lifestyle photography, polished social media look, fully dressed styling",
      },
      {
        title: "Monochrome editorial portrait",
        prompt:
          "A black-and-white fashion editorial portrait of an adult model, structured coat, simple studio background, strong shadows, elegant pose, realistic magazine photography, timeless sophisticated mood",
      },
      {
        title: "Beauty editorial close-up",
        prompt:
          "A tasteful beauty editorial close-up of an adult person, clean makeup, soft glowing skin, neutral background, professional studio lighting, elegant non-sexual styling, realistic magazine portrait photography",
      },
    ],
    tips: [
      "Use words like elegant, tailored, polished, fully styled.",
      "Avoid sexualized descriptions.",
      "Specify studio vs street style.",
      "Add material details: silk, wool, denim, leather jacket, linen.",
    ],
    faqs: [
      {
        question: "Can fashion editorial prompts be safe for general use?",
        answer:
          "Yes, if they focus on styling, lighting, and composition instead of sexualized framing.",
      },
      {
        question: "Can I use brand names?",
        answer: "Better avoid brand names. Describe the visual style instead.",
      },
      {
        question: "Is this good for Instagram?",
        answer:
          "Yes. Editorial-style images are often strong for personal branding and visual storytelling.",
      },
    ],
    related: [
      { slug: "cinematic-portrait", title: "Cinematic Portrait Prompts" },
      { slug: "ai-headshot", title: "AI Headshot Prompts" },
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
    ],
  },
  {
    slug: "90s-yearbook",
    title: "90s Yearbook AI Prompts for Retro School Photo Looks",
    metaDescription:
      "Create nostalgic 90s yearbook-style AI photos with retro outfits, studio backdrops, soft flash, and ready-to-copy prompt examples.",
    h1: "90s Yearbook AI Prompts",
    category: "Trend",
    categoryLabel: "Trend",
    sampleImage: "/images/prompts/vintage-film-look-card.webp",
    sampleImageAlt: "Example nostalgic yearbook-style portrait with vintage film color",
    heroText:
      "Create nostalgic 90s yearbook-style portraits with soft flash, retro studio backgrounds, denim, varsity jackets, and classic school-photo composition.",
    ctaText: "Try a 90s yearbook prompt",
    whatItIs:
      "90s yearbook AI prompts recreate the look of classic studio school portraits: soft lighting, simple backdrops, retro outfits, and slightly nostalgic color tones.",
    bestFor: [
      "Nostalgic social media posts",
      "Retro profile pictures",
      "Friend group concepts",
      "Throwback-style content",
      "Creator trend experiments",
    ],
    prompts: [
      {
        title: "Classic 90s yearbook portrait",
        prompt:
          "A nostalgic 90s yearbook-style portrait of an adult person, denim jacket over a white t-shirt, soft blue studio backdrop, direct camera pose, gentle flash lighting, slightly warm film color, realistic retro school photo look",
      },
      {
        title: "Varsity jacket yearbook photo",
        prompt:
          "A retro 90s yearbook portrait of an adult person wearing a varsity jacket, simple grey studio background, soft flash, centered composition, natural smile, realistic vintage school photography style, subtle film grain",
      },
      {
        title: "90s mall photo studio look",
        prompt:
          "A 90s mall photo studio portrait of an adult person, layered casual outfit, pastel abstract backdrop, soft glamour lighting, relaxed pose, nostalgic color grading, realistic retro portrait photography",
      },
      {
        title: "Grunge yearbook style",
        prompt:
          "A 90s-inspired yearbook portrait of an adult person, plaid shirt over a black tee, simple dark blue background, soft camera flash, natural expression, subtle film grain, realistic retro photo style",
      },
      {
        title: "Clean senior portrait style",
        prompt:
          "A classic 90s senior portrait style photo of an adult person, neat sweater, soft grey background, gentle studio lighting, calm smile, realistic school portrait photography, nostalgic but polished look",
      },
      {
        title: "Retro group-photo inspired solo portrait",
        prompt:
          "A retro 90s yearbook-style solo portrait of an adult person, colorful windbreaker jacket, pastel studio backdrop, soft flash lighting, centered pose, realistic nostalgic photo, high-resolution details",
      },
    ],
    tips: [
      "Add clothing cues: denim jacket, varsity jacket, plaid shirt, windbreaker.",
      "Use \"adult person\" to keep the page safe.",
      "Use \"studio backdrop\" and \"soft flash\".",
      "Avoid real school names or minor-related framing.",
    ],
    faqs: [
      {
        question: "Why are 90s yearbook photos popular?",
        answer:
          "They feel nostalgic, recognizable, and easy to share on social media.",
      },
      {
        question: "Can I make a group version?",
        answer: "Yes, but solo portraits are usually easier to control.",
      },
      {
        question: "Should I say high school yearbook?",
        answer:
          "Safer wording is \"yearbook-style\" or \"retro school photo look\" with adult subjects.",
      },
    ],
    related: [
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
      { slug: "ai-headshot", title: "AI Headshot Prompts" },
      { slug: "cinematic-portrait", title: "Cinematic Portrait Prompts" },
    ],
  },
  {
    slug: "anime-inspired-portrait",
    title: "Anime-Inspired Portrait Prompts for Illustrated AI Avatars",
    metaDescription:
      "Create anime-inspired AI portraits and illustrated avatars with safe, original prompt examples for cozy, fantasy, and social profile looks.",
    h1: "Anime-Inspired Portrait Prompts",
    category: "Trend",
    categoryLabel: "Trend",
    sampleImage: "/images/generated/three-d-cartoon-selfie.webp",
    sampleImageAlt: "Example stylized avatar inspired by animated portrait prompts",
    heroText:
      "Create soft anime-inspired portraits and illustrated avatars without copying a specific studio, artist, or franchise. Use these prompts for cozy, expressive, social-ready profile images.",
    ctaText: "Create an anime-inspired portrait",
    whatItIs:
      "Anime-inspired portrait prompts use expressive eyes, clean linework, soft colors, and illustrated lighting. The safest approach is to describe the visual qualities instead of naming a copyrighted style.",
    bestFor: [
      "Social media avatars",
      "Creator profile pictures",
      "Fantasy portraits",
      "Cozy illustrated characters",
      "Personal branding with a playful look",
    ],
    prompts: [
      {
        title: "Soft anime-inspired avatar",
        prompt:
          "A soft anime-inspired portrait of an adult person, expressive eyes, warm smile, cozy sweater, pastel background, clean linework, gentle lighting, original illustrated style, polished social media avatar, no specific franchise style",
      },
      {
        title: "Fantasy illustrated portrait",
        prompt:
          "An original fantasy anime-inspired portrait of an adult character, flowing cloak, soft glowing background, expressive face, delicate linework, painterly colors, warm magical atmosphere, high-quality illustrated avatar",
      },
      {
        title: "Cozy hand-drawn portrait",
        prompt:
          "A cozy hand-drawn anime-inspired portrait of an adult person sitting by a window, warm tea, soft afternoon light, gentle expression, pastel color palette, clean illustration, original character design",
      },
      {
        title: "Cyber anime avatar",
        prompt:
          "An original cyber anime-inspired avatar of an adult person, futuristic jacket, neon city background, expressive eyes, clean digital linework, vibrant lighting, stylish profile picture composition, no specific IP reference",
      },
      {
        title: "Minimal anime profile picture",
        prompt:
          "A minimal anime-inspired profile portrait of an adult person, simple hoodie, clean background, soft colors, expressive eyes, crisp line art, friendly mood, original illustrated social avatar",
      },
      {
        title: "Dreamy sky portrait",
        prompt:
          "A dreamy anime-inspired portrait of an adult person against a soft cloud and sunset sky, gentle wind, warm pastel colors, expressive eyes, clean original illustration style, peaceful social media avatar",
      },
    ],
    tips: [
      "Describe visual traits, not IP names.",
      "Use \"original illustrated style\".",
      "Add mood: cozy, dreamy, cyber, fantasy, minimal.",
      "If using a real face, use your own image or permitted input.",
    ],
    faqs: [
      {
        question: "Can I mention a famous animation studio?",
        answer:
          "Better not. Describe the look in generic terms instead.",
      },
      {
        question: "Can I make an anime avatar from my own photo?",
        answer:
          "Yes, if you own or have permission to use the photo.",
      },
      {
        question: "Is anime-inspired content safe?",
        answer:
          "It can be, as long as it avoids copying protected IP and avoids sexualized or minor-related content.",
      },
    ],
    related: [
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
      { slug: "cinematic-portrait", title: "Cinematic Portrait Prompts" },
      { slug: "90s-yearbook", title: "90s Yearbook AI Prompts" },
    ],
  },
  {
    slug: "social-media-avatar",
    title: "Social Media Avatar Prompts for AI Profile Pictures",
    metaDescription:
      "Create AI avatars and profile pictures for social media with ready-to-copy prompts for realistic, illustrated, cinematic, and creator-style looks.",
    h1: "Social Media Avatar Prompts",
    category: "Creator",
    categoryLabel: "Creator",
    sampleImage: "/images/prompts/3d-cartoon-selfie-card.webp",
    sampleImageAlt: "Example social media avatar with playful character styling",
    heroText:
      "Your avatar is often the first thing people notice. Use these AI avatar prompts to create profile pictures for X, Instagram, TikTok, YouTube, Discord, and personal websites.",
    ctaText: "Create a social media avatar",
    whatItIs:
      "Social media avatar prompts focus on recognizability, mood, and platform fit. You can choose realistic, illustrated, cinematic, or clean minimal styles.",
    bestFor: [
      "X / Twitter profile photos",
      "Instagram profile pictures",
      "TikTok avatars",
      "YouTube channel images",
      "Discord avatars",
      "Creator and freelancer profiles",
    ],
    prompts: [
      {
        title: "Clean creator avatar",
        prompt:
          "A clean social media avatar of an adult creator, close-up portrait, simple colorful background, friendly confident expression, soft lighting, high clarity, modern profile picture composition, realistic photography style",
      },
      {
        title: "Bold X profile avatar",
        prompt:
          "A bold profile picture of an adult person for social media, dark background, dramatic rim light, confident expression, sharp facial details, cinematic portrait style, high contrast, recognizable small-size avatar composition",
      },
      {
        title: "Friendly Instagram avatar",
        prompt:
          "A bright and friendly social media profile photo of an adult person, warm natural light, soft smile, clean pastel background, realistic portrait photography, approachable creator brand mood",
      },
      {
        title: "YouTube channel avatar",
        prompt:
          "A professional YouTube channel avatar of an adult creator, expressive face, clean studio lighting, subtle colorful background, crisp details, modern creator branding, realistic but polished portrait style",
      },
      {
        title: "Minimal illustrated avatar",
        prompt:
          "A minimal illustrated avatar of an adult person, simple clean shapes, soft color palette, friendly expression, original modern illustration style, clear profile picture composition, suitable for social media",
      },
      {
        title: "Gaming or Discord avatar",
        prompt:
          "A stylized social avatar of an adult gamer or community creator, neon accent lighting, dark clean background, confident expression, modern digital portrait, high clarity, original character-inspired look without specific IP references",
      },
    ],
    tips: [
      "Make the face recognizable even at small size.",
      "Use simple backgrounds.",
      "Match the mood to the platform.",
      "Avoid putting too much text inside avatars.",
    ],
    faqs: [
      {
        question: "What size should a social media avatar be?",
        answer:
          "Most platforms crop to a circle, so keep the face centered.",
      },
      {
        question: "Should I use realistic or illustrated style?",
        answer:
          "Realistic is better for trust; illustrated is better for creator identity.",
      },
      {
        question: "Can I generate avatars for other people?",
        answer: "Only if you have permission to use their likeness.",
      },
    ],
    related: [
      { slug: "ai-headshot", title: "AI Headshot Prompts" },
      { slug: "anime-inspired-portrait", title: "Anime-Inspired Portrait Prompts" },
      { slug: "cinematic-portrait", title: "Cinematic Portrait Prompts" },
    ],
  },
  {
    slug: "product-photography",
    title: "AI Product Photography Prompts for Ecommerce Product Shots",
    metaDescription:
      "Create polished AI product photos for ecommerce, ads, and social content with ready-to-copy product photography prompt examples.",
    h1: "AI Product Photography Prompts",
    category: "Business",
    categoryLabel: "Business",
    sampleImage: "/images/generated/product-photography-sample.webp",
    sampleImageAlt: "Example product photography image with dramatic studio lighting",
    heroText:
      "Create polished product photos for ecommerce, ads, and social posts. These prompts help you describe lighting, background, composition, props, and commercial mood.",
    ctaText: "Generate a product photo",
    whatItIs:
      "Product photography prompts turn a product idea into a clean image direction. They are useful for concept mockups, social visuals, ad creatives, and store content drafts.",
    bestFor: [
      "Shopify product images",
      "Etsy listing visuals",
      "Social media ads",
      "Lifestyle product scenes",
      "Beauty product shots",
      "Food and beverage visuals",
      "Product launch pages",
    ],
    prompts: [
      {
        title: "Minimal ecommerce product shot",
        prompt:
          "A clean ecommerce product photo of a skincare bottle on a white background, soft studio lighting, subtle shadow, centered composition, high-end commercial photography, sharp product details, minimal and premium look",
      },
      {
        title: "Lifestyle desk product shot",
        prompt:
          "A lifestyle product photo of a wireless keyboard on a modern desk, soft morning light, clean workspace, small notebook and coffee cup as props, realistic commercial photography, natural shadows, premium productivity mood",
      },
      {
        title: "Beauty product editorial shot",
        prompt:
          "A high-end beauty product photo of a serum bottle on a beige stone surface, soft warm studio lighting, water droplets, minimal luxury props, realistic editorial product photography, premium skincare advertising style",
      },
      {
        title: "Beverage product shot",
        prompt:
          "A refreshing commercial product photo of a canned drink with condensation, bright colorful background, ice cubes and citrus slices as props, crisp studio lighting, energetic social media advertising composition",
      },
      {
        title: "Fashion accessory product photo",
        prompt:
          "A premium product photo of a leather handbag on a clean neutral pedestal, soft shadows, warm beige background, elegant styling, realistic luxury ecommerce photography, sharp material texture, minimal composition",
      },
      {
        title: "Tech product hero image",
        prompt:
          "A sleek hero product photo of a modern smartphone accessory, dark gradient background, subtle reflection, dramatic rim lighting, high-contrast commercial photography, futuristic premium tech mood, crisp product details",
      },
      {
        title: "Handmade product listing photo",
        prompt:
          "A warm handmade product photo of a ceramic mug on a wooden table, natural window light, cozy kitchen background softly blurred, realistic Etsy-style listing photography, soft shadows, inviting lifestyle mood",
      },
      {
        title: "Social ad product scene",
        prompt:
          "A scroll-stopping social media ad image of a wellness product on a clean pastel background, tasteful props, bright studio lighting, clear space for text overlay, realistic commercial photography, modern brand aesthetic",
      },
    ],
    tips: [
      "Describe product type, surface, background, props, lighting.",
      "Add \"clear space for text overlay\" for ads.",
      "Avoid unverifiable claims about approvals, outcomes, or product performance.",
      "For real products, use your own product photo as input if image editing is supported.",
    ],
    faqs: [
      {
        question: "Can AI product photos replace real product photography?",
        answer:
          "They can help with concepts, ads, and drafts, but final commercial use may require review for accuracy and legal compliance.",
      },
      {
        question: "Should I include brand names?",
        answer:
          "Better describe the category and visual style unless you own the brand assets.",
      },
      {
        question: "Can I use these for ecommerce listings?",
        answer:
          "Use only if the image accurately represents the actual product and follows marketplace rules.",
      },
    ],
    related: [
      { slug: "fashion-editorial", title: "Fashion Editorial Prompts" },
      { slug: "social-media-avatar", title: "Social Media Avatar Prompts" },
      { slug: "cinematic-portrait", title: "Cinematic Portrait Prompts" },
    ],
  },
];

export const promptLibraryMeta = {
  title: "AI Image Prompt Library — Ready-to-Use Prompts for Creators",
  metaDescription:
    "Explore ready-to-use AI image prompts for headshots, cinematic portraits, fashion editorials, avatars, product photos, and social media visuals.",
  h1: "AI Image Prompt Library",
};

export const categories = [
  { key: "Professional", label: "Professional" },
  { key: "Creator", label: "Creator" },
  { key: "Trend", label: "Trend" },
  { key: "Business", label: "Business" },
];
