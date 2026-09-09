# Cobalt Employment Group

The public organizational website for **Cobalt Employment Group LLC**, reviewed September 8, 2026. React 18 and TypeScript provide the UI and contact interaction; Vite builds assets and the build script pre-renders complete HTML. AWS Amplify serves the static `dist` directory. There is no authentication, database, backend, or client-side router in this application. The previous starter README inaccurately claimed those features.

## Canonical facts and editorial boundaries

`src/site.ts` is the typed source of identity, descriptions, address, dates, assets, founder profiles, ADP wording, form-provider configuration, and entity identifiers. `src/form-config.ts` resolves the one public environment variable from that source.

| Fact | Approved value |
| --- | --- |
| Public / legal name | Cobalt Employment Group / Cobalt Employment Group LLC |
| Massachusetts entity ID | 001941552 |
| Organization and public founding date | January 14, 2026 (`2026-01-14`) |
| Headquarters | 420 Lakeside Avenue, Suite 303, Marlborough, MA 01752 |
| Founder | Jake Greasley, legally Jacob Charles Greasley; Cobalt title: **Founder and President** |
| Operating model | Cobalt employs and administers personnel supporting affiliated businesses only |
| PEO provider | ADP TotalSource; PEO/co-employment support, never ADP as EOR or marketing “partner” |
| Production origin | `https://www.cobaltemployment.com` |
| Homepage canonical | `https://www.cobaltemployment.com/` |
| Contact | Form only; inquiries generally receive a response within one business day |

Do not market public staffing, placement, recruiting, EOR, PEO, or workforce-administration services. Actual-cost reimbursement, no hidden margin, monthly invoicing, and Net 30 describe affiliate arrangements only. Do not promise advice, licensing, exemption from registration, benefit eligibility, sector coverage, or third-party endorsement. Do not add public email or telephone details, registered-agent information, an unverified NAICS classification, or company social URLs. Jake’s 12 owner-approved profiles belong only to his Person entity; unrelated professional roles are not Cobalt titles.

The possible 2027 external offering remains an internal roadmap item. Before external marketing, the HR director and appropriate counsel must review the actual model, Massachusetts agency licensing/registration and PEO rules, contracts, insurance, ADP arrangements, and operational readiness. This repository makes no legal determination. An accountant or appropriate classification professional must confirm NAICS; no replacement has been selected and no filings have been changed.

## Local work and checks

Use Node meeting `package.json` engines and the committed npm lockfile. The September review ran on Node 25.8.1 and npm 11.11.0; use a supported Node release meeting the engine floor in hosting.

```sh
npm ci
npx playwright install chromium webkit
npm run typecheck
npm run lint
npm test
npm run check:output
npm audit
npm run build
npm run preview
git diff --check
```

Preview serves `http://127.0.0.1:4173` with real file content types and a real 404 for missing paths. `npm run dev` provides Vite development tooling; the release metadata and pre-rendered HTML are produced by `npm run build`, so use production preview for SEO checks. `npm test` builds production plus ignored fixtures with a fake anonymous token and a blank endpoint, then runs Chromium and WebKit regression tests. This covers both configured and unavailable forms without changing the real production build settings. All external browser traffic is blocked or locally fulfilled; **no real form submissions are sent**. The independent build guard tests fail before writing files when credentials or unsupported public variables are supplied. Both generated form-fixture directories are excluded from lint so checks also work after a test run.

The dependency lock was refreshed to address audit findings. `esbuild` is pinned to 0.28.2, with an override keeping Vite’s copy on the same corrected version. Reassess the override when updating Vite; run the complete build and regression suite when changing it.

## Contact configuration — owner activation remains

**Local code supports FormSubmit; deployment is not ready.** `VITE_FORM_ENDPOINT` is blank in the current production build, so the only public contact method remains honestly disabled. Earlier read-only AWS evidence found no endpoint at app or `main` branch level; no hosting setting was changed. No real recipient or token has been supplied, activated, or used here.

Cobalt’s approved provider is **FormSubmit**, using its invisible-email alias. It does not require a conventional account. The only accepted production endpoint format is:

```text
https://formsubmit.co/ajax/{anonymous-token}
```

The token must be **16–128 ASCII letters, digits, hyphens, or underscores**. The validator checks the original string, allowing only HTTPS, the exact `formsubmit.co` hostname, and one token immediately after `/ajax/`. It rejects raw or percent-encoded recipient addresses, `@`, percent encoding, additional segments, query strings, fragments, credentials, spaces/newlines, dots/traversal, ports, lookalike hosts, HTTP, protocol-relative URLs, API/archive routes, and other providers. An exactly blank value disables the form; whitespace-only configuration fails the build. Rejected values are never printed.

