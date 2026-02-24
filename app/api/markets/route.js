import { DEFAULT_MARKETS, MARKETS_KEY } from '../../lib/markets';
import { redis } from '../../lib/redis';

// Prevent Next.js from caching this route - ensures fresh data on every request
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // If Redis is not configured, fall back to in-memory defaults
    if (!redis) {
      console.warn('GET /api/markets called without a configured Redis client.');
      return Response.json(
        { markets: DEFAULT_MARKETS, error: 'Redis not configured' },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    const cached = await redis.get(MARKETS_KEY);
    let markets;

    if (!cached) {
      // Seed Redis with the default markets when no data exists yet
      markets = DEFAULT_MARKETS;
      await redis.set(MARKETS_KEY, JSON.stringify(markets));
    } else if (typeof cached === 'string') {
      // Handle explicit JSON string storage
      markets = JSON.parse(cached);
    } else if (Array.isArray(cached)) {
      // Handle automatic JSON deserialization from the client
      markets = cached;
    } else {
      console.warn('Unexpected markets value in Redis, falling back to defaults.');
      markets = DEFAULT_MARKETS;
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
    if (!redis) {
      console.error('POST /api/markets called without a configured Redis client.');
      return Response.json(
        { error: 'Redis not configured' },
        { status: 500 }
      );
    }

    const { markets } = await request.json();

    if (!Array.isArray(markets)) {
      return Response.json({ error: 'Invalid markets data' }, { status: 400 });
    }

    // Store markets as a JSON string for consistent read/write behavior
    await redis.set(MARKETS_KEY, JSON.stringify(markets));

    return Response.json({ success: true, markets });
  } catch (error) {
    console.error('Error saving markets:', error);
    return Response.json({ error: 'Failed to save markets' }, { status: 500 });
  }
}
