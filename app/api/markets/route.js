import { Redis } from '@upstash/redis';
import { DEFAULT_MARKETS, MARKETS_KEY } from '../../lib/markets';

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

    return Response.json({ markets });
  } catch (error) {
    console.error('Error fetching markets:', error);
    // Fallback to defaults if Redis is not configured
    return Response.json({ markets: DEFAULT_MARKETS, error: 'Redis not configured' });
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
