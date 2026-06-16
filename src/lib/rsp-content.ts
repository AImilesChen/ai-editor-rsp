export const site = {
  name: "AI Editor RSP",
  product: "RSP Hub",
  url: "https://aieditorrspediting.org",
  support: "support@aieditorrspediting.org",
  description:
    "Upload a photo, add a short prompt, and generate polished RSP-style image edits with a credits-based plan preview.",
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
  { name: "Free", price: "$0", cadence: "", generations: "3 credits total", cta: "Try Generator", featured: false },
  { name: "Starter", price: "$7.99", cadence: "/mo", generations: "120 credits/month", cta: "Preview Starter", featured: false },
  { name: "Creator", price: "$14.99", cadence: "/mo", generations: "300 credits/month", cta: "Preview Creator", featured: true },
  { name: "Studio", price: "$29.99", cadence: "/mo", generations: "700 credits/month", cta: "Preview Studio", featured: false },
];

export const integrationStates = [
  { label: "fal.ai image generation", state: "API connected", detail: "Worker API and generated case-image assets are connected; production moderation and retention policy still need backend/legal review." },
  { label: "Creem subscription billing", state: "Pending", detail: "Do not collect payment until MoR subscription support is confirmed." },
  { label: "Login and library", state: "Pending", detail: "Account persistence belongs to the backend phase." },
  { label: "Credits", state: "Session preview", detail: "Free credits are tracked in a secure session cookie; persistent account credits still need D1 and login." },
];

export const faqItems = [
  { q: "Can I generate images here today?", a: "Yes. You can start a preview generation flow from the Generate page. Saved accounts, billing, and long-term credit history are not active yet." },
  { q: "Are the prices final?", a: "The visible plan values are the confirmed frontend copy: Free 3 credits total, Starter $7.99 for 120 credits/month, Creator $14.99 for 300 credits/month, Studio $29.99 for 700 credits/month." },
  { q: "Is this affiliated with RSP Editing?", a: "No. This is an independent creator tool and prompt hub." },
  { q: "Are payments active?", a: "No. Checkout and subscriptions are shown as pending, not as live payment flows." },
];
