import { getCloudflareContext } from "@opennextjs/cloudflare";

export type BackendEnv = {
  BILLING_KV?: KVNamespace;
  DB?: D1Database;
  R2_ASSETS?: R2Bucket;
};

export async function backendEnv(): Promise<BackendEnv> {
  try {
    const context = await getCloudflareContext({ async: true });
    return context.env as BackendEnv;
  } catch {
    return {};
  }
}

export async function billingDb() {
  return (await backendEnv()).DB || null;
}

export async function billingKv() {
  return (await backendEnv()).BILLING_KV || null;
}

export async function assetsBucket() {
  return (await backendEnv()).R2_ASSETS || null;
}
