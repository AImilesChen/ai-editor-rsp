export const site = {
  name: "AI Editor RSP",
  product: "AI Editor RSP",
  url: "https://aieditorrspediting.org",
  support: "support@aieditorrspediting.org",
  description:
    "Generate AI images and edit uploaded photos with ready-made prompts, starter credits, and simple credit-based plans.",
};

export const promptCards = [
  {
    slug: "double-exposure-travel-rishikesh",
    title: "Double Exposure Travel",
    style: "Photo",
    ratio: "4:5",
    prompt:
      "Blend a portrait with a cinematic travel scene, warm sunset tones, soft double exposure edges, realistic texture, and editorial RSP-style color grading.",
    image: "from-cyan-300 via-slate-800 to-amber-300",
    imagePath: "/images/generated/double-exposure-travel-rishikesh.webp",
  },
  {
    slug: "horror-girlfriend-ai-photo",
    title: "Horror Portrait Edit",
    style: "Portrait",
    ratio: "4:5",
    prompt:
      "Create a moody horror portrait with controlled shadows, glowing eyes, cinematic contrast, fog texture, and a polished dark editorial finish.",
    image: "from-indigo-400 via-slate-900 to-cyan-300",
    imagePath: "/images/generated/horror-girlfriend-ai-photo.webp",
  },
  {
    slug: "lofi-girl-vibes",
    title: "Lofi Study Mood",
    style: "Anime",
    ratio: "9:16",
    prompt:
      "Turn a cozy desk scene into a lofi night-study visual with warm lamp light, rain outside the window, soft grain, and calm creator atmosphere.",
    image: "from-fuchsia-400 via-slate-950 to-amber-200",
    imagePath: "/images/generated/lofi-girl-vibes.webp",
  },
  {
    slug: "3d-cartoon-selfie",
    title: "3D Cartoon Selfie",
    style: "3D",
    ratio: "1:1",
    prompt:
      "Convert a selfie into a friendly 3D cartoon portrait with glossy studio lighting, expressive eyes, clean background, and detailed render quality.",
    image: "from-emerald-300 via-zinc-950 to-orange-300",
    imagePath: "/images/generated/three-d-cartoon-selfie.webp",
  },
  {
    slug: "diwali-light-portrait",
    title: "Diwali Light Portrait",
    style: "Festival",
    ratio: "4:5",
    prompt:
      "Create a warm festive portrait with Diwali diyas, golden bokeh, rich clothing detail, soft focus background, and cinematic celebration lighting.",
    image: "from-sky-400 via-slate-900 to-rose-300",
    imagePath: "/images/generated/diwali-light-portrait.webp",
  },
  {
    slug: "cinematic-movie-poster",
    title: "Cinematic Movie Poster",
    style: "Poster",
    ratio: "16:9",
    prompt:
      "Design a dramatic movie-poster image with strong key light, expressive subject, subtle film grain, studio contrast, and clean cinematic composition.",
    image: "from-slate-600 via-black to-cyan-200",
    imagePath: "/images/generated/cinematic-movie-poster.webp",
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    cadence: "3 credits included",
    quota: "3 credits total",
    generations: "No payment required",
    cta: "Start free",
    featured: false,
    badge: "Try first",
    features: ["No card required", "Ready prompts included", "Basic image generation"],
  },
  {
    name: "Starter",
    price: "USD $7.99",
    cadence: "/mo",
    quota: "120 credits/month",
    generations: "Occasional image generation",
    cta: "Choose Starter",
    featured: false,
    badge: "Light use",
    features: ["Portraits and product shots", "Use prompt library", "Secure hosted checkout"],
  },
  {
    name: "Creator",
    price: "USD $14.99",
    cadence: "/mo",
    quota: "300 credits/month",
    generations: "Best for weekly creators",
    cta: "Choose Creator",
    featured: true,
    badge: "Best value",
    features: ["More prompt testing", "Text-to-image and edits", "Better room for variations"],
  },
  {
    name: "Studio",
    price: "USD $29.99",
    cadence: "/mo",
    quota: "700 credits/month",
    generations: "Frequent creative testing",
    cta: "Choose Studio",
    featured: false,
    badge: "High volume",
    features: ["Larger creative batches", "Generation and editing", "Fastest queue"],
  },
];

export const integrationStates = [
  { label: "AI image generation", state: "Connected", detail: "Generation requests run through secure image generation with safety and credit checks." },
  { label: "Subscription billing", state: "Connected", detail: "Secure checkout, billing portal access, cancellation, credits, and refund status are available from signed-in accounts." },
  { label: "Login and library", state: "Connected", detail: "Google sign-in, email magic links, account credits, and billing status are available from signed-in accounts." },
  { label: "Credits", state: "Account-based", detail: "New accounts receive 3 one-time free credits. Paid credits are granted after payment confirmation." },
];

export const faqItems = [
  { q: "Can I generate images here today?", a: "Yes. Sign in to claim 3 free credits, then create from a ready prompt or open Image Editor to edit an uploaded image." },
  { q: "How do credits work?", a: "Credits are used when you generate or edit an image. Portrait text-to-image starts at 1 credit; square, landscape, and uploaded-image edits may use more credits." },
  { q: "Is this affiliated with RSP Editing?", a: "No. This is an independent creator tool and prompt hub." },
  { q: "Do I need a card to start?", a: "No. You can sign in and use your free credits before choosing a paid plan." },
  { q: "Can I use uploaded images for editing?", a: "Yes. Upload a PNG, JPG, or WebP image, describe the edit, compare before and after, then download the result." },
  { q: "Can I use generated images commercially?", a: "Generated images may be used depending on your use case, the underlying AI model terms, and your own legal review. AI Editor RSP does not guarantee every output is free from third-party rights or suitable for every commercial use." },
  { q: "How are payments handled?", a: "Paid plans use secure hosted checkout after sign-in. AI Editor RSP does not store your payment details. Eligible refunds can be requested from Account → Billing." },
];
