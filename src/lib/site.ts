export const SITE_URL = "https://aieditorrspediting.org";
export const SITE_NAME = "AI Editor RSP";
export const SUPPORT_EMAIL = "support@aieditorrspediting.org";
export const AI_PROVIDER = "fal.ai";
export const PAYMENT_PROVIDER = "Creem";

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "3 credits total",
    quota: "3 credits total",
    cta: "Try Generator",
    badge: "No card required",
    audience: "Best for testing the editor before paying.",
    estimate: "Includes 3 one-time signup credits.",
    features: ["Browse prompt library", "Copy prompt text", "Try image generation", "No payment required"],
  },
  {
    name: "Starter",
    price: "$7.99",
    cadence: "/mo",
    quota: "120 credits/month",
    cta: "Continue to checkout",
    badge: "Standard queue",
    audience: "For light creator use and occasional edits.",
    estimate: "Up to 120 portrait text-to-image generations.",
    features: ["120 credits/month", "No ads", "2 concurrent image requests", "90-day image retention"],
  },
  {
    name: "Creator",
    price: "$14.99",
    cadence: "/mo",
    quota: "300 credits/month",
    cta: "Continue to checkout",
    badge: "Recommended",
    featured: true,
    audience: "Best balance for weekly creator workflows.",
    estimate: "Up to 300 portrait text-to-image generations.",
    features: ["300 credits/month", "Priority queue", "3 concurrent image requests", "90-day image retention"],
  },
  {
    name: "Studio",
    price: "$29.99",
    cadence: "/mo",
    quota: "700 credits/month",
    cta: "Continue to checkout",
    badge: "Fastest queue",
    audience: "For high-volume production and faster queues.",
    estimate: "Up to 700 portrait text-to-image generations.",
    features: ["700 credits/month", "Fastest queue", "5 concurrent image requests", "90-day image retention"],
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

export const legalDisclaimer = "Images are generated through third-party AI model providers. Upload only images you have rights to use. Usage rights and limitations may depend on provider and model terms. Refunds are available within 14 days if no more than 50% of paid credits from that billing period have been used.";
