export const SITE_URL = "https://aieditorrspediting.org";
export const SITE_NAME = "AI Editor RSP";
export const SUPPORT_EMAIL = "support@aieditorrspediting.org";
export const AI_PROVIDER = "fal.ai";
export const PAYMENT_PROVIDER = "Creem";

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "3 lifetime generations",
    quota: "3 lifetime generations",
    cta: "Start Free",
    badge: "No card required",
    features: ["Browse prompt library", "Copy prompt text", "Save favorite prompts", "30-day image retention"],
  },
  {
    name: "Starter",
    price: "$4.99",
    cadence: "/mo",
    quota: "100 generations/month",
    cta: "Get Started — $4.99/mo",
    badge: "Standard queue",
    features: ["100 generations/month", "No ads", "2 concurrent generations", "90-day image retention"],
  },
  {
    name: "Creator",
    price: "$9.99",
    cadence: "/mo",
    quota: "300 generations/month",
    cta: "Get Started — $9.99/mo",
    badge: "Most Popular",
    featured: true,
    features: ["300 generations/month", "Priority queue", "3 concurrent generations", "90-day image retention"],
  },
  {
    name: "Studio",
    price: "$19.99",
    cadence: "/mo",
    quota: "800 generations/month",
    cta: "Get Started — $19.99/mo",
    badge: "Fastest queue",
    features: ["800 generations/month", "Fastest queue", "5 concurrent generations", "90-day image retention"],
  },
];

export const promptCards = [
  { title: "Editorial portrait", style: "Portrait", ratio: "4:5", text: "A cinematic editorial portrait with soft rim light, textured backdrop, subtle film grain, expressive eyes, and high-end magazine color grading." },
  { title: "Architectural landscape", style: "Architecture", ratio: "16:9", text: "A modern coastal house at blue hour, warm interior glow, dramatic sky, reflective water, realistic lens detail, premium travel magazine style." },
  { title: "Abstract product art", style: "Abstract", ratio: "1:1", text: "A floating glass perfume bottle surrounded by translucent ribbons, mint cyan highlights, amber reflections, dark studio background, sharp product lighting." },
  { title: "Fashion campaign", style: "Fashion", ratio: "3:4", text: "A futuristic fashion campaign image, silver fabric, confident pose, cinematic shadows, clean negative space, luxury brand mood." },
  { title: "Food poster", style: "Food", ratio: "4:5", text: "A premium dessert poster with macro texture, falling powdered sugar, warm amber rim light, dark marble surface, editorial food photography." },
  { title: "Creator thumbnail", style: "Social", ratio: "16:9", text: "A bold creator thumbnail background with neon cyan accents, dynamic composition, realistic desk setup, space for headline text." },
];

export const legalDisclaimer = "Images are generated through third-party AI model providers. Usage rights and limitations may depend on provider and model terms.";