**`VITE_FORM_ENDPOINT` is public build configuration, not a secret.** Vite embeds `VITE_*` values in the browser bundle. The invisible-email alias is intentionally public; Cobalt’s actual recipient must stay private. Never substitute a recipient, API/archive key, or credential for the alias. Syntax validation cannot establish the provenance of an opaque string: the owner must obtain it through the invisible-email activation workflow. `VITE_FORM_KEY` and all other unsupported nonempty `VITE_*` variables remain rejected. No new secret variable is needed. `.env.example` contains only the blank endpoint assignment and explanatory comments.

Required owner-controlled activation and release sequence:

1. Select a private recipient email address without adding it to the repository, examples, tests, logs, or public configuration.
2. Initiate FormSubmit activation through an owner-controlled temporary workflow, without committing or permanently deploying the raw-email endpoint. This step sends an external request and has not been authorized or performed here.
3. Confirm the activation email.
4. Obtain FormSubmit’s **invisible-email random token**, not an archive API key.
5. Set the Amplify **main branch** variable to `VITE_FORM_ENDPOINT=https://formsubmit.co/ajax/{actual-token}` using that alias.
6. Rebuild, run all checks, and deploy through the separately authorized release process. Install the existing redirect rules and verify live behavior.
7. After **separate authorization**, send one clearly labeled QA submission from the live Cobalt website.
8. Confirm actual receipt at the private recipient. Provider acceptance alone does not prove receipt.
9. Verify that the raw recipient is absent from public HTML, JavaScript, source maps, metadata, schema, network configuration, and documentation. No source maps should be deployed.

