import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";
import { FileCode, Shield, Zap, Search, Link as LinkIcon, Info } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: Docs,
  head: () => ({
    title: "Documentation — XML-Sitemaps",
    meta: [
      { name: "description", content: "Learn how to use XML-Sitemaps and understand the technical requirements for search engine indexing." },
    ],
  }),
});

function Docs() {
  const sections = [
    {
      title: "Getting Started",
      icon: Zap,
      content: "To generate a sitemap, simply enter your website domain in the generator on the homepage. Our engine will automatically discover your pages, images, and videos."
    },
    {
      title: "XML Format Requirements",
      icon: FileCode,
      content: "Our generator follows the official Sitemaps.org protocol. Each file can contain up to 50,000 URLs and must not exceed 50MB in size. We use UTF-8 encoding for maximum compatibility."
    },
    {
      title: "Max Depth Settings",
      icon: Search,
      content: "The 'Max Depth' setting controls how many levels deep our crawler will go from your homepage. A depth of 3 is usually sufficient for most medium-sized websites."
    },
    {
      title: "Robots.txt Compliance",
      icon: Shield,
      content: "Our crawler respects your robots.txt 'Disallow' rules. If you want to index a page that is currently disallowed, you must update your robots.txt file first."
    },
    {
      title: "Submitting to Google",
      icon: LinkIcon,
      content: "After downloading your sitemap, upload it to your server's root directory and submit the URL to Google Search Console for faster indexing."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="px-6 max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black text-slate-900 mb-8">Documentation</h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Everything you need to know about generating, managing, and optimizing your XML sitemaps for search engines.
            </p>
          </motion.div>
        </section>

        <section className="px-6 max-w-5xl mx-auto space-y-12 mb-32">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl flex gap-8 items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <section.icon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{section.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="px-6 max-w-5xl mx-auto">
          <div className="bg-blue-600 p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Info className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Need custom help?</h3>
                <p className="text-blue-100 font-medium">Our SEO experts are available for premium support.</p>
              </div>
            </div>
            <a href="mailto:support@xml-sitemaps.com" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl">
              Contact Support
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
