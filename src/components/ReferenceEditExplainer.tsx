import Link from "next/link";

const steps = [
  {
    title: "Upload the original",
    body: "Start with the image you want to keep: a product photo, portrait, interior shot, or creator asset.",
  },
  {
    title: "Describe only the edit",
    body: "Ask for a background change, lighting adjustment, object removal, cleanup, or style shift without rewriting the whole image.",
  },
  {
    title: "Compare before and after",
    body: "Use the slider to check what changed, what stayed consistent, and whether the edit is safe to export.",
  },
];

const useCases = ["Product background replacement", "Portrait lighting and style edits", "Social image cleanup", "Interior and object refinements"];

type ReferenceEditExplainerProps = {
  compact?: boolean;
};

export default function ReferenceEditExplainer({ compact = false }: ReferenceEditExplainerProps) {
  return (
    <section className={compact ? "section-pad bg-rsp-surface" : "section-pad"}>
      <div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="eyebrow">Reference Edit</p>
          <h2 className="mt-3 max-w-3xl font-heading text-4xl font-normal leading-[1.02] tracking-[-0.04em] text-rsp-text md:text-6xl">
            Edit an uploaded image, not a blank prompt.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">
            Reference Edit is for users who already have an image and want AI to change specific parts while keeping the subject, composition, and visual identity recognizable.
          </p>
          <div className="mt-7 grid gap-3">
            {steps.map((step, index) => (
              <div key={step.title} className="glass-card flex gap-4 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rsp-primary font-mono text-sm font-bold text-rsp-on-primary">0{index + 1}</span>
                <div>
                  <h3 className="font-heading text-xl font-normal tracking-[-0.02em] text-rsp-text">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-rsp-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {useCases.map((item) => (
              <span key={item} className="chip-active">{item}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/reference-edit" className="rsp-button px-5 py-3 text-sm">Open Reference Edit</Link>
            <Link href="/#generator" className="rsp-button-secondary px-5 py-3 text-sm">Try on homepage</Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-rsp-border bg-[#15110C] p-3 shadow-[0_24px_80px_rgba(46,32,18,0.2)] md:p-5">
          <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#86EFAC]">Before</p>
              <p className="mt-2 font-semibold">Your uploaded image</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#86EFAC]">Prompt</p>
              <p className="mt-2 font-semibold">Change only what you describe</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#86EFAC]">After</p>
              <p className="mt-2 font-semibold">AI edited result</p>
            </div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[26px] bg-[#241B13]">
            <img src="/images/generated/lofi-girl-vibes.webp" alt="Reference edit before and after comparison example" className="absolute inset-0 h-full w-full object-cover opacity-70 blur-[1.5px] saturate-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute inset-0 overflow-hidden [clip-path:inset(0_0_0_52%)]">
              <img src="/images/generated/lofi-girl-vibes.webp" alt="AI edited result example" className="h-full w-full object-cover brightness-105 contrast-110 saturate-125" />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white">Before · upload</span>
            <span className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white">After · AI edit</span>
            <div className="absolute inset-y-0 left-[52%] w-px bg-white/85 shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
            <div className="absolute left-[52%] top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl">↔</div>
            <div className="absolute bottom-4 right-4 rounded-2xl border border-white/10 bg-black/60 p-3 text-sm font-semibold text-white/85">Drag to verify the edit</div>
          </div>
          <p className="mt-4 rounded-2xl border border-[#86EFAC]/25 bg-[#86EFAC]/10 p-4 text-sm leading-6 text-[#D8FFE7]">
            Use this when consistency matters. Create from prompt makes a new image; Reference Edit keeps your uploaded image as the visual anchor.
          </p>
        </div>
      </div>
    </section>
  );
}
