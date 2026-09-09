/** Owner-confirmed identity and operating facts, reviewed September 8, 2026. */
export interface PublicProfile {
  label: string;
  url: `https://${string}`;
}

export const site = {
  origin: "https://www.cobaltemployment.com",
  name: "Cobalt Employment Group",
  legalName: "Cobalt Employment Group LLC",
  foundingDate: "2026-01-14",
  entityId: "001941552",
  policyDate: "2026-09-08",
  themeColor: "#004aad",
  address: {
    streetAddress: "420 Lakeside Avenue, Suite 303",
    addressLocality: "Marlborough",
    addressRegion: "MA",
    postalCode: "01752",
    addressCountry: "US",
  },
  description:
    "Cobalt Employment Group coordinates employment, payroll, benefits, and HR operations for affiliated businesses from Marlborough, Massachusetts.",
  operatingModel:
    "Cobalt employs and administers personnel supporting affiliated businesses only.",
  positioning:
    "Cobalt Employment Group supports workforce administration for affiliated businesses, coordinating employment, payroll, benefits, and HR operations with support from ADP TotalSource.",
  publicServiceNotice:
    "Cobalt does not currently offer staffing, placement, recruitment, employer-of-record (EOR), professional employer organization (PEO), or workforce-administration services to unrelated outside clients.",
  adp: {
    name: "ADP TotalSource",
    relationship:
      "ADP TotalSource is Cobalt’s PEO provider, providing PEO/co-employment support.",
  },
  logos: {
    wordmark: "/cobalt-logo.png",
    wordmarkWidth: 2048,
    wordmarkHeight: 524,
    square: "/favicon-512.png",
    squareSize: 512,
    favicon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  founder: {
    name: "Jake Greasley",
    legalName: "Jacob Charles Greasley",
    givenName: "Jacob",
    additionalName: "Charles",
    familyName: "Greasley",
    alternateNames: ["Jacob Greasley", "Jacob Charles Greasley"],
    title: "Founder and President",
    // Owner-approved identity URLs. Bot challenges do not invalidate ownership.
    profiles: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/jake-greasley" },
      { label: "GitHub", url: "https://github.com/JakeGreasleyGIM" },
      { label: "Instagram", url: "https://www.instagram.com/jake.greasley/" },
      {
        label: "eXp Realty",
        url: "https://ma.exprealty.com/agents/1903443/Jacob+Greasley",
      },
      {
        label: "NAR member directory",
        url: "https://directories.apps.realtor/memberDetail/?personId=4940266&officeStreetCountry=US&memberLastName=Greasley",
      },
      {
        label: "MassLandlords",
        url: "https://masslandlords.net/landlord/jacob-greasley/",
      },
      {
        label: "Realtor.com",
        url: "https://www.realtor.com/realestateagents/656d3c88398ad2f645a8b94b",
      },
      {
        label: "Homes.com",
        url: "https://www.homes.com/real-estate-agents/jacob-greasley/kz9yngc/",
      },
      {
        label: "Showcase",
        url: "https://www.showcase.com/p/jake-greasley/253290651/",
      },
      {
        label: "RateMyAgent",
        url: "https://www.ratemyagent.com/real-estate-agent/jacob-greasley-b2ng7z/sales/overview",
      },
      {
        label: "RealSatisfied",
        url: "https://profile.realsatisfied.com/Jacob-Greasley",
      },
      {
        label: "MarketScreener",
        url: "https://www.marketscreener.com/insider/JAKE-GREASLEY-A3LLV6/",
      },
    ] satisfies PublicProfile[],
  },
  contact: {
    provider: "FormSubmit",
    providerDocumentationUrl: "https://formsubmit.co/documentation",
    providerPrivacyUrl: "https://formsubmit.co/privacy",
    subject: "Cobalt website inquiry",
    archiveNotice:
      "FormSubmit states that its submission archive retains submissions for 30 days. This is the provider’s stated practice, not a Cobalt-controlled deletion guarantee.",
    responseExpectation:
      "Inquiries generally receive a response within one business day.",
    applicationNotice:
      "This form is for organizational and privacy inquiries. It is not a general job application; please do not submit résumés.",
    unavailableMessage:
      "The contact form is temporarily unavailable. Please return later to send an organizational inquiry or privacy request.",
  },
} as const;

