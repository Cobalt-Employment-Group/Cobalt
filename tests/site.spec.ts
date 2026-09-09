import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { canonicalUrl, entityIds, site } from "../src/site";

// Independent owner-approved contract: source omissions or URL substitutions must fail.
const approvedProfiles = [
  "https://www.linkedin.com/in/jake-greasley",
  "https://github.com/JakeGreasleyGIM",
  "https://www.instagram.com/jake.greasley/",
  "https://ma.exprealty.com/agents/1903443/Jacob+Greasley",
  "https://directories.apps.realtor/memberDetail/?personId=4940266&officeStreetCountry=US&memberLastName=Greasley",
  "https://masslandlords.net/landlord/jacob-greasley/",
  "https://www.realtor.com/realestateagents/656d3c88398ad2f645a8b94b",
  "https://www.homes.com/real-estate-agents/jacob-greasley/kz9yngc/",
  "https://www.showcase.com/p/jake-greasley/253290651/",
  "https://www.ratemyagent.com/real-estate-agent/jacob-greasley-b2ng7z/sales/overview",
  "https://profile.realsatisfied.com/Jacob-Greasley",
  "https://www.marketscreener.com/insider/JAKE-GREASLEY-A3LLV6/",
];
const founderWording =
  "Jake Greasley, legally Jacob Charles Greasley, is the Founder and President of Cobalt Employment Group LLC.";

// Browser tests may never send traffic to a real form or any other external host.
test.beforeEach(async ({ context }) => {
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).hostname === "127.0.0.1")
      return route.continue();
    return route.abort("blockedbyclient");
  });
});

test("prerendered identity, metadata, and connected graph are available without JavaScript", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort("blockedbyclient"),
  );
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#about")).toContainText(
    founderWording,
  );
  await expect(page.locator(".founder__title")).toHaveText("Founder and President");
  await expect(page.locator("#about")).toContainText("January 14, 2026");
  await expect(page.locator("#about")).toContainText("001941552");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cobaltemployment.com/",
  );
  await expect(page).toHaveTitle(
    /Cobalt Employment Group.*affiliated businesses/,
  );
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
  ]) {
    await expect(page.locator(selector)).toHaveAttribute(
      "content",
      /Cobalt Employment Group/,
    );
  }
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonicalUrl,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary",
  );
  await expect(
    page.locator('meta[name="twitter:site"], meta[name="twitter:creator"]'),
  ).toHaveCount(0);
  const graphScripts = page.locator('script[type="application/ld+json"]');
  await expect(graphScripts).toHaveCount(1);
  const graph = JSON.parse((await graphScripts.textContent())!)["@graph"];
  expect(graph).toHaveLength(4);
  expect(
    graph.map((node: Record<string, unknown>) => node["@id"]).sort(),
  ).toEqual(
    [
      "https://www.cobaltemployment.com/#organization",
      "https://www.cobaltemployment.com/#website",
      "https://www.cobaltemployment.com/#webpage",
      "https://www.cobaltemployment.com/#jake-greasley",
    ].sort(),
  );
  expect(
    new Set(graph.map((node: Record<string, unknown>) => node["@id"])).size,
  ).toBe(4);
  const organization = graph.find(
    (node: Record<string, unknown>) => node["@type"] === "Organization",
  );
  const person = graph.find(
    (node: Record<string, unknown>) => node["@type"] === "Person",
  );
  expect(organization).toMatchObject({
    "@id": entityIds.organization,
    name: "Cobalt Employment Group",
    legalName: "Cobalt Employment Group LLC",
    foundingDate: "2026-01-14",
    founder: { "@id": entityIds.founder },
    identifier: { value: "001941552" },
    address: {
      streetAddress: "420 Lakeside Avenue, Suite 303",
      addressLocality: "Marlborough",
      addressRegion: "MA",
      postalCode: "01752",
    },
  });
  expect(organization).not.toHaveProperty("sameAs");
  expect(graph.find((node: Record<string, unknown>) => node["@type"] === "WebSite")).toMatchObject({
    "@id": entityIds.website,
    publisher: { "@id": entityIds.organization },
  });
  expect(graph.find((node: Record<string, unknown>) => node["@type"] === "WebPage")).toMatchObject({
    "@id": entityIds.webpage,
    isPartOf: { "@id": entityIds.website },
    about: { "@id": entityIds.organization },
    mainEntity: { "@id": entityIds.organization },
    publisher: { "@id": entityIds.organization },
  });
  expect(person).toMatchObject({
    "@id": entityIds.founder,
    name: "Jake Greasley",
    givenName: "Jacob",
    additionalName: "Charles",
    familyName: "Greasley",
    jobTitle: "Founder and President",
    description: founderWording,
    affiliation: { "@id": entityIds.organization },
    worksFor: { "@id": entityIds.organization },
  });
  expect(person.alternateName).toEqual(["Jacob Greasley", "Jacob Charles Greasley"]);
  expect(person.sameAs).toHaveLength(12);
  expect(new Set(person.sameAs).size).toBe(12);
  expect([...person.sameAs].sort()).toEqual([...approvedProfiles].sort());
  expect(site.founder.profiles.map(({ url }) => url).sort()).toEqual([...approvedProfiles].sort());
  expect(graph.filter((node: Record<string, unknown>) => "sameAs" in node)).toEqual([person]);

  // Native disclosure and every identity link remain usable without JavaScript.
  const summary = page.locator(".founder-profiles summary");
  await expect(summary).toHaveText("Jake Greasley profiles");
  await summary.focus();
  await summary.press("Enter");
  await expect(page.locator(".founder-profiles")).toHaveAttribute("open", "");
  await expect(page.locator(".founder-profiles")).toContainText("separate from his Cobalt role");
  await expect(page.locator(".founder-profiles")).toContainText("do not describe or endorse Cobalt");
  const profileLinks = page.getByRole("list", { name: "Jake Greasley profiles" }).getByRole("link");
  await expect(profileLinks).toHaveCount(12);
  const visibleProfiles = [];
  for (const link of await profileLinks.all()) {
    await expect(link).toBeVisible();
    visibleProfiles.push(await link.getAttribute("href"));
  }
  expect(visibleProfiles.sort()).toEqual([...approvedProfiles].sort());
  await summary.press("Enter");
  await expect(profileLinks.first()).toBeHidden();
  for (const node of graph)
    for (const property of [
      "email",
      "telephone",
      "naics",
      "aggregateRating",
      "review",
      "numberOfEmployees",
    ])
      expect(node).not.toHaveProperty(property);
  for (const image of [
    organization.logo.url,
    await page.locator('meta[property="og:image"]').getAttribute("content"),
    await page.locator('meta[name="twitter:image"]').getAttribute("content"),
  ]) {
    expect(image).toMatch(/^https:\/\/www\.cobaltemployment\.com\//);
    const response = await request.get(new URL(image).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const png = await response.body();
    expect(png.readUInt32BE(16)).toBeGreaterThanOrEqual(112);
    expect(png.readUInt32BE(20)).toBeGreaterThanOrEqual(112);
  }
  await context.close();
});

