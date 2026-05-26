import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { createServerFn } from "@tanstack/react-start";
import {
  ArrowRight, Zap, Gauge, Stethoscope, Check, Star, Menu, X,
  FileCode, FileText, Image as ImageIcon, Video, Newspaper, Rss, Smartphone, Globe,
  ShieldCheck, Bot, Network, ChevronDown, Sparkles, CheckCircle2, Clock, Plus,
  Loader2, Link as LinkIcon, AlertCircle, Award, Users, TrendingUp, Server, Search, Download, Map, Shield,
  Layers, Cloud, BarChart3, HelpCircle, ExternalLink, Github, Twitter, Linkedin, Facebook, FlaskConical, Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { generateSitemapXml } from "../lib/sitemap";


// ============================================
// SERVER FUNCTIONS - Optimized Backend
// ============================================

const fetchPageHtml = createServerFn({ method: "GET" }).handler(async ({ data: { url, useJS } }: { data: { url: string, useJS: boolean } }) => {
  const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  try {
    const cheerioModule = await import('cheerio');
    const cheerio = (cheerioModule as any).default || cheerioModule;
    
    let html = '';
    let status = 200;
    let isJSRendered = false;

    // STRATEGY 1: Standard fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout max
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        redirect: 'follow',
        signal: controller.signal as any
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        html = await response.text();
        status = response.status;
      }
    } catch (err) {
      console.log(`Standard fetch failed for ${url}`);
    }

    // STRATEGY 2: Puppeteer for JS-heavy sites
    // Disabled automatic JS fallback for maximum speed unless explicitly requested
    if (useJS) {
      try {
        const puppeteer = await import('puppeteer-core');
        let chromePath = process.platform === 'win32' 
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'darwin'
            ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : '/usr/bin/google-chrome';

        const browser = await puppeteer.launch({
          executablePath: chromePath,
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        html = await page.content();
        await browser.close();
        isJSRendered = true;
      } catch (err) {
        console.error("Puppeteer failed:", err);
      }
    }

    if (!html) return { error: `Could not retrieve content`, links: [], images: [], metadata: null };
    
    const $ = cheerio.load(html);
    const links: string[] = [];
    const images: { loc: string; caption: string; title: string }[] = [];
    
    // Link Extraction
    $('a[href]').each((_, el: any) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith("#") && !href.startsWith("javascript:") && 
          !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        try {
          const absolute = new URL(href, url).toString();
          links.push(absolute);
        } catch {}
      }
    });
    
    // Image Extraction
    $('img').each((_, el: any) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src) {
        try {
          images.push({
            loc: src.startsWith('http') ? src : new URL(src, url).toString(),
            caption: $(el).attr('alt') || "",
            title: $(el).attr('title') || ""
          });
        } catch {}
      }
    });

    const metadata = {
      title: $('title').text() || "No Title",
      description: $('meta[name="description"]').attr('content') || "",
      h1Count: $('h1').length,
      wordCount: $.text().split(/\s+/).length,
      isJSRendered
    };
    
    return { links: [...new Set(links)], images, metadata, status, error: null };
  } catch (err: any) {
    return { error: err.message || "Fetch failed", links: [], images: [], metadata: null };
  }
});



