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
    slug: "neon-shadows-portrait",
    title: "Neon Shadows Portrait",
    style: "Photo",
    ratio: "1:1",
    prompt:
      "A cinematic editorial portrait with neon reflections on wet glass, dark studio lighting, teal and amber rim light, high-end creator workstation aesthetic, ultra-detailed skin texture, shallow depth of field.",
    image: "from-cyan-300 via-slate-800 to-amber-300",
    imagePath: "/images/generated/neon-shadows-portrait.webp",
  },
  {
    slug: "architectural-dreamscape",
    title: "Architectural Dreamscape",
    style: "3D",
    ratio: "16:9",
    prompt:
      "A futuristic architectural landscape at blue hour, reflective marble floors, floating light panels, cinematic composition, crisp details, high-end concept art, teal accents and warm amber windows.",
    image: "from-indigo-400 via-slate-900 to-cyan-300",
    imagePath: "/images/generated/architectural-dreamscape.webp",
  },
  {
    slug: "abstract-digital-poster",
    title: "Abstract Digital Poster",
    style: "Editorial",
    ratio: "4:3",
    prompt:
      "An abstract digital art poster with liquid chrome ribbons, soft grain, mint cyan glows, amber highlights, dramatic shadows, gallery-quality composition, no text, no watermark.",
    image: "from-fuchsia-400 via-slate-950 to-amber-200",
    imagePath: "/images/generated/abstract-digital-poster.webp",
  },
  {
    slug: "product-glow-shot",
    title: "Product Glow Shot",
    style: "Product",
    ratio: "1:1",
    prompt:
      "A high-end product photo on a dark cinematic desk, reflective black acrylic base, mint cyan edge lighting, amber back glow, sharp commercial photography, realistic shadows.",
    image: "from-emerald-300 via-zinc-950 to-orange-300",
    imagePath: "/images/generated/product-glow-shot.webp",
  },
  {
    slug: "anime-night-market",
    title: "Anime Night Market",
    style: "Anime",
    ratio: "9:16",
    prompt:
      "A vertical anime scene in a rainy night market, glowing signs, cinematic depth, expressive character pose, detailed reflections, teal and amber color palette, clean linework.",
    image: "from-sky-400 via-slate-900 to-rose-300",
    imagePath: "/images/generated/anime-night-market.webp",
  },
  {
    slug: "line-art-creator-desk",
    title: "Line Art Creator Desk",
    style: "Line Art",
    ratio: "16:9",
    prompt:
      "Minimal line art illustration of a creator workstation, image generation console on screen, soft cyan accents, precise vector lines, dark background, editorial tech diagram style.",
    image: "from-slate-600 via-black to-cyan-200",
    imagePath: "/images/generated/line-art-creator-desk.webp",
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
