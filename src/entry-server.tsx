import { renderToString } from "react-dom/server";
import App from "./App";
import { canonicalUrl, organizationGraph, pageTitle, site } from "./site";

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );

export function render(notFound = false) {
  const title = notFound ? `Page not found — ${site.name}` : pageTitle;
  const image = `${site.origin}${site.logos.square}`;
  const head = `
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(notFound ? "The requested page could not be found." : site.description)}" />
    <meta name="robots" content="${notFound ? "noindex, follow" : "index, follow"}" />
    <meta name="theme-color" content="${site.themeColor}" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <link rel="icon" type="image/png" sizes="32x32" href="${site.logos.favicon}" />
    <link rel="icon" type="image/png" sizes="512x512" href="${site.logos.square}" />
    <link rel="apple-touch-icon" sizes="180x180" href="${site.logos.apple}" />
    ${
      notFound
        ? ""
        : `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(site.name)}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(site.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="${escape(site.name)} logo" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(site.description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escape(site.name)} logo" />
    <script type="application/ld+json">${JSON.stringify(organizationGraph()).replace(/</g, "\\u003c")}</script>`
    }`;
  return { head, body: renderToString(<App notFound={notFound} />) };
}

export function discoveryFiles() {
  return {
    robots: `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonicalUrl}</loc></url></urlset>\n`,
  };
}
