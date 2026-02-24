import { Redis } from '@upstash/redis';

// Centralized Redis client for Upstash, reused across the app
// Prefer the Upstash quickstart STORAGE_* env vars, but keep backwards compatibility.
const redisUrl =
  process.env.STORAGE_KV_REST_API_URL || // Upstash quickstart / Vercel Storage
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL;

const redisToken =
  process.env.STORAGE_KV_REST_API_TOKEN || // Upstash quickstart / Vercel Storage
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN;

// In dev, reuse a single client instance across HMR reloads
const globalForRedis = globalThis;

let redisInstance = null;

if (!redisUrl || !redisToken) {
  // Log once if Redis is misconfigured so we can debug env issues quickly
  console.warn(
    'Upstash Redis is not fully configured. Missing URL or token environment variables.'
  );
} else {
  // Create (or reuse) a single Redis client instance
  redisInstance =
    globalForRedis._cigRedis ||
    new Redis({
      url: redisUrl,
      token: redisToken,
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForRedis._cigRedis = redisInstance;
  }
}

export const redis = redisInstance;