export type ContactConfig =
  | { enabled: false; endpoint: "" }
  | {
      enabled: true;
      endpoint: string;
      provider: typeof site.contact.provider;
      documentationUrl: string;
      privacyUrl: string;
    };

/** Public invisible-email aliases only; never recipient addresses or archive API keys. */
export function resolveContactConfig(endpoint = ""): ContactConfig {
  if (endpoint === "") return { enabled: false, endpoint: "" };
  // Match the original bytes: URL normalization must not hide encoding or traversal.
  if (
    !/^https:\/\/formsubmit\.co\/ajax\/[a-zA-Z0-9_-]{16,128}$/.test(endpoint) ||
    /\s/.test(endpoint)
  ) {
    throw new Error(
      "VITE_FORM_ENDPOINT must be an anonymous FormSubmit AJAX URL with a 16–128 character token and no credentials, encoding, spaces, or URL extras. Value intentionally not logged.",
    );
  }
  return {
    enabled: true,
    endpoint,
    provider: site.contact.provider,
    documentationUrl: site.contact.providerDocumentationUrl,
    privacyUrl: site.contact.providerPrivacyUrl,
  };
}

export const canonicalUrl = `${site.origin}/`;
export const entityIds = {
  organization: `${canonicalUrl}#organization`,
  website: `${canonicalUrl}#website`,
  webpage: `${canonicalUrl}#webpage`,
  founder: `${canonicalUrl}#jake-greasley`,
} as const;

export const pageTitle = `${site.name} — Workforce administration for affiliated businesses`;
export const foundedLabel = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${site.foundingDate}T12:00:00Z`));

export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": entityIds.organization,
        name: site.name,
        legalName: site.legalName,
        url: canonicalUrl,
        description: site.positioning,
        foundingDate: site.foundingDate,
        address: { "@type": "PostalAddress", ...site.address },
        identifier: {
          "@type": "PropertyValue",
          propertyID: "Massachusetts entity identification number",
          value: site.entityId,
        },
        logo: {
          "@type": "ImageObject",
          url: `${site.origin}${site.logos.square}`,
          contentUrl: `${site.origin}${site.logos.square}`,
          width: site.logos.squareSize,
          height: site.logos.squareSize,
          caption: `${site.name} logo`,
        },
        founder: { "@id": entityIds.founder },
      },
      {
        "@type": "WebSite",
        "@id": entityIds.website,
        name: site.name,
        url: canonicalUrl,
        inLanguage: "en-US",
        publisher: { "@id": entityIds.organization },
      },
      {
        "@type": "WebPage",
        "@id": entityIds.webpage,
        name: pageTitle,
        url: canonicalUrl,
        description: site.description,
        inLanguage: "en-US",
        isPartOf: { "@id": entityIds.website },
        about: { "@id": entityIds.organization },
        mainEntity: { "@id": entityIds.organization },
        publisher: { "@id": entityIds.organization },
      },
      {
        "@type": "Person",
        "@id": entityIds.founder,
        name: site.founder.name,
        alternateName: site.founder.alternateNames,
        givenName: site.founder.givenName,
        additionalName: site.founder.additionalName,
        familyName: site.founder.familyName,
        jobTitle: site.founder.title,
        description: `${site.founder.name}, legally ${site.founder.legalName}, is the ${site.founder.title} of ${site.legalName}.`,
        url: `${canonicalUrl}#jake-greasley`,
        affiliation: { "@id": entityIds.organization },
        worksFor: { "@id": entityIds.organization },
        sameAs: site.founder.profiles.map(({ url }) => url),
      },
    ],
  };
}