const checkRobotsTxt = createServerFn({ method: "GET" }).handler(async ({ data: url }: { data: string }) => {
  try {
    const parsed = new URL(url);
    const robotsUrl = `${parsed.origin}/robots.txt`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: controller.signal as any
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const content = await response.text();
      const disallows: string[] = [];
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.toLowerCase().startsWith('disallow:')) {
          const path = line.substring(9).trim();
          if (path && path !== '/') {
            disallows.push(path);
          }
        }
      }
      return { exists: true, disallows, content };
    }
    return { exists: false, disallows: [], content: null };
  } catch {
    return { exists: false, disallows: [], content: null };
  }
});

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "XML Sitemap Generator - Create Free Sitemaps Online" },
      { name: "description", content: "Generate search-engine ready XML, Image, Video, and HTML sitemaps instantly. Free for up to 500 URLs. Improve your SEO and Google Indexing today." },
      { name: "keywords", content: "xml sitemap generator, create xml sitemap, free sitemap generator, google sitemap, seo tools, visual sitemap, sitemap creator, indexing tool" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "author", content: "Sitemap Generator Pro" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Sitemap Generator Pro" },
      { property: "og:title", content: "XML Sitemap Generator - Create Free Sitemaps Online" },
      { property: "og:description", content: "Generate search-engine ready XML, Image, Video, and HTML sitemaps instantly. Free for up to 500 URLs." },
      { property: "og:url", content: "https://mysitemapgenerator.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "XML Sitemap Generator - Create Free Sitemaps Online" },
      { name: "twitter:description", content: "Generate search-engine ready XML, Image, Video, and HTML sitemaps instantly." },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "#00748b" }
    ],
    links: [
      { rel: "canonical", href: "https://mysitemapgenerator.com/" },
    ]
  }),
});

// ============================================
// COMPONENTS
// ============================================



function TerminalLog({ logs }: { logs: any[] }) {
  return (
    <div className="bg-black/80 rounded-3xl p-8 font-mono text-[13px] border border-blue-500/30 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-4">PRO Engine v2.5 Terminal</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Live Discovery</span>
        </div>
      </div>
      <div className="space-y-2 h-[350px] overflow-y-auto custom-scrollbar pr-4">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-600 shrink-0 select-none">[{new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
            <span className={`${
              log.type === 'error' ? 'text-rose-400' :
              log.type === 'success' ? 'text-emerald-400' :
              log.type === 'warning' ? 'text-amber-400' :
              'text-blue-400'
            } font-medium`}>
              {log.msg}
            </span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-slate-700 italic">Waiting for process initialization...</div>}
      </div>
    </div>
  );
}

function XMLPreview({ xml }: { xml: string }) {
  return (
    <div className="bg-[#0a0a0f] rounded-3xl p-8 border border-blue-500/20 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-line opacity-20"></div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FileCode className="w-5 h-5 text-blue-500" />
          <h3 className="text-blue-500 font-black uppercase tracking-widest text-xs">Sitemap.xml Preview</h3>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(xml);
              toast.success("XML Copied!");
            }}
            className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl transition-all"
          >
            Copy
          </button>
        </div>
      </div>
      <div className="bg-black/50 rounded-2xl p-6 overflow-auto max-h-[400px] font-mono text-[11px] text-slate-400 leading-relaxed border border-white/5">
        <pre className="whitespace-pre-wrap break-all">{xml}</pre>
      </div>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left font-bold text-slate-800 hover:text-[#00748b] transition-colors">
        {question}
        <ChevronDown className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4 text-slate-600 leading-relaxed text-[15px] animate-in fade-in slide-in-from-top-2">
          {answer}
        </div>
      )}
    </div>
  );
}



