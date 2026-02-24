import { Redis } from '@upstash/redis';
import { DEFAULT_MARKETS, MARKETS_KEY } from '../../lib/markets';

// Prevent Next.js from caching this route - ensures fresh data on every request
export const dynamic = 'force-dynamic';

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET() {
  try {
    let markets = await redis.get(MARKETS_KEY);

    // If no markets exist, seed with defaults
    if (!markets) {
      markets = DEFAULT_MARKETS;
      await redis.set(MARKETS_KEY, markets);
    }

    return Response.json(
      { markets },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching markets:', error);
    // Fallback to defaults if Redis is not configured
    return Response.json(
      { markets: DEFAULT_MARKETS, error: 'Redis not configured' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    const { markets } = await request.json();

    if (!Array.isArray(markets)) {
      return Response.json({ error: 'Invalid markets data' }, { status: 400 });
    }

    await redis.set(MARKETS_KEY, markets);

    return Response.json({ success: true, markets });
  } catch (error) {
    console.error('Error saving markets:', error);
    return Response.json({ error: 'Failed to save markets' }, { status: 500 });
  }
}
