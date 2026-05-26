import { useState } from "react";
import { Menu, X, Map, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top utility bar */}
      <div className="max-w-6xl mx-auto px-6 h-10 hidden md:flex items-center justify-between text-[13px] font-medium text-slate-500 lato-regular">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#00748b] transition-colors">Tools</a>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-slate-400">Pro Sitemaps Engine</span>
        </div>
      </div>
      
      {/* Main Bar */}
      <div className="bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <Network className="w-7 h-7 text-[#00748b] transform rotate-90 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[22px] font-black tracking-tighter text-slate-800 bricolage-grotesque-main">
              MySitemap<span className="text-[#00748b]">Generator</span>
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 rubik-main">
            <Link to="/" className="text-[14px] font-bold text-[#00748b] transition-colors">Sitemap Generator</Link>
            <Link to="/ecommerce-feeds" className="text-[14px] font-bold text-slate-600 hover:text-[#00748b] transition-colors">eCommerce Feeds</Link>
            <Link to="/rss-generator" className="text-[14px] font-bold text-slate-600 hover:text-[#00748b] transition-colors">RSS Generator</Link>
          </nav>
          
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4 rubik-main font-bold text-[15px] text-slate-700">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00748b]">Sitemap Generator</Link>
              <Link to="/ecommerce-feeds" onClick={() => setIsMobileMenuOpen(false)}>eCommerce Feeds</Link>
              <Link to="/rss-generator" onClick={() => setIsMobileMenuOpen(false)}>RSS Generator</Link>
              <div className="h-[1px] w-full bg-slate-100 my-2"></div>
              <span className="text-slate-400 text-sm">Pro Sitemaps Engine</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
