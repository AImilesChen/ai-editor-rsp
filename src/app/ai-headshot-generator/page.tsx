import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Headshot Generator — AI Business Portrait Tool",
  description: "Upload a photo and create a polished AI professional headshot for resumes, business profiles, company bios, and corporate portraits.",
  alternates: { canonical: `${SITE_URL}/ai-headshot-generator` },
  openGraph: {
    title: "Professional Headshot Generator — AI Editor RSP",
    description: "Create a business-ready AI headshot from your photo for resumes, company bios, and professional profiles.",
    url: `${SITE_URL}/ai-headshot-generator`,
    type: "website",
    images: [`${SITE_URL}/images/headshot-examples/corporate-executive-headshot.webp`],
  },
};

const headshotPrompts = [
  {
    title: "Corporate executive portrait",
    description: "Board-ready headshot with a tailored dark suit, composed expression, and a modern office or meeting-room backdrop.",
    keyword: "executive headshot generator",
    image: "/images/headshot-examples/corporate-executive-headshot.webp",
    imageAlt: "AI corporate executive headshot example with a tailored suit and office backdrop",
    stylePrompt: "Create a realistic corporate executive headshot for a company leadership bio: tailored dark suit, crisp light shirt, composed confident expression, modern glass office or boardroom background, premium but natural studio lighting, subtle depth of field, eye-level camera, shoulders-up 3:4 crop, realistic skin texture.",
  },
  {
    title: "Resume and CV clean photo",
    description: "Minimal job-search portrait with a white shirt, plain light background, direct eye contact, and no distracting styling.",
    keyword: "AI resume photo generator",
    image: "/images/headshot-examples/resume-cv-clean-headshot.webp",
    imageAlt: "AI resume photo example with a clean white shirt and plain light background",
    stylePrompt: "Create a clean resume and CV headshot for a job application: front-facing pose, simple white or light blue shirt, plain white or light gray background, calm approachable expression, bright even lighting, no heavy retouching, no dramatic shadows, tidy hair, shoulders-up 3:4 crop.",
  },
  {
    title: "Startup founder headshot",
    description: "Approachable founder profile with smart-casual clothing, natural smile, and a bright coworking or startup office feel.",
    keyword: "startup founder headshot",
    image: "/images/headshot-examples/startup-founder-headshot.webp",
    imageAlt: "Startup founder AI headshot example in a bright coworking office setting",
    stylePrompt: "Create a startup founder headshot for a founder page or investor profile: smart-casual outfit without a tie, confident natural smile, bright coworking office or modern startup workspace background, warm daylight, approachable leadership energy, realistic photography style, shoulders-up 3:4 crop.",
  },
  {
    title: "Consultant or advisor profile",
    description: "Trust-focused expert portrait with formal attire, restrained lighting, and a credible professional-services look.",
    keyword: "consultant headshot generator",
    image: "/images/headshot-examples/consultant-advisor-headshot.webp",
    imageAlt: "AI consultant advisor headshot example with formal attire and a premium neutral background",
    stylePrompt: "Create a consultant or advisor headshot for a professional services profile: formal blazer or suit, experienced trustworthy expression, neutral premium background with subtle depth, controlled studio lighting, conservative business styling, sharp eyes, realistic facial detail, shoulders-up 3:4 crop.",
  },
  {
    title: "Creative professional portrait",
    description: "Personal-brand headshot with relaxed premium styling, warmer studio tones, and more personality than a corporate bio.",
    keyword: "creative professional portrait",
    image: "/images/headshot-examples/creative-professional-headshot.webp",
    imageAlt: "Creative professional AI headshot example with warm studio lighting and personal-brand styling",
    stylePrompt: "Create a creative professional portrait for a designer, creator, or independent consultant: relaxed premium outfit such as a dark turtleneck or textured jacket, warm studio or tasteful workspace background, expressive but professional look, cinematic soft lighting, natural skin texture, editorial personal-brand feel, shoulders-up 3:4 crop.",
  },
  {
    title: "White-background directory photo",
    description: "Uniform staff-directory image with a pure light background, friendly expression, and consistent company-page framing.",
    keyword: "staff directory headshot",
    image: "/images/headshot-examples/white-background-directory-headshot.webp",
    imageAlt: "White background staff directory AI headshot example for a company team page",
    stylePrompt: "Create a staff directory headshot for a company team page: pure white or very light gray background, neat business-casual outfit, friendly expression, bright even lighting, consistent front-facing pose, clean edges around shoulders, no props, directory-ready 3:4 crop.",
  },
];