test("public copy stays within the confirmed affiliate scope", async ({
  page,
}) => {
  await page.goto("/");
  const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  expect(text).toContain("affiliated businesses only");
  expect(text).toContain("ADP TotalSource is Cobalt’s PEO provider");
  expect(text).toContain("Net 30");
  expect(text).toContain("one business day");
  expect(text).toContain("not a general job application");
  expect(text).not.toMatch(
    /541611|NAICS|South Kingsbridge|registered[ -]agent|\bCEO\b|2027|waitlist|accepting clients|ADP partner/i,
  );
  expect(text).not.toMatch(
    /request a consultation|you direct the work|staffing and employment services firm|assigned personnel|worksite employer of record/i,
  );
  // Remove explicit boundary disclosures, then reject affirmative service marketing.
  const affirmative = text
    .replaceAll(site.publicServiceNotice, "")
    .replace(/The contact form is not a general job application\.[^.]*\./g, "");
  expect(affirmative).not.toMatch(
    /\b(staffing|placement|recruit(?:ing|ment)|employer.of.record|EOR)\b/i,
  );
  expect(text).not.toMatch(
    /Cobalt (?:is|acts as|serves as|offers|provides) (?:an? |the )?(?:PEO|professional employer organization|employer of record)/i,
  );
  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(
    0,
  );
  for (const link of await page.locator("a").all())
    expect(await link.innerText()).not.toMatch(
      /consultation|hire talent|find (?:staff|talent)|request (?:staff|pricing)|apply now|recruit/i,
    );
  await expect(page.locator("#privacy")).toContainText("AWS Amplify");
  await expect(page.locator("#terms")).toContainText(
    "does not create an employment, staffing, client, advisory, or contractual relationship",
  );
});