FormSubmit documents [email confirmation and no-registration setup](https://formsubmit.co/), [invisible-email aliases, `_honey`, templates, and its 30-day archive](https://formsubmit.co/documentation), and [AJAX requests](https://formsubmit.co/ajax-documentation). The configured website links to the requested [provider privacy information](https://formsubmit.co/privacy). During this review that URL returned a generic “Form should POST” page; FormSubmit’s documentation footer instead linked a [privacy PDF](https://formsubmit.co/privacy.pdf). The requested URL remains unchanged in configuration. The owner must resolve the privacy-link discrepancy and review current provider information before enabling public collection.

**No spam protection is disabled.** The adapter supplies no CAPTCHA override. If activation, CAPTCHA, or other live behavior prevents an anonymous AJAX submission from being accepted and delivered, release remains blocked pending a reviewed compatible flow; mocked success must not be used to waive that blocker.

The request is `POST` with `Accept: application/json`. Fields are visitor `name`, `email`, `message`, optional `company`, `_subject` = `Cobalt website inquiry`, `_template` = `table`, `_url` = `https://www.cobaltemployment.com/#contact`, and `_honey`. Blank organizations are omitted. No `_cc`, `_autoresponse`, recipient, API key, invented redirect, attachment, or sensitive browser/device field is added. Requests omit credentials and referrer data and refuse redirects.

Acceptance requires an HTTP success, valid JSON object (not null or an array), `success` equal to boolean `true` or string `"true"`, and **no `error` or `errors` property**, even if empty or null. HTTP 200 alone, false/missing/other success values, HTML, malformed JSON, redirects, activation/CAPTCHA pages, network failures, and the 20-second timeout all remain unconfirmed. Failure preserves the entered data and provides an accessible retry message without endpoint details. Confirmed acceptance resets the form, focuses the live status, says only “accepted for delivery,” and blocks repeat submissions with a synchronous guard. Required/email/whitespace checks, local honeypot rejection, and no-JavaScript disabling are preserved.

Configured privacy copy identifies FormSubmit as processing submissions for delivery to Cobalt’s privately configured recipient. It attributes the provider’s **30-day submission archive** statement to FormSubmit, separately from Cobalt’s own records, and promises no Cobalt-controlled deletion deadline. Warnings against Social Security numbers, payroll records, medical information, and sensitive documents remain. Disabled builds say that no form information is transmitted.

## Pages, indexing, and deployment

- `/`: fully pre-rendered homepage; one self-canonical, indexable metadata, one connected Organization/WebSite/WebPage/Person graph.
- `#operations`, `#approach`, `#about`, `#jake-greasley`, `#contact`, `#privacy`, and `#terms`: sections of the homepage, not separate routes or sitemap entries.
- `/404.html`: standalone pre-rendered error document, `noindex, follow`, no canonical, no entity graph, no application JavaScript. A missing URL must serve this document with **HTTP 404**. The directly accessed static file may have HTTP 200 but remains noindex and absent from the sitemap.
- `/robots.txt`, `/sitemap.xml`, existing PNG icons, JavaScript, CSS, and locally served fonts are real static files.
- The sitemap contains only the canonical homepage. There is no SPA fallback.

`amplify.yml` runs locked installation, lint/type checks, production build, and built-output scanning. Upload only `dist`; never upload docs, test reports, `.test-dist`, source environment files, or server-rendering intermediates.

**Repository files do not update Amplify console redirects.** After reviewing the release, the hosting owner must manually replace the entire ruleset with `amplify-redirects.json`:

```json
[
  {
    "source": "https://cobaltemployment.com",
    "status": "301",
    "target": "https://www.cobaltemployment.com",
    "condition": null
  },
  {
    "source": "https://main.d22dxgvoxraolf.amplifyapp.com",
    "status": "301",
    "target": "https://www.cobaltemployment.com",
    "condition": null
  },
  {
    "source": "/index.html",
    "status": "301",
    "target": "/",
    "condition": null
  },
  {
    "source": "/<*>",
    "status": "404",
    "target": "/404.html",
    "condition": null
  }
]
```

The exact production host `main.d22dxgvoxraolf.amplifyapp.com` was established through read-only AWS app metadata for this GitHub repository, the existing `main` production branch, and a public GET whose body matched the canonical site. No hostname was guessed and no AWS settings changed.

AWS documents domain-only source redirects with automatic path preservation; do not append paths to the source hostname. Keep the not-found rule last so existing files retain their content types. See [AWS redirect guidance](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html) and [AWS examples](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html).

A production deployment was **not authorized or performed** in this review. Owner release sequence: complete private activation, confirmation, anonymous-token acquisition, branch configuration, and a fresh build; run all checks; authorize release through the existing Amplify process; install the redirect rules; verify live behavior and, after separate authorization, send one clearly labeled QA message and confirm receipt. The full activation sequence and confirmed live receipt are required before declaring the release ready. Check the build runtime and domain/TLS settings in Amplify without enabling a broad SPA rewrite.

## Post-deployment verification

Use GET requests, not only HEAD, and inspect both status and body:

```sh
curl -sS -D - -o /dev/null https://cobaltemployment.com/
curl -sS -D - https://www.cobaltemployment.com/
curl -sS -D - https://www.cobaltemployment.com/robots.txt
curl -sS -D - https://www.cobaltemployment.com/sitemap.xml
curl -sS -D - https://www.cobaltemployment.com/release-check-missing
curl -sS -D - -o /dev/null https://www.cobaltemployment.com/favicon-512.png
```

Confirm both apex→www and the exact Amplify-host→www redirect are 301 and preserve paths and query strings; `/index.html` redirects to `/`; root is 200 with exactly one canonical and one graph; missing extensionless and asset paths are 404 with the error page, never the homepage. Confirm robots is `text/plain`, sitemap is XML, assets have appropriate MIME types, and the 512×512 logo is publicly fetchable. Test desktop/mobile, keyboard access, direct policy anchors, reduced motion, and the form’s configuration and provider disclosure. Do not use the public contact form for automated tests.

Set up a **Google Search Console Domain property** for `cobaltemployment.com` through owner-controlled DNS verification. Submit `https://www.cobaltemployment.com/sitemap.xml`, inspect the live canonical homepage, request indexing after the corrected release, and monitor page-indexing reports and selected canonicals. No verification token has been invented. Recheck the logo and graph with Google’s Rich Results Test and Schema Markup Validator; local parsing is not a guarantee of indexing or a rich result. [Google’s Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization) supports explicit, accurate organization identity and representative, crawlable logo data.

## External identity and social follow-up

Create a LinkedIn Company Page **after** the corrected site is deployed. Use the exact company name, legal name where supported, canonical website, Marlborough headquarters, 2026 founding year, affiliate-only description, existing logo, and Jake as Founder and President. Connect it to Jake’s real LinkedIn experience. Verify that URL before adding Organization `sameAs`. Consider Crunchbase once the website and LinkedIn agree. Do not create empty Facebook, Instagram, or X accounts solely for SEO. Create a Google Business Profile only if the company actually meets Google’s [in-person customer-contact eligibility](https://support.google.com/business/answer/13763036?hl=en); a headquarters address alone is insufficient evidence.

See [the September 8 review](docs/release-review-2026-09-08.md) for production evidence, profile-by-profile evidence and owner approval, research sources, corrections, release blockers, and checks. No third-party profiles, social accounts, external settings, or government records were changed.
