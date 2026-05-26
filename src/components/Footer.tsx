import { Map, Twitter, Github, Linkedin, Facebook } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Map className="w-4 h-4" />
              </div>
              <span className="text-slate-900">XML-Sitemaps</span>
            </Link>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Empowering website owners and SEO experts with the gold standard of sitemap generation since 2005.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Generator</Link></li>
              <li><a href="/#pricing" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">PRO Cloud</a></li>
              <li><a href="/#pricing" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="/docs" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link to="/about" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">SEO Tools</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">© 2005-2026 XML-Sitemaps. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