// ============================================
// MAIN COMPONENT
// ============================================
function Index() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "completed" | "error" | "details">("idle");
  const [progress, setProgress] = useState(0);
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'error' | 'pending'}[]>([]);
  const [robotsData, setRobotsData] = useState<{exists: boolean, disallows: string[]} | null>(null);
  const [stats, setStats] = useState({ pages: 0, images: 0, time: 0, h1Count: 0, wordCount: 0, skipped: 0 });
  
  const [settings, setSettings] = useState({
    maxPages: 500,
    maxDepth: 3,
    changefreq: "weekly",
    priority: "0.8",
    useJS: false,
  });
  
  const [xmlPreview, setXmlPreview] = useState("");
  const isScanning = useRef(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = url.trim();
    if (!targetUrl) return;
    if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;
    
    if (isScanning.current) return;
    isScanning.current = true;
    
    setStatus("scanning");
    setProgress(0);
    setDiscoveredUrls([]);
    setLogs([{ msg: "🚀 Initializing Crawler...", type: 'info' }]);
    setStats({ pages: 0, images: 0, time: 0, h1Count: 0, wordCount: 0, skipped: 0 });
    
    try {
      const robots = await checkRobotsTxt({ data: targetUrl });
      setRobotsData(robots);
      
      const startTime = Date.now();
      const foundUrls = new Set<string>();
      const queue: {url: string, depth: number}[] = [{url: targetUrl, depth: 0}];
      const domain = new URL(targetUrl).hostname;
      
      const MAX_CONCURRENCY = 25;
      let activePromises = 0;
      let skippedCount = 0;
      const discoveredSet = new Set<string>();

      const processNext = async () => {
        if (!isScanning.current || foundUrls.size >= settings.maxPages || queue.length === 0) return;
        
        const {url: currentUrl, depth: currentDepth} = queue.shift()!;
        if (foundUrls.has(currentUrl)) return;

        foundUrls.add(currentUrl);
        setLogs(prev => [...prev.slice(-9), { msg: `→ Scanning: ${currentUrl}`, type: 'pending' }]);
        
        activePromises++;
        try {
          const result = await fetchPageHtml({ data: { url: currentUrl, useJS: settings.useJS } });
          
          if (!result.error) {
            setDiscoveredUrls([...foundUrls]);
            
            if (currentDepth < settings.maxDepth) {
              for (const link of (result.links || [])) {
                try {
                  const u = new URL(link, currentUrl);
                  u.hash = '';
                  const clean = u.href.replace(/\/$/, '');
                  
                  if (!discoveredSet.has(clean)) {
                    discoveredSet.add(clean);
                    const isSameDomain = u.hostname === domain || u.hostname === `www.${domain}` || `www.${u.hostname}` === domain;
                    
                    if (isSameDomain) {
                      if (clean.match(/\.(pdf|jpg|jpeg|png|gif|zip|exe|dmg|iso|mp4|css|js)$/i)) {
                        skippedCount++;
                      } else if (!foundUrls.has(clean)) {
                        queue.push({url: clean, depth: currentDepth + 1});
                      }
                    } else {
                      skippedCount++;
                    }
                  }
                } catch {}
              }
            }

            setStats(prev => ({ 
              ...prev, 
              pages: foundUrls.size,
              skipped: skippedCount,
              images: prev.images + (result.images?.length || 0),
            }));
            
            const totalKnown = foundUrls.size + queue.length;
            const calculatedProgress = totalKnown === 0 ? 0 : (foundUrls.size / totalKnown) * 100;
            setProgress(prev => Math.max(prev, Math.min(calculatedProgress, 99)));
          }
        } catch (err: any) {
          console.error("Crawl error:", err);
        } finally {
          activePromises--;
        }
      };

      while (isScanning.current && foundUrls.size < settings.maxPages && (queue.length > 0 || activePromises > 0)) {
        if (queue.length > 0 && activePromises < MAX_CONCURRENCY) {
          processNext();
        } else {
          await new Promise(r => setTimeout(r, 50));
        }
      }

      setStats(prev => ({ ...prev, time: (Date.now() - startTime) / 1000 }));
      setStatus("completed");
      
      const xml = generateSitemapXml([...foundUrls].map(u => ({ 
        loc: u, 
        lastmod: new Date().toISOString().split('T')[0], 
        changefreq: settings.changefreq, 
        priority: settings.priority 
      })));
      setXmlPreview(xml);
      
    } catch (err: any) {
      setStatus("error");
    } finally {
      isScanning.current = false;
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xmlPreview], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sitemap.xml`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-800 font-sans selection:bg-[#00748b]/20 relative overflow-hidden">
      {/* Premium Background Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00748b]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-[#00b87c]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="relative">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none -z-10"></div>
        
        <section className="px-6 max-w-5xl mx-auto pt-12 pb-16 text-center min-h-[400px]">
          
          {status === "idle" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-5 tracking-tight bricolage-grotesque-main">
                Generate a Sitemap for Your Website
              </h1>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed text-[17px] lato-regular">
                Create XML, HTML, or Visual sitemaps to help search engines crawl your site, improve navigation for users, and plan your website structure.
              </p>
              <p className="text-slate-500 mb-6 font-medium text-sm">
                Enter your website’s root URL and choose a sitemap format to continue:
              </p>
              
              <form onSubmit={handleGenerate} className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col md:flex-row items-center p-2 mb-8">
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b border-slate-200 md:border-b-0">
                  <Globe className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https:// Website URL"
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                  />
                </div>
                <div className="w-[1px] h-8 bg-slate-200 hidden md:block mx-2"></div>
                <div className="w-full md:w-48 px-2 py-2 md:py-0 border-b border-slate-200 md:border-b-0 flex items-center">
                  <select className="bg-transparent text-slate-700 font-bold outline-none w-full cursor-pointer appearance-none">
                    <option>XML Sitemap</option>
                    <option>HTML Sitemap</option>
                    <option>Visual Sitemap</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <button 
                  type="submit"
                  disabled={!url.trim()}
                  className="w-full md:w-auto mt-4 md:mt-0 bg-[#00748b] hover:bg-[#006074] text-white px-8 py-3.5 rounded-md text-[15px] font-bold transition-all disabled:opacity-50 whitespace-nowrap shadow-[0_4px_14px_0_rgba(0,116,139,0.39)] hover:shadow-[0_6px_20px_rgba(0,116,139,0.23)] hover:-translate-y-0.5 rubik-main"
                >
                  Start creating
                </button>
              </form>
              <p className="text-slate-500 text-[13px] mb-12 font-medium">Start generating in seconds.</p>
              
              <div className="flex justify-center gap-4 mb-8">
                <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm">Open generator</button>
                <button className="bg-[#f0f8ff] text-[#00748b] px-6 py-2.5 rounded font-bold hover:bg-[#e1f0fa] transition-colors shadow-sm text-sm">Discover plans</button>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto text-left">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                   <div className="w-12 h-12 rounded-xl bg-[#f0f8ff] flex items-center justify-center text-[#00748b] mb-6"><Network className="w-6 h-6" /></div>
                   <h4 className="font-bold text-slate-800 mb-3 text-[19px] bricolage-grotesque-main tracking-tight">Pro Sitemaps</h4>
                   <p className="text-slate-600 text-[15px] leading-relaxed lato-regular">Automatically maintain your sitemaps without lifting a finger. Ensure all new content is indexed instantly and accurately by major search engines.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                   <div className="w-12 h-12 rounded-xl bg-[#f0f8ff] flex items-center justify-center text-[#00748b] mb-6"><Code className="w-6 h-6" /></div>
                   <h4 className="font-bold text-slate-800 mb-3 text-[19px] bricolage-grotesque-main tracking-tight">Generator Script</h4>
                   <p className="text-slate-600 text-[15px] leading-relaxed lato-regular">Download our standalone PHP script to generate sitemaps locally on your own server. Total control with no limits on pages or configurations.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                   <div className="w-12 h-12 rounded-xl bg-[#f0f8ff] flex items-center justify-center text-[#00748b] mb-6"><Search className="w-6 h-6" /></div>
                   <h4 className="font-bold text-slate-800 mb-3 text-[19px] bricolage-grotesque-main tracking-tight">SEO Tools</h4>
                   <p className="text-slate-600 text-[15px] leading-relaxed lato-regular">Boost your website's visibility with our suite of SEO diagnostics. Analyze headers, validate structures, and simulate search bots in real time.</p>
                </div>
              </div>
            </div>
          )}

          {status === "scanning" && (
            <div className="animate-in fade-in max-w-5xl mx-auto mt-12 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl relative text-left">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                <div className="h-full bg-[#00748b] transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/40 animate-[shimmer_1s_infinite]"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-0">
                {/* Left side: Stats & Terminal */}
                <div className="p-8 md:p-10 flex flex-col h-full border-b md:border-b-0 border-slate-200 relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-[#f0f8ff] flex items-center justify-center shrink-0">
                      <Loader2 className="w-7 h-7 text-[#00748b] animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Scanning your website...</h3>
                      <div className="text-slate-500 text-[14px] truncate max-w-[250px] font-medium">{url}</div>
                    </div>
                  </div>
                  
                  {/* Progress & Stats Row */}
                  <div className="flex flex-col gap-5 mb-8">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center">
                       <div className="flex justify-between items-end mb-3">
                         <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Overall Progress</div>
                         <div className="text-3xl font-black text-[#00748b] tracking-tighter leading-none">{Math.round(progress)}%</div>
                       </div>
                       <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                         <div className="bg-[#00748b] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Discovered</div>
                        <div className="text-2xl font-black text-slate-800">{stats.pages}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Assets</div>
                        <div className="text-2xl font-black text-slate-800">{stats.images}</div>
                      </div>
                    </div>
                  </div>

                  {/* Dark Terminal Logs */}
                  <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] flex flex-col flex-1 min-h-[180px]">
                    <div className="bg-[#1e293b] px-4 py-2.5 flex items-center gap-2 border-b border-white/10 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                      <div className="ml-3 text-[11px] font-mono font-medium text-slate-400">live_crawler.log</div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-end font-mono text-[12px] text-slate-400 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10"></div>
                      <div className="space-y-2 flex flex-col justify-end">
                        {logs.slice(-6).map((log, i) => (
                          <div key={i} className="truncate">
                            <span className="text-emerald-500 mr-3">GET</span>
                            <span className="text-slate-300">{log.msg.replace('→ Scanning: ', '').replace('🚀 Initializing Crawler...', 'Engine initialized successfully.')}</span>
                            <span className="ml-3 text-emerald-500/50 text-[10px]">200</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Floating Browser Mockup */}
                <div className="bg-[#f8fafc] p-8 md:p-10 flex items-center justify-center border-l border-slate-200 relative overflow-hidden min-h-[450px]">
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-72 h-72 bg-[#00748b]/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                   
                   {/* Premium Safari/Chrome Mockup */}
                   <div className="w-full md:w-[460px] max-w-[100%] bg-white rounded-xl shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-200/80 relative z-10 transform transition-transform duration-500">
                     {/* Browser Header */}
                     <div className="bg-slate-100/80 backdrop-blur-sm px-4 py-3 flex items-center gap-2 border-b border-slate-200 shrink-0">
                        <div className="flex gap-1.5 shrink-0">
                           <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div className="mx-auto bg-white border border-slate-200/80 rounded flex-1 ml-4 text-center text-[11px] font-medium text-slate-500 py-1.5 truncate shadow-sm">
                           {(() => {
                             try { return new URL(url).hostname; } 
                             catch { return url; }
                           })()}
                        </div>
                     </div>
                     {/* Browser Viewport */}
                     <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
                           <Loader2 className="w-6 h-6 animate-spin text-[#00748b]" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Capturing visual...</span>
                        </div>
                        <img 
                          src={`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`} 
                          alt="Website Preview"
                          className="absolute inset-0 w-full h-full object-cover object-top relative z-10 transition-opacity duration-1000 opacity-0"
                          onLoad={(e) => {
                            (e.currentTarget as HTMLImageElement).style.opacity = '1';
                          }}
                        />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="animate-in fade-in max-w-xl mx-auto mt-20 text-center bg-white p-12 rounded-2xl border border-slate-200 shadow-xl">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Scan Failed</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">We encountered an unexpected error while scanning this website. This usually happens if the site blocks bots or is temporarily offline.</p>
              <button onClick={() => setStatus("idle")} className="bg-slate-800 text-white px-8 py-3.5 rounded font-bold hover:bg-slate-700 transition-colors shadow-md">Start New Scan</button>
            </div>
          )}

          {status === "completed" && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Check className="w-6 h-6 text-[#00748b]" strokeWidth={3} />
                <h2 className="text-[26px] font-black text-slate-800 tracking-tight bricolage-grotesque-main">Your Sitemap is ready!</h2>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg max-w-4xl mx-auto relative z-10 pb-0">
                <div className="p-6 text-left pb-10">
                  <div className="text-[16px] text-slate-700 mb-8 font-medium">
                    Website: <span className="font-bold text-slate-900">{url}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between px-8">
                     {/* LEFT: The donut chart + Completed + Buttons */}
                     <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-[240px] h-[240px]">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                            {/* Skipped Segment (Orange Background) */}
                            <circle cx="80" cy="80" r="70" fill="none" stroke="#f59e0b" strokeWidth="10" />
                            {/* Discovered Segment (Green Foreground) */}
                            <circle cx="80" cy="80" r="70" fill="none" stroke="#00b87c" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={(stats.pages + stats.skipped) > 0 ? (2 * Math.PI * 70) * (stats.skipped / (stats.pages + stats.skipped)) : 2 * Math.PI * 70} strokeLinecap="butt" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                            <span className="text-[44px] font-black text-[#334155] leading-none tracking-tight">{stats.pages + stats.skipped}</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Discovered</span>
                            <div className="w-28 h-[1px] bg-slate-200 my-4"></div>
                            <div className="flex items-center gap-6 text-center">
                              <div>
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Added</div>
                                <div className="text-[#00b87c] font-bold text-[22px] leading-none">{stats.pages}</div>
                              </div>
                              <div className="w-[1px] h-10 bg-slate-200"></div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Skipped</div>
                                <div className="text-[#f59e0b] font-bold text-[22px] leading-none">{stats.skipped}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2">
                          <Check className="w-5 h-5 text-[#00b87c]" strokeWidth={3} />
                          <span className="text-[#00b87c] font-bold text-[16px]">Completed.</span>
                        </div>
                        
                        <div className="mt-8 flex flex-wrap justify-center gap-2 w-full max-w-[480px]">
                          <button onClick={downloadXml} className="bg-[#00b87c] text-white px-5 py-3 rounded-md font-bold text-[14px] transition-colors hover:bg-[#00a06c] flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download XML
                          </button>
                          <button onClick={() => setStatus("details")} className="bg-[#00748b] text-white px-5 py-3 rounded-md font-bold text-[14px] transition-colors hover:bg-[#006074]">
                            View sitemap details
                          </button>
                          <button onClick={() => setStatus("idle")} className="bg-[#f1f5f9] text-slate-600 px-6 py-3 rounded-md font-bold text-[14px] transition-colors hover:bg-[#e2e8f0]">
                            Close
                          </button>
                        </div>
                     </div>

                     {/* RIGHT: Simple Website Thumbnail */}
                     <div className="hidden md:block w-[320px] aspect-[16/10] border border-slate-200 rounded-lg overflow-hidden relative bg-white shrink-0 self-start mt-8">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                           <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                        </div>
                        <img 
                          src={`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`} 
                          alt="Website Preview"
                          className="absolute inset-0 w-full h-full object-cover object-top relative z-10 animate-in fade-in duration-1000"
                        />
                     </div>
                  </div>
                </div>

                <div className="bg-white border-t border-slate-200 p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FlaskConical className="w-5 h-5 text-[#d32f2f]" />
                    <span className="text-[#00748b] font-medium text-[15px]">Keep your sitemap auto-updated with <span className="text-[#d32f2f] font-bold">PRO Sitemaps</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === "details" && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4 pb-12">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-3xl mx-auto text-left relative z-10">
                <div className="p-8">
                  <h2 className="text-[22px] font-bold text-slate-800 mb-6 tracking-tight">Sitemap for {new URL(url).hostname}</h2>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 mb-10">
                    <div className="grid grid-cols-[140px_1fr] gap-y-4 text-[14px]">
                      <div className="text-slate-500 font-bold">Starting URL</div>
                      <div className="text-[#00748b] font-bold break-all hover:underline cursor-pointer">{url}</div>
                      
                      <div className="text-slate-500 font-bold">Updated on</div>
                      <div className="text-slate-800 font-medium">{new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
                      
                      <div className="text-slate-500 font-bold">Pages indexed</div>
                      <div className="text-slate-800 font-medium">{stats.pages}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">What's next?</h3>
                  
                  <div className="flex flex-col items-center mb-8">
                    <button onClick={downloadXml} className="w-full max-w-lg bg-[#00748b] text-white px-6 py-4 rounded shadow-sm font-bold text-[15px] transition-colors hover:bg-[#006074] flex items-center justify-center gap-3">
                      <Download className="w-5 h-5" /> Download your XML sitemap file
                    </button>
                    
                    <ChevronDown className="w-6 h-6 text-slate-300 my-4" />
                    
                    <div className="w-full max-w-lg bg-slate-50 border border-slate-200 text-slate-700 px-6 py-4 rounded text-center text-[15px] font-medium shadow-sm">
                      Upload it into the domain root folder of your website.
                    </div>
                    
                    <ChevronDown className="w-6 h-6 text-slate-300 my-4" />
                    
                    <div className="w-full max-w-lg bg-slate-50 border border-slate-200 text-slate-700 px-6 py-4 rounded text-center text-[15px] font-medium shadow-sm flex flex-col items-center gap-1.5">
                      Open Google Search console and add your sitemap URL.
                      <div className="text-[13px] text-slate-500 font-normal">e.g. {url.replace(/\/$/, '')}/sitemap.xml</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-center gap-4 pt-6 border-t border-slate-100">
                    <button className="flex items-center justify-center gap-2 text-[#00748b] bg-[#f0f8ff] border border-[#d6eaf8] px-6 py-3 rounded text-[14px] font-bold hover:bg-[#e1f0fa] transition-colors">
                      <Search className="w-4 h-4" /> View XML Sitemap in Browser
                    </button>
                    <button onClick={() => setStatus("completed")} className="flex items-center justify-center gap-2 text-slate-600 bg-slate-50 border border-slate-200 px-6 py-3 rounded text-[14px] font-bold hover:bg-slate-100 transition-colors">
                      <FileText className="w-4 h-4" /> Sitemap Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* FAQS SECTION */}
        <section className="bg-white py-20 px-6 border-t border-slate-200 mt-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight text-center">Frequently Asked Questions about XML Sitemaps</h2>
            <div className="mb-16">
              <AccordionItem 
                question="What is a sitemap?" 
                answer="A sitemap is a file where you provide information about the pages, videos, and other files on your site, and the relationships between them. Search engines like Google read this file to more intelligently crawl your site." 
              />
              <AccordionItem 
                question="Why do I need an XML sitemap?" 
                answer="XML sitemaps help search engines navigate your website and discover new or updated content quickly. This is especially important for large websites, new websites with few external links, or sites with rich media content." 
              />
              <AccordionItem 
                question="How does this sitemap generator work?" 
                answer="Our tool acts like a search engine bot. It starts at your homepage, finds all internal links, and follows them to map out your entire website structure automatically. It then formats this data into standard XML, HTML, or Visual formats." 
              />
              <AccordionItem 
                question="Is this sitemap generator free to use?" 
                answer="Yes! Our public generator allows you to create search-engine ready sitemaps for free up to a certain page limit. For larger websites, we offer premium Pro plans with automatic syncing." 
              />
              <AccordionItem 
                question="How do I submit my sitemap to Google?" 
                answer="Once generated, download your XML file and upload it to the root folder of your website (e.g., yourdomain.com/sitemap.xml). Then, log into Google Search Console, navigate to the 'Sitemaps' section, and enter your sitemap's URL to submit it." 
              />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight text-center">Visual Sitemap FAQs</h2>
            <div>
              <AccordionItem 
                question="What is a visual sitemap?" 
                answer="A visual sitemap is a diagram that shows the hierarchical structure of a website. Unlike XML sitemaps built for search engines, visual sitemaps are designed for humans to plan UI/UX, website architecture, and content strategy." 
              />
              <AccordionItem 
                question="How do I create a visual sitemap?" 
                answer="Select 'Visual Sitemap' from the dropdown in our generator above, enter your URL, and click 'Start creating'. We will automatically crawl your site and generate a beautiful, exportable flowchart of your website's pages." 
              />
            </div>
          </div>
        </section>

        {/* MORE THAN JUST A TOOL */}
        <section className="bg-[#f8fafc] py-20 px-6 border-t border-slate-200">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">More Than Just a Sitemap Creation Tool</h2>
            <p className="text-slate-600 text-[16px] leading-relaxed max-w-3xl mx-auto">
              MySitemapGenerator is a suite of cloud-based tools designed to help with SEO, digital marketing, online sales, and content publishing. Our solutions are platform-agnostic and easy to use — no installation, plugins, or technical setup required. You can start creating and managing essential files for your website in just a few clicks.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Try Quick File Creation with Public Free</h3>
              <p className="text-slate-600 text-[15px] leading-relaxed max-w-2xl mx-auto">
                With our Public Free plan, you get up to 3 free file creation requests per day, even without registering an account. It's a simple way to test our tools and generate essential website files instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "XML Sitemap Generator", icon: <Code className="w-6 h-6 text-[#00748b]" />, desc: "Standard XML format for Google & Bing." },
                { title: "Visual Sitemap Generator", icon: <Map className="w-6 h-6 text-[#00b87c]" />, desc: "Beautiful flowcharts for UX planning." },
                { title: "HTML Sitemap Generator", icon: <FileText className="w-6 h-6 text-blue-500" />, desc: "Human-readable directory for visitors." },
                { title: "RSS Feed Generator", icon: <Network className="w-6 h-6 text-orange-500" />, desc: "Automated content syndication feeds." },
                { title: "Product Feed Generator", icon: <Star className="w-6 h-6 text-purple-500" />, desc: "Data feeds for Google Shopping & Ads." },
                { title: "Yandex YML Generator", icon: <Globe className="w-6 h-6 text-red-500" />, desc: "Format optimized for Yandex services." }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">{card.icon}</div>
                  <h4 className="font-bold text-slate-800 mb-2">{card.title}</h4>
                  <p className="text-slate-500 text-[13px]">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200 pt-16 pb-24 px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-xl font-black tracking-tight text-slate-800 mb-8">
              MySitemap<span className="text-[#00748b]">Generator</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-[13px] font-bold text-slate-600 mb-8">
              <a href="#" className="hover:text-[#00748b] transition-colors">About</a>
              <a href="#" className="hover:text-[#00748b] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#00748b] transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-[#00748b] transition-colors">Contact</a>
            </div>
            <div className="text-slate-400 text-sm">
              ©MySitemapGenerator {new Date().getFullYear()}. All rights reserved.
            </div>
          </div>
        </footer>

        {/* COOKIE BANNER */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 z-50 animate-in slide-in-from-bottom-full">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
            <p className="text-sm font-medium">By using this website, you consent to the storage of cookies on your device.</p>
            <button className="bg-white text-slate-800 hover:bg-slate-100 px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors whitespace-nowrap">
              Accept
            </button>
          </div>
        </div>

      </main>
      </div>
    </div>
  );
}

export default Index;