test("discovery, real static resources, internal links, and unknown routes", async ({
  page,
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  expect(await robots.text()).toContain(
    "Sitemap: https://www.cobaltemployment.com/sitemap.xml",
  );
  expect(await robots.text()).not.toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("application/xml");
  const xml = await sitemap.text();
  expect(xml.match(/<loc>/g)).toHaveLength(1);
  expect(xml).toContain(`<loc>${canonicalUrl}</loc>`);
  expect(xml).not.toContain("#");
  await page.goto("/");
  for (const href of await page
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!)))
    await expect(page.locator(href)).toHaveCount(1);
  for (const url of await page
    .locator("script[src], link[href], img[src]")
    .evaluateAll((elements) =>
      elements
        .map(
          (element) =>
            element.getAttribute("src") || element.getAttribute("href")!,
        )
        .filter((url) => url.startsWith("/")),
    )) {
    const resource = await request.get(url);
    expect(resource.status(), url).toBe(200);
    if (/\.js$/.test(url))
      expect(resource.headers()["content-type"]).toContain("javascript");
    if (/\.css$/.test(url))
      expect(resource.headers()["content-type"]).toContain("text/css");
  }
  const alias = await request.get("/index.html", { maxRedirects: 0 });
  expect(alias.status()).toBe(301);
  expect(alias.headers().location).toBe("/");
  for (const url of [
    "/missing-review-page",
    "/missing-review-page/",
    "/about",
    "/privacy",
    "/unknown.js",
    "/assets/missing.css",
    "/deep/path/index.html",
  ]) {
    const missing = await request.get(url);
    expect(missing.status(), url).toBe(404);
    expect(await missing.text()).toContain("That page isn’t here.");
    expect(await missing.text()).not.toContain("A capable team behind");
  }
  await page.goto("/missing-review-page");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(
    page.locator('link[rel="canonical"], script[type="application/ld+json"]'),
  ).toHaveCount(0);
  const rules = JSON.parse(await readFile("amplify-redirects.json", "utf8"));
  expect(rules).toEqual([{
    source: "https://cobaltemployment.com",
    status: "301",
    target: "https://www.cobaltemployment.com",
    condition: null,
  }, {
    source: "https://main.d22dxgvoxraolf.amplifyapp.com",
    status: "301",
    target: "https://www.cobaltemployment.com",
    condition: null,
  }, {
    source: "/index.html",
    status: "301",
    target: "/",
    condition: null,
  }, {
    source: "/<*>",
    status: "404",
    target: "/404.html",
    condition: null,
  }]);
  expect(
    rules.some((rule: { status: string }) =>
      ["200", "404-200"].includes(rule.status),
    ),
  ).toBe(false);
});

for (const width of [320, 390, 768, 1440]) {
  test(`layout, images, and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.locator(".founder-profiles summary").press("Enter");
    await expect(page.locator(".founder-profiles")).toHaveAttribute("open", "");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0 &&
              image.width > 0 &&
              image.height > 0 &&
              image.hasAttribute("width") &&
              image.hasAttribute("height"),
          ),
        ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `test-results/home-${width}-${test.info().project.name}.png`,
        fullPage: true,
      });
  });
}

test("keyboard navigation, heading order, and reduced motion", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // macOS Safari includes links in sequential navigation with Option-Tab.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  expect(
    await page
      .locator(".skip-link")
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  expect(
    await page
      .locator("html")
      .evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe("auto");
  const headings = await page
    .locator("h1,h2,h3,h4,h5,h6")
    .evaluateAll((elements) =>
      elements.map((element) => Number(element.tagName[1])),
    );
  expect(headings[0]).toBe(1);
  headings
    .slice(1)
    .forEach((level, index) =>
      expect(level - headings[index]).toBeLessThanOrEqual(1),
    );
});

test("missing configuration is honest, disabled, and sends nothing", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("http://127.0.0.1:4177/");
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  await expect(page.locator(".contact-form")).toContainText(
    "temporarily unavailable",
  );
  await expect(page.locator("#privacy")).not.toContainText("FormSubmit");
  expect(posts).toEqual([]);
});

test("page load does not shift layout or contact third parties", async ({
  page,
  browserName,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname !== "127.0.0.1")
      external.push(request.url());
  });
  await page.addInitScript(() => {
    const entries: number[] = [];
    Object.assign(window, { cobaltLayoutShifts: entries });
    if (PerformanceObserver.supportedEntryTypes.includes("layout-shift"))
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!shift.hadRecentInput) entries.push(shift.value);
        }
      }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
  if (browserName === "chromium") {
    const cls = await page.evaluate(
      () =>
        (
          window as Window & { cobaltLayoutShifts?: number[] }
        ).cobaltLayoutShifts?.reduce((sum, value) => sum + value, 0) ?? 0,
    );
    expect(cls).toBeLessThan(0.1);
    test.info().annotations.push({ type: "CLS", description: String(cls) });
  }
  expect(external).toEqual([]);
});
