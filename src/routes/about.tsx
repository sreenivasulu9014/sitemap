import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";
import { Shield, Award, Users, Globe, Map } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    title: "About Us — XML-Sitemaps",
    meta: [
      { name: "description", content: "Learn about XML-Sitemaps, the industry leader in sitemap generation since 2005." },
    ],
  }),
});

function About() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="px-6 max-w-5xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8">
              The Gold Standard of<br />
              <span className="text-blue-600">Sitemap Generation</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
              Since 2005, we've been dedicated to helping website owners and SEO experts get their content indexed faster and more accurately.
            </p>
          </motion.div>
        </section>

        <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-32">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-6">
              Our mission is to provide the most reliable, easy-to-use, and powerful sitemap generation tools on the web. We believe that every website, regardless of size, deserves to be found by search engines.
            </p>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              We've processed over 5 billion pages and helped millions of websites improve their SEO performance through better indexing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Award, title: "20+ Years", desc: "Of industry experience" },
              { icon: Users, title: "390K+", desc: "Happy customers" },
              { icon: Globe, title: "5B+", desc: "Pages indexed" },
              { icon: Shield, title: "Secure", desc: "Enterprise grade" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{item.title}</h4>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 max-w-5xl mx-auto text-center">
          <div className="bg-slate-900 text-white p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6">Ready to improve your SEO?</h2>
              <p className="text-slate-400 text-xl font-medium mb-10 max-w-2xl mx-auto">
                Join the hundreds of thousands of experts who trust XML-Sitemaps for their indexing needs.
              </p>
              <a href="/" className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-500 transition-all inline-block shadow-xl shadow-blue-500/20">
                Start Generating Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
