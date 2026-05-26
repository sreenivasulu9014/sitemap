import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "../components/Navigation";
import { Rss, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/rss-generator")({
  component: RssGenerator,
});

function RssGenerator() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#00748b]/20">
      <Navigation />
      
      <main className="relative">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#eaf4fc]/80 via-white to-transparent pointer-events-none -z-10"></div>
        
        <section className="px-6 max-w-5xl mx-auto pt-20 pb-16 text-center min-h-[400px]">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-[#f0f8ff] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#00748b] shadow-sm">
              <Rss className="w-8 h-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-5 tracking-tight bricolage-grotesque-main">
              RSS Feed Generator
            </h1>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed text-[17px] lato-regular">
              Convert any webpage, blog, or news section into a standard RSS/Atom feed. Keep your users updated with instant content syndication.
            </p>
            
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-left mt-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 bricolage-grotesque-main">Feed Features</h2>
              
              <div className="space-y-6 lato-regular">
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-[#00b87c]" /></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[16px]">Custom Selectors</h3>
                    <p className="text-slate-600 mt-1">Easily map CSS selectors to article titles, dates, descriptions, and thumbnails.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-[#00b87c]" /></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[16px]">Multiple Formats</h3>
                    <p className="text-slate-600 mt-1">Export instantly to RSS 2.0, Atom, or standard JSON Feed formats.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-[#00b87c]" /></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[16px]">Cloud Syndication</h3>
                    <p className="text-slate-600 mt-1">Host your RSS feeds directly on our edge network for blazing fast access globally.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center">
                <button className="bg-[#00748b] hover:bg-[#006074] text-white px-8 py-3 rounded-md text-[15px] font-bold transition-all shadow-[0_4px_14px_0_rgba(0,116,139,0.39)] hover:shadow-[0_6px_20px_rgba(0,116,139,0.23)] hover:-translate-y-0.5 rubik-main">
                  Create RSS Feed
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
