export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
}

export interface SitemapHreflang {
  lang: string;
  href: string;
}

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  hreflangs?: SitemapHreflang[];
}

export function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlset = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    ${url.hreflangs?.map(h => `<xhtml:link rel="alternate" hreflang="${h.lang}" href="${h.href}" />`).join('') || ''}
    ${url.images?.map(img => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      ${img.caption ? `<image:caption>${img.caption}</image:caption>` : ''}
      ${img.title ? `<image:title>${img.title}</image:title>` : ''}
    </image:image>`).join('') || ''}
    ${url.videos?.map(v => `
    <video:video>
      <video:thumbnail_loc>${v.thumbnail_loc}</video:thumbnail_loc>
      <video:title>${v.title}</video:title>
      <video:description>${v.description}</video:description>
      ${v.content_loc ? `<video:content_loc>${v.content_loc}</video:content_loc>` : ''}
      ${v.player_loc ? `<video:player_loc>${v.player_loc}</video:player_loc>` : ''}
    </video:video>`).join('') || ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>`;
}

export function generateSitemapIndexXml(sitemaps: { loc: string, lastmod?: string }[]): string {
  const sitemapsContent = sitemaps
    .map(
      (s) => `
  <sitemap>
    <loc>${s.loc}</loc>
    ${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ''}
  </sitemap>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsContent}
</sitemapindex>`;
}

export function generateSitemapTxt(urls: string[]): string {
  return urls.join('\n');
}

export function generateSitemapHtml(urls: string[], domain: string): string {
  const listItems = urls
    .map((url) => `<li><a href="${url}">${url}</a></li>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap for ${domain}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; color: #333; }
        h1 { color: #2563eb; border-bottom: 2px solid #eff6ff; padding-bottom: 1rem; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.5rem; padding: 0.5rem; border-radius: 0.5rem; background: #f8fafc; transition: background 0.2s; }
        li:hover { background: #f1f5f9; }
        a { color: #2563eb; text-decoration: none; word-break: break-all; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Sitemap for ${domain}</h1>
    <p>Total pages: ${urls.length}</p>
    <ul>
        ${listItems}
    </ul>
</body>
</html>`;
}

