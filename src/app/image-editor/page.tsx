import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Headshot Generator — AI LinkedIn Photo Tool",
  description: "Upload a photo and create a polished AI professional headshot for LinkedIn, resumes, business profiles, company bios, and corporate portraits.",
  alternates: { canonical: `${SITE_URL}/image-editor` },
  openGraph: {
    title: "Professional Headshot Generator — AI Editor RSP",
    description: "Create a business-ready AI headshot from your photo for LinkedIn, resumes, and professional profiles.",
    url: `${SITE_URL}/image-editor`,
    type: "website",
  },
};

const headshotPrompts = [
  {
    title: "LinkedIn professional headshot",
    description: "A polished profile photo with confident expression, clean business outfit, soft studio lighting, and neutral office background.",
    keyword: "LinkedIn headshot generator",
    image: "/images/headshot-examples/linkedin-professional-headshot.webp",
    imageAlt: "LinkedIn professional AI headshot example generated from a casual profile photo",
  },
  {
    title: "Corporate team profile photo",
    description: "Consistent company bio style with natural skin tone, professional blazer, bright background, and trustworthy business portrait framing.",
    keyword: "corporate headshot generator",
    image: "/images/headshot-examples/corporate-team-profile-photo.webp",
    imageAlt: "Corporate AI headshot example for a company team profile photo",
  },
  {
    title: "Resume and CV headshot",
    description: "Clean front-facing professional portrait suitable for resume, CV, portfolio, and job application profile photos.",
    keyword: "AI resume photo generator",
    image: "/images/headshot-examples/resume-cv-headshot.webp",
    imageAlt: "AI resume photo generator example with a clean professional headshot",
  },
  {
    title: "Founder or consultant portrait",
    description: "Executive-style headshot with premium lighting, subtle depth of field, approachable smile, and confident business presence.",
    keyword: "business portrait generator",
    image: "/images/headshot-examples/founder-consultant-portrait.webp",
    imageAlt: "Business portrait generator example for a founder or consultant profile",
  },
  {
    title: "White background profile photo",
    description: "Simple high-contrast professional profile image with white or light gray background for directories and company pages.",
    keyword: "professional profile picture maker",
    image: "/images/headshot-examples/white-background-profile-photo.webp",
    imageAlt: "Professional profile picture maker example with a clean light background",
  },
  {
    title: "Studio business headshot",
    description: "Modern studio portrait with realistic facial details, sharp eyes, balanced lighting, and polished professional styling.",
    keyword: "AI professional photo generator",
    image: "/images/headshot-examples/studio-business-headshot.webp",
    imageAlt: "AI professional photo generator studio business headshot example",
  },
];

const useCases = [
  ["LinkedIn profile photo", "Create a clean AI LinkedIn headshot that looks professional without booking a studio session."],
  ["Resume or CV photo", "Turn a casual face photo into a more formal resume headshot for job applications and portfolios."],
  ["Company bio portrait", "Make consistent business profile photos for team pages, founder bios, and About pages."],
  ["Sales and consultant profiles", "Use a polished corporate headshot for client-facing profiles, proposals, and online directories."],
];

const faqs = [
  {
    question: "Can I create a LinkedIn headshot from a casual photo?",
    answer: "Yes. Upload a clear face photo, and the professional headshot generator can create a cleaner LinkedIn-style portrait with business outfit, neutral background, and polished lighting.",
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
    question: "What size is best for LinkedIn headshots?",
    answer: "Portrait 3:4 is the recommended default for a professional headshot. Square 1:1 can also work well for profile avatars, but portrait framing usually gives more room for shoulders and outfit.",
  },
  {
    question: "How many credits does a professional headshot cost?",
    answer: "The default professional headshot request starts at 4 credits. Larger or square HD outputs may use more credits depending on the selected image size.",
  },
  {
    question: "Can I use the generated headshot for business profiles?",
    answer: "Yes, you can use the result for LinkedIn, resumes, company bios, consultant profiles, founder pages, and other professional profile contexts, as long as you have permission to edit the uploaded photo.",
  },
  {
    question: "Is my uploaded photo private?",
    answer: "Upload photos you own or have permission to edit. AI Editor RSP processes the image to generate the result and provides account history for signed-in users to access previous generations.",
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
  url: `${SITE_URL}/image-editor`,
  description: "AI professional headshot generator for LinkedIn photos, resume headshots, business portraits, and corporate profile pictures.",
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
        <section id="try-reference-edit" className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-6 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto max-w-screen-2xl">
            <div className="mb-5 max-w-4xl">
              <p className="eyebrow text-[10px]">AI professional headshot generator</p>
              <h1 className="mt-3 font-heading text-4xl font-normal leading-[0.98] tracking-[-0.05em] text-rsp-text md:text-6xl">
                Upload a photo. Create a professional headshot.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-rsp-muted md:text-base">
                Turn a casual face photo into a polished AI headshot for LinkedIn, resumes, company bios, consultant profiles, and business portraits.
              </p>
            </div>

            <div id="headshot-upload" className="scroll-mt-28">
              <GenerateConsole headingLevel="h2" previewHeadingLevel="h2" variant="hero" defaultMode="edit" lockedMode="edit" defaultPreset="headshot" hidePreviewIntro />
            </div>

            <p className="mt-4 rounded-[24px] border border-rsp-border bg-white/76 p-4 text-xs leading-5 text-rsp-muted shadow-[0_10px_28px_rgba(46,32,18,0.06)] backdrop-blur">
              Upload your own photo or an image you have permission to edit. AI tries to preserve identity, but results may vary.
            </p>
          </div>
        </section>

        <section className="bg-[#FBF7F0] px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-screen-xl">
            <div className="max-w-3xl">
              <p className="eyebrow text-[10px]">Professional headshot prompts</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">
                Popular AI headshot styles for work profiles
              </h2>
              <p className="mt-3 text-base leading-7 text-rsp-muted">
                Start with the default professional headshot prompt, or use these ideas when you want a more specific LinkedIn photo, corporate portrait, resume photo, or business profile picture.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {headshotPrompts.map((item, index) => (
                <article key={item.title} className="group flex overflow-hidden rounded-[30px] border border-rsp-border bg-white shadow-[0_18px_42px_rgba(46,32,18,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(46,32,18,0.11)]">
                  <div className="flex w-full flex-col">
                    <div className="relative m-3 overflow-hidden rounded-[24px] bg-[#EDE3D8]">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        width={1024}
                        height={1280}
                        loading={index < 3 ? "eager" : "lazy"}
                        className="aspect-[4/5] h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-rsp-text shadow-[0_8px_18px_rgba(46,32,18,0.12)]">
                        Example result
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/45 bg-[#1E1711]/72 p-3 text-white shadow-[0_14px_30px_rgba(30,23,17,0.22)] backdrop-blur">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#86EFAC]">Generated headshot style</p>
                        <p className="mt-1 text-sm font-semibold leading-5">{item.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rsp-terracotta">{item.keyword}</p>
                      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-rsp-text">{item.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-rsp-muted">{item.description}</p>
                      <Link href="#headshot-upload" className="mt-5 inline-flex w-fit rounded-full border border-rsp-border px-4 py-2 text-sm font-bold text-rsp-text no-underline transition hover:border-rsp-terracotta hover:text-rsp-terracotta">
                        Use this style ↑
                      </Link>
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