const useCases = [
  ["Professional profile photo", "Create a clean business headshot that looks professional without booking a studio session."],
  ["Resume or CV photo", "Turn a casual face photo into a more formal resume headshot for job applications and portfolios."],
  ["Company bio portrait", "Make consistent business profile photos for team pages, founder bios, and About pages."],
  ["Sales and consultant profiles", "Use a polished corporate headshot for client-facing profiles, proposals, and online directories."],
];

const faqs = [
  {
    question: "Can I create a professional headshot from a casual photo?",
    answer: "Yes. Upload a clear face photo, and the professional headshot generator can create a cleaner business portrait with professional outfit, neutral background, and polished lighting.",
  },
  {
    question: "Does the AI preserve my face and identity?",
    answer: "The editor uses your uploaded photo as the visual anchor and tries to preserve the same person, facial structure, and expression. AI results can vary, so use a clear front-facing image for best results.",
  },
  {
    question: "What photo works best for a professional headshot?",
    answer: "Use a clear front-facing photo with good lighting, no sunglasses, no heavy filters, and a visible face. Simple backgrounds usually produce cleaner business headshots.",
  },
  {
    question: "Can I change the outfit or background?",
    answer: "Yes. The optional instructions box lets you ask for details like a navy blazer, white shirt, studio background, office background, softer lighting, or a more executive look.",
  },
  {
    question: "What size is best for professional headshots?",
    answer: "Portrait 3:4 is the recommended default for a professional headshot. Square 1:1 can also work well for profile avatars, but portrait framing usually gives more room for shoulders and outfit.",
  },
  {
    question: "How many credits does a professional headshot cost?",
    answer: "The default professional headshot request starts at 4 credits. Larger or square HD outputs may use more credits depending on the selected image size.",
  },
  {
    question: "Can I use the generated headshot for business profiles?",
    answer: "You may use the result for professional profile contexts if you have permission to edit the uploaded photo and the use complies with applicable law, third-party rights, and the selected AI model's terms. You are responsible for reviewing the result before publication.",
  },
  {
    question: "Is my uploaded photo private?",
    answer: "Upload photos you own or have permission to edit. AI Editor RSP processes the image to generate the result and provides account history for signed-in users to access previous generations.",
  },
  {
    question: "Who should use an AI professional headshot generator?",
    answer: "It is useful for job seekers, founders, consultants, sales teams, freelancers, and remote teams that need consistent business profile photos without booking a studio session.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Editor RSP Professional Headshot Generator",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/ai-headshot-generator`,
  description: "AI professional headshot generator for resume headshots, business portraits, company bios, and corporate profile pictures.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "0",
    description: "New users can try AI Editor RSP with free credits before buying more credits.",
  },
};

export default function ImageEditorPage() {
  return (
    <>
      <Header />
      <script type="application/ld+json">{JSON.stringify([faqJsonLd, softwareJsonLd])}</script>
      <main className="pt-20">
        <section id="try-reference-edit" className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-8 md:px-8 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto max-w-screen-xl">
            <div className="mb-6 max-w-4xl">
              <p className="eyebrow text-[10px]">AI professional headshot generator</p>
              <h1 className="mt-3 font-heading text-4xl font-normal leading-[0.98] tracking-[-0.05em] text-rsp-text md:text-6xl">
                Upload a photo. Create a professional headshot.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-rsp-muted md:text-base">
                Turn a casual face photo into a polished AI headshot for resumes, company bios, consultant profiles, and business portraits.
              </p>
            </div>

            <div id="headshot-upload" className="scroll-mt-28">
              <GenerateConsole headingLevel="h2" previewHeadingLevel="h2" variant="hero" defaultMode="edit" lockedMode="edit" defaultPreset="headshot" hidePreviewIntro loginReturnPath="/ai-headshot-generator" />
            </div>

            <p className="mt-4 rounded-[24px] border border-rsp-border bg-white/76 px-5 py-3 text-xs leading-5 text-rsp-muted shadow-[0_10px_28px_rgba(46,32,18,0.06)] backdrop-blur">
              Upload your own photo or an image you have permission to edit. AI tries to preserve identity, but results may vary.
            </p>
          </div>
        </section>

        <section className="bg-[#FBF7F0] px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-screen-xl">
            <div className="max-w-3xl border-t border-rsp-border/70 pt-10">
              <p className="eyebrow text-[10px]">Professional headshot prompts</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">
                Popular AI headshot styles for work profiles
              </h2>
              <p className="mt-3 text-base leading-7 text-rsp-muted">
                Start with the default professional headshot prompt, or use these ideas when you want a more specific corporate portrait, resume photo, or business profile picture.
              </p>
            </div>

            <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
              {headshotPrompts.map((item) => (
                <article key={item.title} className="group flex overflow-hidden rounded-[30px] border border-rsp-border bg-white shadow-[0_18px_42px_rgba(46,32,18,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(46,32,18,0.11)]">
                  <div className="flex w-full flex-col">
                    <div className="relative m-3 overflow-hidden rounded-[24px] bg-[#EDE3D8]">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        width={1024}
                        height={1280}
                        loading="eager"
                        className="aspect-[4/5] h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-rsp-text shadow-[0_8px_18px_rgba(46,32,18,0.12)]">
                        Example result
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rsp-terracotta">{item.keyword}</p>
                      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-rsp-text">{item.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-rsp-muted">{item.description}</p>
                      <a href={`/ai-headshot-generator?stylePrompt=${encodeURIComponent(item.stylePrompt)}#headshot-upload`} className="mt-5 inline-flex w-fit rounded-full border border-rsp-border px-4 py-2 text-sm font-bold text-rsp-text no-underline transition hover:border-rsp-terracotta hover:text-rsp-terracotta">
                        Use this style ↑
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F4EDE3] px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="eyebrow text-[10px]">Use cases</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">
                One AI portrait for many professional profiles
              </h2>
              <p className="mt-4 text-base leading-7 text-rsp-muted">
                A good business headshot should look clear, realistic, and trustworthy. Use the editor when you need a professional profile picture quickly, without manually writing a complex prompt.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {useCases.map(([title, text]) => (
                <div key={title} className="rounded-[26px] border border-rsp-border bg-white/82 p-5 shadow-[0_14px_32px_rgba(46,32,18,0.055)]">
                  <h3 className="text-lg font-semibold text-rsp-text">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-rsp-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FBF7F0] px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto mb-10 max-w-screen-xl rounded-[32px] border border-rsp-border bg-white/78 p-6 shadow-sm md:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="eyebrow text-[10px]">Business-ready portraits</p>
                <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">
                  Make profile photos that match the place they will be used.
                </h2>
                <p className="mt-4 text-base leading-7 text-rsp-muted">
                  A resume photo, company bio portrait, and consultant profile do not need the same crop or background. Use clear instructions for outfit, background, lighting, and final use case so the generated headshot feels appropriate.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {["Job search profiles", "Company team pages", "Founder and consultant bios"].map((item) => (
                  <article key={item} className="rounded-[24px] border border-rsp-border bg-[#FBF7F0] p-5">
                    <h3 className="text-base font-bold text-rsp-text">{item}</h3>
                    <p className="mt-2 text-sm leading-6 text-rsp-muted">Generate a professional headshot with realistic lighting, clean framing, and business-focused styling.</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow text-[10px]">How it works</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">
                Generate a business-ready headshot in four steps
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Upload a clear front-facing face photo", "Choose the recommended 3:4 portrait size", "Add optional outfit, background, or lighting details", "Generate, review, and download your professional headshot"].map((step, index) => (
                <div key={step} className="rounded-[24px] border border-rsp-border bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rsp-text text-sm font-black text-white">{index + 1}</span>
                  <p className="mt-4 text-base font-semibold leading-6 text-rsp-text">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F4EDE3] px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-screen-xl">
            <div className="max-w-3xl">
              <p className="eyebrow text-[10px]">FAQ</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">
                Professional headshot generator FAQ
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
                <details key={item.question} className="group rounded-[24px] border border-rsp-border bg-white p-5 shadow-[0_12px_28px_rgba(46,32,18,0.045)]">
                  <summary className="cursor-pointer list-none text-base font-semibold text-rsp-text">
                    {item.question}
                    <span className="float-right text-rsp-muted transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-rsp-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1E1711] px-4 py-12 text-white md:px-8">
          <div className="mx-auto flex max-w-screen-xl flex-col gap-5 rounded-[32px] border border-white/10 bg-white/[0.045] p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#86EFAC]">More AI image tools</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em]">Explore prompts and image editing workflows</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/prompts" className="rounded-full bg-[#86EFAC] px-5 py-3 text-sm font-bold text-[#102014] no-underline">Browse prompts</Link>
              <Link href="/generate" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white no-underline">AI image generator</Link>
              <Link href="/reference-edit" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white no-underline">Reference edit guide</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
