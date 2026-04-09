export type PriceData = {
  symbol: string;
  price: number;
  lastUpdated: Date;
  source: 'amfi' | 'yahoo' | 'manual';
};

// Use Vite proxy in development, fallback to a public CORS proxy in production.
const YAHOO_BASE_URL = import.meta.env?.PROD 
  ? 'https://corsproxy.io/?https://query1.finance.yahoo.com'
  : '/api/yahoo';

export type SearchResult = {
  symbol: string;   // NSE ticker without .NS
  name: string;
  exchange: string;
  type: string;
  price?: number;
};

// Price cache with 60-second TTL
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

function getCachedPrice(symbol: string): number | null {
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }
  return null;
}

function setCachedPrice(symbol: string, price: number): void {
  priceCache.set(symbol, { price, timestamp: Date.now() });
}

// AMFI MF NAV — free, no auth
export async function fetchMFNav(schemeCode: string): Promise<PriceData | null> {
  // Check cache first
  const cachedPrice = getCachedPrice(`mf_${schemeCode}`);
  if (cachedPrice !== null) {
    return { symbol: schemeCode, price: cachedPrice, lastUpdated: new Date(), source: 'amfi' };
  }

  try {
    const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}/latest`);
    if (!res.ok) return null;
    const data = await res.json();
    const nav = parseFloat(data.data?.[0]?.nav);
    if (isNaN(nav)) return null;
    
    // Cache the price
    setCachedPrice(`mf_${schemeCode}`, nav);
    
    return { symbol: schemeCode, price: nav, lastUpdated: new Date(), source: 'amfi' };
  } catch { return null; }
}

interface MFSearchResult {
  schemeCode: number;
  schemeName: string;
}

export async function searchMutualFunds(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as MFSearchResult[];
    return data.slice(0, 5).map((f) => ({
      symbol: String(f.schemeCode),
      name: f.schemeName || "",
      exchange: 'AMFI',
      type: 'mf',
    }));
  } catch { return []; }
}

// Yahoo Finance for equities/ETFs/REITs — NSE suffix, no API key
export async function fetchYahooPrice(symbol: string): Promise<PriceData | null> {
  // Check cache first
  const cachedPrice = getCachedPrice(`yahoo_${symbol}`);
  if (cachedPrice !== null) {
    return { symbol, price: cachedPrice, lastUpdated: new Date(), source: 'yahoo' };
  }

  try {
    const ticker = `${symbol}.NS`;
    const res = await fetch(
      `${YAHOO_BASE_URL}/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (!price || isNaN(price)) return null;
    
    // Cache the price
    setCachedPrice(`yahoo_${symbol}`, price);
    
    return { symbol, price, lastUpdated: new Date(), source: 'yahoo' };
  } catch { return null; }
}

interface YahooQuote {
  symbol: string;
  longname?: string;
  shortname?: string;
  exchange: string;
  quoteType?: string;
}

// Search Universal Instruments (Yahoo Finance + AMFI)
export async function searchAllInstruments(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];
  try {
    // Run both searches in parallel
    const [yahooRes, mfResults] = await Promise.all([
      fetch(
        `${YAHOO_BASE_URL}/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=IN&quotesCount=8&newsCount=0&enableFuzzyQuery=true`,
        { headers: { 'Accept': 'application/json' } }
      ).catch(() => null),
      searchMutualFunds(query).catch(() => [])
    ]);

    let yahooQuotes: SearchResult[] = [];
    if (yahooRes && yahooRes.ok) {
      const json = await yahooRes.json();
      const quotes: YahooQuote[] = json?.quotes || [];
      
      const filteredQuotes = quotes
        .filter((q) =>
          q.exchange === 'NSI' ||
          q.exchange === 'NSE' ||
          (q.symbol && q.symbol.endsWith('.NS')) ||
          q.exchange === 'BSE' ||
          (q.symbol && q.symbol.endsWith('.BO'))
        )
        .slice(0, 5)
        .map((q) => ({
          symbol: (q.symbol || '').replace('.NS', '').replace('.BO', ''),
          name: q.longname || q.shortname || q.symbol || '',
          exchange: q.exchange === 'BSE' || (q.symbol && q.symbol.endsWith('.BO')) ? 'BSE' : 'NSE',
          type: (q.quoteType || 'equity').toLowerCase() === 'etf' ? 'etf' : 
                (q.quoteType || 'equity').toLowerCase() === 'mutualfund' ? 'mf' : 'equity',
        }));
      
      yahooQuotes = filteredQuotes;
    }

    // Attempt to enrich Yahoo quotes with live prices
    if (yahooQuotes.length > 0) {
      yahooQuotes = await Promise.all(
        yahooQuotes.map(async (q) => {
          const priceData = await fetchYahooPrice(q.symbol);
          return { ...q, price: priceData?.price };
        })
      );
    }

    // Combine both results
    return [...yahooQuotes, ...mfResults];
  } catch { return []; }
}

// Batch refresh with proper error handling and fallback logic
export async function refreshPrices(
  holdings: { symbol: string; instrument_type: string; avg_buy_price: number }[]
): Promise<{ prices: Record<string, number>; failedSymbols: string[] }> {
  const prices: Record<string, number> = {};
  const failedSymbols: string[] = [];

  await Promise.all(
    holdings.map(async (h) => {
      try {
        let priceData: PriceData | null = null;
        
        if (['mf', 'mutual_fund'].includes(h.instrument_type)) {
          priceData = await fetchMFNav(h.symbol);
        } else {
          priceData = await fetchYahooPrice(h.symbol);
        }
        
        if (priceData) {
          prices[h.symbol] = priceData.price;
        } else {
          // Fallback to avg_buy_price but mark as failed
          prices[h.symbol] = h.avg_buy_price;
          failedSymbols.push(h.symbol);
        }
      } catch (error) {
        // Fallback to avg_buy_price but mark as failed
        prices[h.symbol] = h.avg_buy_price;
        failedSymbols.push(h.symbol);
      }
    })
  );

  return { prices, failedSymbols };
}
