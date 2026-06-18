export type SafetyCategory =
  | "sexual"
  | "minor_safety"
  | "graphic_violence"
  | "self_harm"
  | "hate_harassment"
  | "extremism"
  | "deception_fraud"
  | "impersonation_deepfake"
  | "rights_infringement";

export type SafetyDecision = "allow" | "review" | "block";
export type SafetySeverity = "low" | "medium" | "high" | "critical";

export type PromptSafetyResult = {
  decision: SafetyDecision;
  severity: SafetySeverity;
  categories: SafetyCategory[];
  reason?: string;
  message?: string;
};

type SafetyRule = {
  category: SafetyCategory;
  severity: SafetySeverity;
  decision: SafetyDecision;
  terms: RegExp[];
  reason: string;
};

const RULES: SafetyRule[] = [
  {
    category: "minor_safety",
    severity: "critical",
    decision: "block",
    reason: "minors in sexual or exploitative context",
    terms: [
      /\b(child|children|kid|kids|minor|teen|teenage|underage|young girl|young boy|schoolgirl|schoolboy)\b/i,
      /\b(sex|sexual|nude|naked|lingerie|erotic|porn|nsfw|seductive|strip|fetish)\b/i,
    ],
  },
  {
    category: "sexual",
    severity: "high",
    decision: "block",
    reason: "sexual or nude content",
    terms: [/\b(nsfw|porn|porno|erotic|explicit sex|nude|naked|topless|genitals?|breasts?|hentai|fetish|stripper|lingerie)\b/i],
  },
  {
    category: "graphic_violence",
    severity: "high",
    decision: "block",
    reason: "graphic violence or gore",
    terms: [/\b(gore|gory|bloodbath|dismember|decapitat|severed|mutilat|viscera|graphic wound|torture|massacre)\b/i],
  },
  {
    category: "self_harm",
    severity: "high",
    decision: "block",
    reason: "self-harm content",
    terms: [/\b(self[- ]?harm|suicide|kill myself|cutting myself|hang myself|overdose)\b/i],
  },
  {
    category: "hate_harassment",
    severity: "high",
    decision: "block",
    reason: "hate or targeted harassment",
    terms: [/\b(racial slur|hate symbol|nazi propaganda|dehumaniz(e|ing)|lynch|kkk|swastika)\b/i],
  },
  {
    category: "extremism",
    severity: "high",
    decision: "block",
    reason: "extremist or terrorist content",
    terms: [/\b(terrorist propaganda|isis poster|al[- ]?qaeda|bomb manifesto|extremist recruitment|jihad recruitment)\b/i],
  },
  {
    category: "deception_fraud",
    severity: "high",
    decision: "block",
    reason: "deception, fake documents, or scams",
    terms: [/\b(fake passport|fake id|counterfeit|forged document|phishing|scam ad|bank statement|driver'?s license|official certificate)\b/i],
  },
  {
    category: "impersonation_deepfake",
    severity: "high",
    decision: "block",
    reason: "impersonation or non-consensual deepfake risk",
    terms: [/\b(deepfake|non[- ]?consensual|impersonate|make .* look like .* celebrity|celebrity nude|real person naked)\b/i],
  },
  {
    category: "rights_infringement",
    severity: "medium",
    decision: "review",
    reason: "copyright, trademark, or publicity-rights risk",
    terms: [/\b(disney|pixar|marvel|pokemon|nintendo|star wars|mickey mouse|coca[- ]?cola|nike logo|apple logo|trademarked logo)\b/i],
  },
];

const REVIEW_MESSAGE = "This prompt may create safety, deception, or rights risk. Please remove sexual, violent, deceptive, impersonation, or rights-infringing details and try again.";
const BLOCK_MESSAGE = "We cannot help create this image. Please choose a different prompt that follows our content safety rules.";

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function highestSeverity(severities: SafetySeverity[]): SafetySeverity {
  if (severities.includes("critical")) return "critical";
  if (severities.includes("high")) return "high";
  if (severities.includes("medium")) return "medium";
  return "low";
}

export function checkPromptSafety(prompt: string): PromptSafetyResult {
  const text = prompt.normalize("NFKC");
  const matches = RULES.filter((rule) => rule.terms.every((term) => term.test(text)));
  if (!matches.length) {
    return { decision: "allow", severity: "low", categories: [] };
  }

  const hasBlock = matches.some((match) => match.decision === "block");
  const severity = highestSeverity(matches.map((match) => match.severity));
  const categories = unique(matches.map((match) => match.category));
  const reason = matches.map((match) => match.reason).join("; ");

  return {
    decision: hasBlock ? "block" : "review",
    severity,
    categories,
    reason,
    message: hasBlock ? BLOCK_MESSAGE : REVIEW_MESSAGE,
  };
}

export function safePromptInstruction() {
  return [
    "Safety requirements: do not create sexual content, nudity, minors in sexual contexts, gore, self-harm, hateful or extremist content, fake documents, scams, impersonation, non-consensual deepfakes, or trademark-infringing brand/logo misuse.",
    "If the user prompt implies prohibited content, produce a benign, non-explicit, non-violent, rights-safe alternative.",
  ].join(" ");
}

export function providerSafetyOptions() {
  return {
    enable_safety_checker: true,
    safety_checker: true,
    nsfw_filter: true,
  };
}

function hasUnsafeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.some(hasUnsafeBoolean);
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).some(hasUnsafeBoolean);
  return false;
}

export function checkOutputSafety(raw: unknown): PromptSafetyResult {
  const data = raw as Record<string, unknown> | null;
  if (!data || typeof data !== "object") return { decision: "allow", severity: "low", categories: [] };

  const flags = [
    data.has_nsfw_concepts,
    data.nsfw,
    data.is_nsfw,
    data.unsafe,
    data.safety_checker,
    data.safety,
    data.moderation,
  ];

  if (flags.some(hasUnsafeBoolean)) {
    return {
      decision: "block",
      severity: "high",
      categories: ["sexual"],
      reason: "provider returned unsafe or NSFW output metadata",
      message: "The generated output was blocked by our safety checks. Your credit has not been consumed for this blocked result.",
    };
  }

  return { decision: "allow", severity: "low", categories: [] };
}

export async function promptHash(prompt: string) {
  const bytes = new TextEncoder().encode(prompt.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

export function logSafetyEvent(event: {
  sid?: string;
  promptHash?: string;
  requestId?: string | null;
  provider?: string;
  category: SafetyCategory[];
  severity: SafetySeverity;
  decision: SafetyDecision;
  reason?: string;
  creditDecision: "not_charged" | "charged" | "refunded" | "unchanged";
}) {
  console.warn("ai_editor_rsp_safety_event", JSON.stringify({ ...event, timestamp: new Date().toISOString() }));
}
