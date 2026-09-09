import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/source-serif-4/latin-400.css";
import "@fontsource/source-serif-4/latin-500.css";
import "@fontsource/source-serif-4/latin-600.css";
import "./index.css";

const root = document.getElementById("root")!;
const notFound = !["/", "/index.html"].includes(window.location.pathname);
// Defense in depth if an old host fallback mistakenly serves this bundle at an unknown URL.
if (notFound) {
  document.querySelector('link[rel="canonical"]')?.remove();
  document
    .querySelectorAll(
      'script[type="application/ld+json"], meta[property^="og:"], meta[name^="twitter:"]',
    )
    .forEach((element) => element.remove());
  const robots =
    document.querySelector<HTMLMetaElement>('meta[name="robots"]') ??
    document.head.appendChild(document.createElement("meta"));
  robots.name = "robots";
  robots.content = "noindex, follow";
  document.title = "Page not found";
}
const app = (
  <React.StrictMode>
    <App notFound={notFound} />
  </React.StrictMode>
);
if (root.children.length && !notFound) hydrateRoot(root, app);
else createRoot(root).render(app);
