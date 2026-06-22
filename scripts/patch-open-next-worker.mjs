import { readFile, writeFile } from "node:fs/promises";

const workerPath = ".open-next/worker.js";
const marker = "async scheduled(controller, env, ctx)";
let source = await readFile(workerPath, "utf8");

if (source.includes(marker)) {
  console.log("OpenNext worker already has refund reconciliation scheduled handler.");
  process.exit(0);
}

const needle = "    },\n};\n";
const scheduledHandler = `    },
    async scheduled(controller, env, ctx) {
        const origin = env.NEXT_PUBLIC_SITE_URL || "https://aieditorrspediting.org";
        const secret = env.CRON_SECRET;
        if (!secret) {
            console.error("refund reconciliation skipped: CRON_SECRET is not configured");
            return;
        }
        const url = new URL("/api/billing/reconcile-refunds", origin);
        url.searchParams.set("limit", "50");
        ctx.waitUntil(this.fetch(new Request(url.toString(), {
            method: "POST",
            headers: {
                "x-cron-secret": secret,
                "user-agent": "cloudflare-cron/refund-reconciliation",
            },
        }), env, ctx).then(async (response) => {
            const text = await response.text();
            if (!response.ok) {
                console.error("refund reconciliation failed", response.status, text.slice(0, 500));
            } else {
                console.log("refund reconciliation completed", text.slice(0, 500));
            }
        }).catch((error) => {
            console.error("refund reconciliation exception", error?.message || String(error));
        }));
    },
};
`;

if (!source.includes(needle)) {
  throw new Error(`Could not patch ${workerPath}: expected default export footer not found.`);
}

source = source.replace(needle, scheduledHandler);
await writeFile(workerPath, source);
console.log("Patched OpenNext worker with refund reconciliation scheduled handler.");
