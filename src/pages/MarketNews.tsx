import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Globe, Zap, AlertCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Env vars for APIs
const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const NEWSDATA_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
  imageUrl?: string;
  tag: string;
}

const mockArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cuts by Year-End Amid Cooling Inflation Data",
    summary: "The latest core PCE data suggests inflation is finally reaching the Fed's 2% target, prompting markets to price in up to 50 bps in rate cuts.",
    source: "Macro Insights",
    time: "2 hours ago",
    url: "#",
    tag: "MACRO"
  },
  {
    id: "2",
    title: "Tech Giants See Massive Inflows Following AI Infrastructure Earnings Reports",
    summary: "Semiconductor and cloud service providers posted double-digit revenue growth, driving the Nasdaq to new all-time highs.",
    source: "Tech Finance Daily",
    time: "4 hours ago",
    url: "#",
    tag: "EQUITY"
  }
];

export default function MarketNews() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog State
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    async function fetchNews() {
      if (!ALPHA_VANTAGE_KEY && !NEWSDATA_KEY) return;
      
      setLoading(true);
      setError(null);
      try {
        const fetchedArticles: NewsArticle[] = [];

        // 1. Fetch Alpha Vantage News
        if (ALPHA_VANTAGE_KEY) {
          try {
            const alphaRes = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${ALPHA_VANTAGE_KEY}`);
            if (alphaRes.ok) {
              const alphaData = await alphaRes.json();
              if (alphaData.feed) {
                const mapped = alphaData.feed.slice(0, 5).map((item: any, i: number) => ({
                  id: `av-${i}`,
                  title: item.title,
                  summary: item.summary,
                  source: item.source || "Alpha Vantage",
                  time: item.time_published ? new Date(
                    item.time_published.substring(0, 4) + '-' + 
                    item.time_published.substring(4, 6) + '-' + 
                    item.time_published.substring(6, 11) + ':' + 
                    item.time_published.substring(11, 13) + ':' + 
                    item.time_published.substring(13, 15)
                  ).toLocaleDateString() : "Recent",
                  url: item.url,
                  imageUrl: item.banner_image,
                  tag: "FINANCE"
                }));
                fetchedArticles.push(...mapped);
              }
            }
          } catch (e) {
            console.warn("Failed to fetch Alpha Vantage data", e);
          }
        }

        // 2. Fetch NewsData.io
        if (NEWSDATA_KEY) {
          try {
            const ndRes = await fetch(`https://newsdata.io/api/1/latest?apikey=${NEWSDATA_KEY}&category=business&language=en`);
            if (ndRes.ok) {
              const ndData = await ndRes.json();
              if (ndData.results) {
                const mapped = ndData.results.slice(0, 5).map((item: any, i: number) => ({
                  id: `nd-${i}`,
                  title: item.title,
                  summary: item.description || item.content || "No summary available.",
                  source: item.source_id || "NewsData.io",
                  time: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Recent",
                  url: item.link,
                  imageUrl: item.image_url,
                  tag: item.category?.[0]?.toUpperCase() || "NEWS"
                }));
                fetchedArticles.push(...mapped);
              }
            }
          } catch (e) {
            console.warn("Failed to fetch NewsData.io data", e);
          }
        }

        if (fetchedArticles.length > 0) {
          // Shuffle slightly to mix sources if both are present
          setArticles(fetchedArticles.sort(() => 0.5 - Math.random()));
        } else {
          setError("No articles found from the APIs, or rate limit reached.");
        }
      } catch (e) {
        setError("Failed to fetch live news.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-premium border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold gradient-text-amber hover:brightness-125 transition-all text-premium">Ratio x</Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-amber transition-colors"
            >
              Drift Engine
            </Link>
            <Link 
              to="/news" 
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-background hover:brightness-110 transition-premium border border-amber/20 bg-amber px-4 py-1.5 rounded-[4px] font-semibold shadow-glow-amber"
            >
              Market News
            </Link>
            <span className="text-xs text-muted-foreground font-body hidden sm:block text-premium">{user?.email}</span>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors text-premium"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 relative">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-amber transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground heading-premium tracking-tight leading-[1.1] mb-6">
            Global Market <br /> Intelligence.
          </h1>
          
          <p className="font-body text-lg text-muted-foreground max-w-2xl leading-relaxed text-premium">
            Real-time macroeconomic updates and financial news to inform your rebalancing strategy. Curated insights without the noise.
          </p>
        </div>

        {/* API Key Notice */}
        {(!ALPHA_VANTAGE_KEY && !NEWSDATA_KEY) && (
          <div className="mb-12 p-4 rounded-lg bg-surface border border-surface-border flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-foreground font-medium mb-1">API Integration Pending</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                You are currently viewing mock data. Add your API keys to the <code className="bg-background px-1.5 py-0.5 rounded border border-surface-border font-mono text-[11px] text-amber">.env</code> file under <code className="bg-background px-1.5 py-0.5 rounded border border-surface-border font-mono text-[11px] text-amber">VITE_ALPHA_VANTAGE_API_KEY</code> and <code className="bg-background px-1.5 py-0.5 rounded border border-surface-border font-mono text-[11px] text-amber">VITE_NEWSDATA_API_KEY</code> to enable live news.
              </p>
            </div>
          </div>
        )}

        {/* News Feed */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber" />
              <h2 className="font-display text-xl font-semibold text-foreground tracking-wide">Latest Headlines</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-amber/70 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber/70 animate-pulse" />
              )}
              Live Feed
            </div>
          </div>
          
          {error && <p className="text-sm text-drift-red font-body">{error}</p>}

          {/* Magazine Grid Layout */}
          {articles.length > 0 ? (
            <div className="flex flex-col gap-12">
              
              {/* Top Section: Hero + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Hero Article (Left, spans 8 cols) */}
                {articles[0] && (
                  <div className="lg:col-span-8 group cursor-pointer relative overflow-hidden rounded-[16px] border border-surface-border/50 shadow-2xl bg-card/20" onClick={() => setSelectedArticle(articles[0])}>
                    <div className="w-full h-[400px] md:h-[550px] relative">
                      {articles[0].imageUrl ? (
                        <img src={articles[0].imageUrl} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-border/20">
                           <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-mono text-amber uppercase tracking-widest border border-amber/30 bg-amber/20 backdrop-blur-md px-2.5 py-1 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                          {articles[0].tag}
                        </span>
                        <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest drop-shadow-md">
                          {articles[0].source} • {articles[0].time}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl md:text-5xl font-medium text-white group-hover:text-amber transition-colors duration-300 leading-[1.1] tracking-tight drop-shadow-2xl">
                        {articles[0].title}
                      </h3>
                      <p className="font-body text-base text-white/80 mt-5 line-clamp-2 drop-shadow-md hidden md:block max-w-3xl font-light">
                        {articles[0].summary}
                      </p>
                    </div>
                    {/* Subtle inner shadow overlay */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[16px] pointer-events-none" />
                  </div>
                )}

                {/* Sidebar Articles (Right, spans 4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2 pb-4 border-b border-surface-border/50">
                    <div className="w-1.5 h-1.5 bg-amber rounded-full shadow-glow-amber" />
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-semibold">Top Stories</h3>
                  </div>
                  
                  <div className="flex flex-col">
                    {articles.slice(1, 5).map((article) => (
                      <article 
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="group py-5 border-b border-surface-border/30 last:border-0 hover:bg-card/10 px-4 -mx-4 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[9px] font-mono text-amber/80 uppercase tracking-widest bg-amber/5 border border-amber/10 px-1.5 py-0.5 rounded-sm">
                            {article.tag}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-widest">
                            {article.time}
                          </span>
                        </div>
                        <h4 className="font-display text-xl font-medium text-foreground/95 group-hover:text-amber transition-colors leading-[1.25] tracking-tight">
                          {article.title}
                        </h4>
                      </article>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Grid (Remaining Articles) */}
              {articles.length > 5 && (
                <div className="pt-10 border-t border-surface-border/30">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 bg-amber rounded-full shadow-glow-amber" />
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-semibold">More News</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.slice(5).map((article) => (
                      <article 
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="group cursor-pointer flex flex-col gap-5 hover:bg-card/10 p-4 -mx-4 rounded-xl transition-colors"
                      >
                        <div className="w-full h-56 rounded-xl bg-surface-border/20 overflow-hidden relative shadow-lg border border-surface-border/30">
                          {article.imageUrl ? (
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-border/10">
                               <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[9px] font-mono text-amber/80 uppercase tracking-widest bg-amber/5 border border-amber/10 px-1.5 py-0.5 rounded-sm">
                              {article.tag}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-widest">
                              {article.source}
                            </span>
                          </div>
                          <h4 className="font-display text-2xl font-medium text-foreground/95 group-hover:text-amber transition-colors leading-[1.2] mb-3 tracking-tight">
                            {article.title}
                          </h4>
                          <p className="font-body text-sm text-muted-foreground/80 line-clamp-2 font-light">
                            {article.summary}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            !loading && !error && <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">No articles found.</p>
          )}
        </div>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl bg-[#0a0a0a] border-surface-border/50 shadow-2xl p-0 overflow-hidden rounded-xl">
          <ScrollArea className="max-h-[85vh]">
            {selectedArticle?.imageUrl && (
              <div className="w-full h-64 bg-surface-border/30 relative">
                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>
            )}
            
            <div className={`p-8 ${!selectedArticle?.imageUrl ? 'pt-10' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono text-amber/80 uppercase tracking-widest border border-amber/20 bg-amber/5 px-2 py-0.5 rounded">
                  {selectedArticle?.tag}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {selectedArticle?.source} • {selectedArticle?.time}
                </span>
              </div>
              
              <DialogHeader>
                <DialogTitle className="font-display text-3xl font-medium text-foreground leading-tight mb-4">
                  {selectedArticle?.title}
                </DialogTitle>
                <DialogDescription className="font-body text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedArticle?.summary}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 pt-6 border-t border-surface-border">
                <a 
                  href={selectedArticle?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-background hover:brightness-110 transition-premium border border-amber/20 bg-amber px-6 py-3 rounded-md font-semibold shadow-glow-amber"
                >
                  Read Full Article <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Disclaimer />
    </div>
  );
}
