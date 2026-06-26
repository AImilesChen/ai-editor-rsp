export const SITE_URL = "https://aieditorrspediting.org";
export const SITE_NAME = "AI Editor RSP";
export const SUPPORT_EMAIL = "support@aieditorrspediting.org";
export const AI_PROVIDER = "fal.ai";
export const PAYMENT_PROVIDER = "Creem";

export const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    cadence: "3 credits included",
    quota: "3 credits total",
    cta: "Start free",
    badge: "No card required",
    audience: "Try AI Editor RSP with starter credits before paying.",
    estimate: "Includes 3 one-time signup credits.",
    features: ["3 credits total", "No payment required", "Access ready prompts", "Test basic image workflows"],
  },
  {
    name: "Starter",
    price: "USD $7.99",
    cadence: "/mo",
    quota: "120 credits/month",
    cta: "Choose Starter",
    badge: "Standard queue",
    audience: "For occasional image generation and light editing.",
    estimate: "For light creator use.",
    features: ["120 credits/month", "Use ready-made prompts", "Generate portraits, products, and social visuals", "Secure hosted checkout"],
  },
  {
    name: "Creator",
    price: "USD $14.99",
    cadence: "/mo",
    quota: "300 credits/month",
    cta: "Choose Creator",
    badge: "Most Popular",
    featured: true,
    audience: "Best for creators who generate images every week.",
    estimate: "Better value for regular creators.",
    features: ["300 credits/month", "More room for prompt testing and variations", "Use text-to-image and uploaded-image editing", "Priority queue"],
  },
  {
    name: "Studio",
    price: "USD $29.99",
    cadence: "/mo",
    quota: "700 credits/month",
    cta: "Choose Studio",
    badge: "Fastest queue",
    audience: "For heavier image workflows and frequent creative testing.",
    estimate: "Designed for larger batches and more experiments.",
    features: ["700 credits/month", "Use credits across generation and editing", "5 concurrent image requests", "Fastest queue"],
  },
];

export const promptCards = [
  { title: "Editorial portrait", style: "Portrait", ratio: "4:5", text: "A cinematic editorial portrait with soft rim light, textured backdrop, subtle film grain, expressive eyes, and high-end magazine color grading." },
  { title: "Architectural landscape", style: "Architecture", ratio: "16:9", text: "A modern coastal house at blue hour, warm interior glow, dramatic sky, reflective water, realistic lens detail, high-end travel magazine style." },
  { title: "Abstract product art", style: "Abstract", ratio: "1:1", text: "A floating glass perfume bottle surrounded by translucent ribbons, mint cyan highlights, amber reflections, dark studio background, sharp product lighting." },
  { title: "Fashion campaign", style: "Fashion", ratio: "3:4", text: "A futuristic fashion campaign image, silver fabric, confident pose, cinematic shadows, clean negative space, luxury brand mood." },
  { title: "Food poster", style: "Food", ratio: "4:5", text: "A high-end dessert poster with macro texture, falling powdered sugar, warm amber rim light, dark marble surface, editorial food photography." },
  { title: "Creator thumbnail", style: "Social", ratio: "16:9", text: "A bold creator thumbnail background with neon cyan accents, dynamic composition, realistic desk setup, space for headline text." },
];

export const legalDisclaimer = "Images are generated through third-party AI model providers. Upload only images you have rights to use. Usage rights and limitations may depend on provider and model terms. Self-service refunds are available within 7 days if no more than 20% of paid credits from that billing period have been used.";
