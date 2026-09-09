# Cobalt Employment Group — release review

**Review date:** September 8, 2026  
**Repository:** `/Users/jake/Repos/Cobalt`  
**Scope:** entity identity, factual accuracy, regulatory copy, technical SEO, contact privacy, accessibility, routing, dependency hygiene, and release readiness.

**Disposition: code corrected locally; NOT ready for deployment.** The form is the only public contact channel and remains disabled without its endpoint. Release requires the full activation/receipt sequence below plus owner-controlled Amplify redirect configuration and live verification. No legal determination is made. Nothing was committed, pushed, deployed, submitted through a real form, or changed in any external account or government record.

## Anonymous FormSubmit adapter changes

**Code readiness: ready for owner configuration and review; all local validation passes. Deployment readiness: blocked.** The current production build is deliberately disabled without the anonymous endpoint. No provider activation or actual receipt has been verified.

12 existing files were updated in this provider pass. No baseline file was deleted, no dependency version or lockfile changed, and the identity graph snapshot and redirect JSON remain byte-for-byte unchanged.

- `src/site.ts`: replaced the previous provider configuration with FormSubmit’s documentation/privacy URLs, subject, and attributed archive-retention wording; enforced the exact anonymous AJAX endpoint and 16–128 character token rule, with redacted errors and honest blank configuration.
- `src/ContactForm.tsx`: renamed the honeypot to `_honey`; added `_subject`, `_template`, and canonical `_url`; omitted an empty optional organization; adopted boolean/string `success` acceptance with no error fields; rejected redirects/array payloads; added a synchronous post-acceptance duplicate lock. Existing validation, timeout, accessible statuses, retry preservation, and no-JavaScript disabling remain.
- `src/App.tsx`: disclosed delivery to the privately configured recipient and the provider’s stated 30-day submission archive, separate from Cobalt’s own records. Sensitive-data warnings and conditional disabled-build disclosures remain.
- `src/form-config.ts` and `.env.example`: clarified public aliases and private recipient handling; the example has only `VITE_FORM_ENDPOINT=` plus comments. Unsupported public variables remain rejected.
- `scripts/build.mjs`: replaced the configured fixture with the supplied fake anonymous token; production configuration remains blank.
- `scripts/check-output.mjs`: permits only the anonymous provider endpoint and approved informational links; rejects unsafe recipient/API endpoints, credentials, source maps, and retired-provider text with values redacted.
- `tests/form.spec.ts`, `tests/output.spec.mjs`, and `tests/site.spec.ts`: expanded acceptance, adverse-response, payload, privacy, honeypot, duplicate, redaction, endpoint-validation, and build-rejection coverage. The retired hostname is assembled only inside negative regression checks; no retired-provider literal remains in maintained files or generated output.
- `README.md` and this report: replaced obsolete provider instructions with the nine-step activation/receipt sequence, accurate account/retention wording, public-token rules, spam-protection constraints, and the observed provider privacy-link discrepancy.

## Earlier identity correction pass

13 of the existing 30 uncommitted files received targeted changes; no baseline file was removed and the dependency lockfile remained unchanged in this final pass.

- `src/site.ts`: corrected the title and legal-name description, removed the repeated primary alternate name, added `worksFor`, and restored the exact 12 owner-approved URLs, including NAR and the approved RealSatisfied host. Stable identifiers and Organization `founder` are preserved.
- `src/App.tsx` and `src/index.css`: explicit Founder and President identity sentence and a restrained native profile disclosure with visible, keyboard-accessible links, role/endorsement clarification, and responsive columns.
- `src/form-config.ts` and `.env.example`: clarified public Vite configuration, private provider recipient handling, branch setup, and required rebuild/authorized QA receipt gates; production endpoint remains blank.
- `amplify-redirects.json`: added the proven production Amplify hostname immediately after the apex rule and `condition: null` to every rule; custom 404 remains last.
- `tests/site.spec.ts`: corrected-title, legal name, stable graph connections, exact-set/no-duplicate/Person-only profiles, no-JavaScript disclosure, expanded responsive accessibility, and complete ordered redirect assertions.
- `tests/output.spec.mjs` and `scripts/check-output.mjs`: expanded unsafe configuration rejection and added a generated-output unsafe-provider-endpoint regression guard. No real form request is sent.
- `eslint.config.js`: excluded the generated blank-form fixture, fixing lint after repeat test runs without weakening source rules.
- `README.md`, this report, and `docs/homepage-graph-2026-09-08.json`: corrected all current title/profile/relationship statements, documented the confirmed hostname and contact release gates, retained the MarketScreener stale-career concern, and refreshed the graph from actual built HTML.

## Starting evidence

Git was clean on `main` at the start of the initial review. The focused final pass began with all 30 first-pass changed files already uncommitted and preserved that work with targeted edits; nothing was discarded, reverted, or staged. Existing ignored build output, installed dependencies, and generated Amplify output were present. This pass did not modify ignored Amplify account output. The application is React 18.3 with TypeScript and Vite 7, installed from `package-lock.json`; `amplify.yml` publishes `dist`. No backend, contact-provider account, careers workflow, authentication, or database is implemented or imported. No `.openai/hosting.json` or applicable `AGENTS.md` was found.

Fresh production GET observations:

| Request | Observed September 8 behavior |
| --- | --- |
| `https://cobaltemployment.com/` | HTTP **302**, Location `https://www.cobaltemployment.com/` |
| Canonical www homepage | HTTP 200, `text/html`; obsolete Massachusetts-business title/description; no canonical link; JavaScript shell |
| `/robots.txt` | HTTP **404**, `text/html`, **same homepage body** |
| `/sitemap.xml` | HTTP **404**, `text/html`, **same homepage body** |
| `/cobalt-review-missing-20260908` | HTTP **404**, `text/html`, **same homepage body** |
| `/favicon-512.png` | HTTP 200, `image/png`, actual 512×512 PNG |

The root and three missing-path responses shared the body SHA-256 prefix `1c7f18dea14463dc`. Thus this audit observed real HTTP 404 statuses with misleading homepage bodies, **not** HTTP 200 for every unknown path. The supplied `404-200` rule nonetheless needed replacement, and discovery files were absent. Existing production JavaScript still contained the consultation CTA and unavailable-submission path. The form-specific delivery code was not configured in the deployed bundle; AST inspection found only the module-preload fetch call, not a configured form request. No form was submitted to establish that finding.

## Factual and regulatory-copy corrections

Owner-confirmed facts are the authority for Cobalt’s identity and operating model. This pass does not imply an independent Massachusetts filing certification.

- Public name: **Cobalt Employment Group**. Legal name: **Cobalt Employment Group LLC**. Massachusetts entity identification number **001941552**, kept as a string with its leading zeros.
- Organization date and public founding date: **January 14, 2026** / `2026-01-14`, visible in About and At a glance, and used in schema.
- Headquarters standardized to **420 Lakeside Avenue, Suite 303, Marlborough, MA 01752** in every visible occurrence and the PostalAddress.
- Final visible identity sentence: **“Jake Greasley, legally Jacob Charles Greasley, is the Founder and President of Cobalt Employment Group LLC.”** The heading uses **Founder and President**; the founding-history paragraph is preserved. The owner’s corrected title supersedes the initial title wording. Unrelated professional roles remain separate from Cobalt.
- Hero: **“A capable team behind our teams.”** Eyebrow: **“Affiliated businesses · Massachusetts.”** Introductory positioning explicitly limits the work to affiliated businesses and names ADP TotalSource.
- Replaced outside-customer Services with **Operations**: employment/onboarding, payroll coordination, benefits administration, and HR operations, all scoped to Cobalt’s affiliate workforce.
- Removed outside-client EOR positioning, “worksite employer of record,” “assigned personnel,” public recruiting/placement language, “you direct the work,” and the “Request a consultation” sales CTA. Actions now lead to About and internal operations; contact is for organizational/privacy inquiries.
- Removed the unconfirmed industry target list, including regulated insurance/financial-service role implications; unverified operating-hours, geographic reach, deliberately-small/headcount, and specific I-9/E-Verify/benefit/filing claims were also removed.
- Corrected ADP wording to **“ADP TotalSource is Cobalt’s PEO provider, providing PEO/co-employment support.”** No ADP-as-EOR or marketing “partner” terminology remains. No ownership, representation, resale, or endorsement is implied.
- Preserved actual-cost reimbursement, no hidden margin, monthly invoices, and Net 30 **inside the affiliate operating model**. Website terms say these are internal arrangements, not public pricing or an outside-customer offer.
- Explicit boundary statement: **“Cobalt does not currently offer staffing, placement, recruitment, employer-of-record (EOR), professional employer organization (PEO), or workforce-administration services to unrelated outside clients.”** No license, registration, or exemption claim is made.
- Removed unverified **NAICS 541611** from all public output; no replacement was selected. Classification is an internal professional-review item only.
- No public recipient email, public telephone, company social `sameAs`, registered-agent information, unsupported reviews/ratings, awards, employee/customer counts, or 2027 launch promises were introduced.
- Response expectation remains **“Inquiries generally receive a response within one business day.”** The form is not a general job application and requests no résumés.

ADP’s [PEO explanation](https://www.adp.com/what-we-offer/hr-outsourcing-and-peo/professional-employer-organization.aspx) describes co-employment and distinguishes it from EOR. Massachusetts maintains separate [employment/placement/staffing program guidance](https://www.mass.gov/employment-placement-and-staffing-agencies-program), [agency licensing/registration guidance](https://www.mass.gov/info-details/register-apply-for-or-renew-a-dls-employmentplacement-agency-license), and [PEO registration guidance](https://www.mass.gov/info-details/applications-for-registration-or-renewal-of-peos). Direct Mass.gov requests were blocked, but the official pages were readable through the search tool’s indexed primary-source content. These sources informed terminology and the review checklist; they do **not** establish Cobalt’s regulatory obligations or an exemption.

## Entity graph and search metadata

The final graph is extracted from the built homepage in [homepage-graph-2026-09-08.json](homepage-graph-2026-09-08.json). It is an audit snapshot; `src/site.ts` remains the source for future builds.

| Node | Stable identifier | Connections |
| --- | --- | --- |
| Organization | `https://www.cobaltemployment.com/#organization` | `founder` → Jake |
| WebSite | `https://www.cobaltemployment.com/#website` | `publisher` → Organization |
| WebPage | `https://www.cobaltemployment.com/#webpage` | `isPartOf` → WebSite; `about`, `mainEntity`, `publisher` → Organization |
| Person | `https://www.cobaltemployment.com/#jake-greasley` | `worksFor` and `affiliation` → Organization; all 12 owner-approved personal profiles |

Only `Organization` is used for Cobalt; there are no EmploymentAgency, ProfessionalService, StaffingAgency, LocalBusiness, or PEO-specific nodes. It includes public/legal names, homepage URL, confirmed date/address, labeled PropertyValue entity ID, and a representative ImageObject logo. The existing square icon already exceeds Google’s [112×112 minimum and crawlability requirements](https://developers.google.com/search/docs/appearance/structured-data/organization); no redesign or generated logo was needed.

Person fields are public `name` Jake Greasley, `givenName` Jacob, `additionalName` Charles, `familyName` Greasley, alternate names **Jacob Greasley / Jacob Charles Greasley** (no repeated primary name), `jobTitle` **Founder and President**, and the same identity sentence used visibly, including Cobalt’s legal name. `legalName` is not incorrectly attached as an unsupported Person-specific property. `worksFor` reflects the owner-confirmed current President role; Organization `founder` still points to Jake, and the existing `affiliation` connection is preserved. No identifier on an unverified personal domain is used.

The homepage contains exactly one canonical, `https://www.cobaltemployment.com/`, and one JSON-LD graph. Final title: **“Cobalt Employment Group — Workforce administration for affiliated businesses.”** Description: **“Cobalt Employment Group coordinates employment, payroll, benefits, and HR operations for affiliated businesses from Marlborough, Massachusetts.”** Open Graph uses the same canonical URL, absolute logo URL, type website, en_US locale, and descriptive alt text. Twitter/X uses a summary card and absolute image; no account handle is invented. Language is en-US; theme color remains Cobalt blue. Existing favicon and Apple touch icon references and all logo dimensions are explicit.

## Founder profile audit

All 12 exact URLs below are owner-approved and are now included in Person `sameAs` and the visible native **“Jake Greasley profiles”** disclosure. The disclosure works with a keyboard and without JavaScript, and explains that other roles are separate from Cobalt and the platforms do not describe or endorse Cobalt. Initial HTTP/browser observations below remain useful accessibility evidence; bot challenges, rate limits, and client-rendered shells do not override owner confirmation. No third-party profile was edited.

| Approved profile | Outcome and evidence | Graph |
| --- | --- | --- |
| [LinkedIn](https://www.linkedin.com/in/jake-greasley) | Direct HTTP 200, title identifies Jake Greasley, Greater Boston. Web reader alone was blocked. | Included |
| [GitHub](https://github.com/JakeGreasleyGIM) | HTTP 200 and readable profile identifies Jake Greasley. | Included |
| [Instagram](https://www.instagram.com/jake.greasley/) | Direct HTTP 200, title identifies Jake Greasley and @jake.greasley. Web reader alone was blocked. | Included |
| [eXp Realty](https://ma.exprealty.com/agents/1903443/Jacob+Greasley) | Raw HTTP 403; fresh browser and web reader display Jacob Greasley, eXp Realty in Massachusetts. | Included |
| [NAR member directory](https://directories.apps.realtor/memberDetail/?personId=4940266&officeStreetCountry=US&memberLastName=Greasley) | Initial HTTP 200 client-rendered shell did not reveal identity. Owner confirms Jake’s NAR member ID **4940266**. | Included |
| [MassLandlords](https://masslandlords.net/landlord/jacob-greasley/) | HTTP 200 with Jacob (Jacob) Greasley title; readable profile identifies Jacob Greasley. No third-party contact details copied. | Included |
| [Realtor.com](https://www.realtor.com/realestateagents/656d3c88398ad2f645a8b94b) | Indexed reader identified Jake; initial direct 429/browser limitation. Owner confirms the profile currently identifies Jake/Jacob. | Included |
| [Homes.com](https://www.homes.com/real-estate-agents/jacob-greasley/kz9yngc/) | Indexed reader identified Jacob; initial direct 403/browser limitation. Owner confirms the profile currently identifies Jake/Jacob. | Included |
| [Showcase](https://www.showcase.com/p/jake-greasley/253290651/) | Raw HTTP 403; fresh browser displays Jake Greasley, GIM Property Management, Marlborough. | Included |
| [RateMyAgent](https://www.ratemyagent.com/real-estate-agent/jacob-greasley-b2ng7z/sales/overview) | Initial 403/device challenge; no CAPTCHA bypassed. Owner confirms the profile currently identifies Jake/Jacob. | Included |
| [RealSatisfied](https://profile.realsatisfied.com/Jacob-Greasley) | Initial redirect/browser check identified Jacob Greasley, eXp Realty. Owner confirms this exact `profile.realsatisfied.com` URL is the canonical identity URL to publish; the redirect destination is not substituted. | Included using exact approved URL |
| [MarketScreener](https://www.marketscreener.com/insider/JAKE-GREASLEY-A3LLV6/) | Raw HTTP 403; reader/browser identify Jake Greasley. **Stale career-data concern:** older career entries must not be treated as his current Cobalt roles. Owner confirms the same person; retained as identity evidence. | Included |

The centralized source and actual generated graph are tested against an independent exact 12-value set, with no duplicates. Only Jake’s Person node has `sameAs`; Cobalt still has no company social profiles. All four previously omitted profiles are restored. The exact URL spellings above, including query parameters and trailing slashes, are preserved.

## Fresh external entity search

Queries run: `"Cobalt Employment Group"`, `"Cobalt Employment Group LLC"`, `"Cobalt Employment" Massachusetts`, `"Cobalt Employment Group" Jake Greasley`, `"Cobalt Employment Group" Jacob Greasley`, `site:cobaltemployment.com`, plus `"Colbalt Employment Group"`, `"Cobolt Employment Group"`, Marlborough combinations, and Cobalt recruitment variants.

The available search results did not supply a reliable independent exact-match Cobalt Employment Group entity record or a useful indexed-URL list for the canonical domain. They frequently broadened into unrelated Cobalt recruitment listings, employment-law content, construction postings, and mineral-related jobs. This is a visibility/disambiguation concern, **not proof that Google has no indexed page**, nor a company-registration search. Search Console is the appropriate owner-controlled follow-up.

The main collision risk is [Cobalt Recruitment’s US site](https://www.cobaltrecruitment.com/), which publicly recruits in finance, real estate, construction, and renewable energy. Its [UK recruitment services](https://www.cobaltrecruitment.co.uk/cm/about-us/how-we-can-work-with-you) likewise solicit outside employers and candidates. Those services, longevity, offices, contacts, and placement claims do not describe this Massachusetts LLC. The corrected legal name, founding date, Marlborough headquarters, entity ID, founder relationship, and affiliate-only description help distinguish Cobalt Employment Group. This is an inference from the contrasting primary websites, not a claim of a formal trademark clearance.

Search summaries and unrelated results were used only for discovery. No third-party company fact was imported into the website.

## Form, privacy, and release configuration

The approved provider is **FormSubmit**, with the public invisible-email AJAX endpoint `https://formsubmit.co/ajax/{anonymous-token}`. The alias must be 16–128 ASCII letters/digits/hyphens/underscores. It is intentionally visible in the browser bundle; Cobalt’s recipient is never included. No conventional FormSubmit account is claimed, no real alias is invented, and no activation or submission was performed. `VITE_FORM_ENDPOINT` remains blank and `VITE_FORM_KEY` remains rejected.

The original-string allowlist rejects non-HTTPS schemes, alternate hosts or ports, credentials, raw/encoded recipients, `@`, percent encoding, query/fragment components, extra segments, malformed or overlong tokens, whitespace, dots/traversal, and API/archive routes. Other form providers are rejected. Syntax alone cannot identify a credential masquerading as an opaque alias: the owner must supply the invisible-email token obtained through confirmation, never an archive API key. Error output does not print rejected configuration values.

The request uses `POST`, requests JSON, omits credentials/referrer information, refuses redirects, and includes only visitor name/email/message, optional organization (`company`), `_subject` = `Cobalt website inquiry`, `_template` = `table`, canonical `_url` = `https://www.cobaltemployment.com/#contact`, and `_honey`. There is no `_cc`, `_autoresponse`, recipient, key, redirect field, attachment, device field, or CAPTCHA-disabling override. Local honeypot rejection remains honest.

Provider acceptance requires a successful HTTP response with a valid non-array JSON object, `success: true` or `success: "true"`, and neither `error` nor `errors` present. HTML, redirects, activation/CAPTCHA pages, malformed/null/array/scalar JSON, false or missing success, error-bearing payloads, timeouts, and network failures are unconfirmed. Failure preserves all visitor fields and allows retry. Only confirmed acceptance resets the form, focuses accessible status, reports “accepted for delivery,” and permanently locks that rendered form against duplicate submission. This does not establish receipt or reading by Cobalt.

Configured privacy copy identifies FormSubmit as the delivery processor for Cobalt’s privately configured recipient. It attributes the **30-day submission-archive retention** statement to [FormSubmit’s documentation](https://formsubmit.co/documentation), without promising that Cobalt controls the provider’s deletion timing. Cobalt’s own received-record retention remains separately described. Sensitive-data warnings, hosting disclosures, no-JavaScript safety, and the disabled-state disclosure are preserved. No public email/telephone or third-party tracking is added.

The requested [FormSubmit privacy-information URL](https://formsubmit.co/privacy) currently renders a generic “Form should POST” response. The documentation footer links the provider’s [privacy PDF](https://formsubmit.co/privacy.pdf). The requested configured URL is retained; the owner must resolve this discrepancy and review current provider information before enabling public collection. [AJAX documentation](https://formsubmit.co/ajax-documentation) describes browser requests; [the setup page](https://formsubmit.co/) describes confirmation without conventional registration. No live provider-delivery claim is made from these documents.

**Owner-controlled activation and release sequence — outstanding:**

1. Select the private recipient without placing it in the repository, public files, examples, tests, or logs.
2. Initiate activation using a temporary owner-controlled workflow, without committing or permanently deploying a raw-email endpoint.
3. Confirm the activation email.
4. Obtain the invisible-email random token, not an API/archive key.
5. Set `VITE_FORM_ENDPOINT=https://formsubmit.co/ajax/{actual-token}` in the Amplify `main` branch environment.
6. Rebuild, validate, and deploy after separate release authorization; install the existing redirect rules.
7. After separate authorization, send one clearly labeled QA submission from the live Cobalt site.
8. Confirm actual receipt at the private recipient.
9. Check public HTML, JavaScript, source maps, metadata, schema, network configuration, and documentation for raw-recipient exposure; deploy no source maps.

**Code readiness and deployment readiness are separate.** Local tests establish adapter behavior only. The anonymous production endpoint is absent, activation is unperformed, live receipt is unconfirmed, and the privacy-link discrepancy is unresolved. Deployment is therefore **not ready**. If live CAPTCHA/activation behavior prevents compatible AJAX delivery, keep release blocked; do not disable provider spam protections to force success.

## Routing and complete Amplify replacement

Privacy and terms are homepage sections with fragment links. They require no client-side routes and inherit the homepage canonical. `robots.txt` permits crawling and points to the canonical sitemap. The sitemap contains only `/`, with no anchors, 404 URL, or fabricated modification dates.

The standalone `404.html` has noindex/follow, no canonical, no Organization graph, and no application script. Existing resources are served normally; all missing paths must return the dedicated document with HTTP 404. A browser-only defensive guard also replaces accidentally rewritten homepage content at an unknown URL, but that cannot replace correct server status handling.

Read-only AWS `list-apps` matched this GitHub repository to app **Cobalt / d22dxgvoxraolf** and default domain `d22dxgvoxraolf.amplifyapp.com`; `get-branch` confirmed the existing **main / PRODUCTION** branch. A GET of `https://main.d22dxgvoxraolf.amplifyapp.com/` returned 200 with the exact same SHA-256 body as the canonical site (`1c7f18dea14463dc…`). This establishes the exact hostname without guessing. The current host is publicly serving the old site; its proposed 301 is not installed.

The owner must replace the **entire** Amplify console ruleset with:

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

These rules follow [AWS’s redirect setup](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html) and [custom-404/domain-source examples](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html). Domain sources do not include a path; AWS appends paths. The final pass also verified live apex GETs for `/robots.txt?cobalt_release_qa=20260908` and `/deep/path?cobalt_release_qa=20260908`: both preserve path and query but still return **302**, confirming that a later console update is necessary. Local tests enforce all four ordered rules, including `condition: null`, and verify artifacts and static-file behavior; they do **not** claim the proposed rules are installed remotely. Live status, MIME types, apex path/query preservation, and missing-resource handling must be checked after the owner’s later deployment.

## Verification

The test suite parses actual built HTML, loads actual bundled assets, uses JavaScript-disabled contexts, and exercises the production form component with local provider responses. It checks adverse behavior and entity/public-copy boundaries rather than source snapshots. Initial failures led to a 320px navigation spacing fix and test-runner adjustments for macOS Safari’s Option-Tab and Playwright’s special handling of noscript text. Browser binaries were installed before the final runs. A dependency reinstall interrupted one intermediate run; it was rerun after installation completed.

Final provider-pass verification results are recorded below. Intermediate test-harness issues involving a DOM type, whitespace-only diagnostic assertions, and WebKit redirect interception were corrected; redirects are now tested with a real local HTTP response in both engines. The final provider-change test run completed on September 8, 2026 at approximately **23:52 UTC**. Installation finished before validation began. Repeat-run lint initially found that the generated blank-form fixture was not excluded; the final configuration now excludes it, and type checks plus zero-warning lint passed after both fixture builds existed. The output scanner reports categories and file names, never matched credential values. It also proves detection using a disposable dummy credential. Local test results and screenshots are ignored and not part of the deployable site.


### Final commands and results

| Command / inspection | Final result |
| --- | --- |
| `npm ci --cache .npm --prefer-offline` | Passed against the updated lockfile; 191 packages installed, 192 audited |
| Chromium / WebKit test engines | Chromium 153 and WebKit 26.6 installed during the initial pass and reused successfully |
| `npm run typecheck` | Passed for application, Vite configuration, Playwright configuration, and TypeScript tests |
| `npm run lint` | Passed, zero warnings |
| `npm test` | **84 passed, 0 failed, 0 skipped, 0 flaky** across Chromium and WebKit; final provider-pass run 30.3 seconds |
| `npm run build` | Passed as part of the final complete test run; TypeScript + browser build + server rendering; generated real `dist/index.html`, `404.html`, `robots.txt`, `sitemap.xml` |
| `node scripts/build.mjs --test-form` | Passed; ignored fixture with fake anonymous AJAX token; no real activation or recipient |
| `node scripts/build.mjs --test-empty` | Passed; ignored blank-endpoint fixture, independent of deployment configuration |
| `npm run check:output` | Passed on final production HTML/JS/CSS/discovery files; no private recipient, telephone, credential patterns, unsafe email/API endpoints, retired-provider text, excluded copy, NAICS, or registered-agent information found; configured and blank fixtures also passed |
| Public-source privacy/credential scan | Passed across 9 source/template files; zero findings; no matched values printed |
| `npm audit` | **0 vulnerabilities**; initial audit had 8 (6 high, 2 low) |
| `git diff --check` | Passed |
| `git diff --cached --quiet` | Passed; no staged changes |
| Python JSON parse and graph comparison | Four graph nodes; all three built homepages exactly match the preserved graph snapshot, including the 12 profiles and current organizational role |
| Python `xml.etree.ElementTree` parse | Valid sitemap XML with only `https://www.cobaltemployment.com/` |
| Read-only AWS app/branch metadata and public GETs | Earlier pass established the exact main hostname and matching homepage body; no form endpoint at app/branch level; apex paths/queries preserved with current 302. Initial bundle AST evidence retained above; no production submissions |
| Local static previews (`node scripts/serve.mjs`) | Correct static file MIME types, 301 index alias, dedicated 404 for unknown paths; all 22 files from both production and configured fixture also fetched successfully with matching bodies and content types |
| Browser rendering and axe WCAG A/AA checks | Passed at 320, 390, 768, and 1440 pixels in both engines; eight additional configured-form layout/axe inspections also passed with zero violations and no horizontal overflow |
| Keyboard and reduced-motion checks | Passed, including native profile disclosure toggle and all 12 visible links without JavaScript; macOS WebKit uses Option-Tab to include links |
| Layout-shift / third-party request check | Local Chromium CLS approximately **0.0101**; no external page-load requests. WebKit does not expose the same LayoutShift API, so no equivalent numerical CLS claim is made |
| Manual visual inspection | Prior identity/full-page review retained; final configured contact form at 320px and updated desktop privacy/retention copy visually inspected, and the blank production state confirmed in both engines |

The 84 automated checks include real response-body parsing, the corrected title/legal-name sentence, all four stable IDs and graph relationships, exact 12-profile set and node ownership with no duplicates, 33 unsafe endpoint cases plus two unsupported-variable build-rejection cases in each engine, positive alias validation, exact POST fields, both accepted success types, false/error/non-JSON/activation/CAPTCHA responses, and real local redirect rejection, schema omissions and founder connections, canonical consistency, truthful copy, resource/route behavior, no-JavaScript safety, form success/rejection/error/timeout/duplicate/spam handling, secret-build rejection, a scanner detection canary, keyboard focus, accessibility, and responsive rendering. This is an automated/manual local release review, not a full assistive-technology certification or real-world performance guarantee. Remote Amplify rule execution, Search Console ownership/indexing, Google validator results, and actual provider delivery are intentionally left for owner action after deployment authorization.

## Owner and professional follow-up

1. **Owner / hosting:** Complete the nine activation and receipt steps above, resolve the provider privacy-link discrepancy, retain spam protections, and keep unsupported browser keys absent. Separately authorize activation, deployment, and the live QA submission; the disabled form is a release blocker.
2. **Hosting:** Install the complete redirect rules, verify runtime/TLS/domain settings, and run the README’s post-deployment GET checks. The current production site remains unchanged by this pass.
3. **Owner:** Create Search Console Domain verification through DNS, submit the canonical sitemap, inspect/request indexing of the corrected homepage, and check Google’s live structured-data and indexing tools. Search appearance is not guaranteed by valid markup.
4. **Owner:** After deployment, create a LinkedIn Company Page with exact approved names, canonical website, Marlborough location, 2026 founding year, affiliate-only description, logo, and Jake as Founder and President. Connect Jake’s real LinkedIn experience. Consider Crunchbase only after those records agree. Do not create empty Facebook, Instagram, or X accounts for SEO. Add company `sameAs` only after a real page is verified.
5. **Owner:** Only create a Google Business Profile if actual operations meet [Google’s in-person customer-contact eligibility](https://support.google.com/business/answer/13763036?hl=en). A Massachusetts headquarters alone does not establish eligibility.
6. **Accountant / classification professional:** Confirm the appropriate NAICS classification against actual operations. No replacement code or corporate, tax, banking, insurance, or government change is part of this work.
7. **HR director / appropriate counsel / ADP:** Before any possible 2027 outside offering or marketing, review Massachusetts agency and PEO registration/licensing questions, actual employer responsibilities, contracts, ADP terms, insurance, payroll/benefits operations, and readiness. The date is an internal possibility, not an announced launch or waitlist. No conclusion is made that registration is required or unnecessary.
8. **Owner:** Confirm that published privacy wording matches actual inquiry handling when enabling the form. MarketScreener’s older career data is a maintenance concern; the same-person profile remains included. No third-party identity edit was performed.

## Every maintained repository file changed

30 files were added or modified; no tracked source or brand asset was deleted.

| File | Change |
| --- | --- |
| [.env.example](../.env.example) | Documents the single public endpoint and removal of browser keys. |
| [.gitignore](../.gitignore) | Excludes local environment files, npm cache, test artifacts, and render intermediates. |
| [README.md](../README.md) | Replaces starter claims with facts, configuration, release instructions, SEO and compliance follow-up. |
| [amplify-redirects.json](../amplify-redirects.json) | Complete proposed console ruleset: permanent canonical-host redirect, index alias, true 404. |
| [amplify.yml](../amplify.yml) | Adds type checks, lint, and built-output scanning to the existing build. |
| [docs/homepage-graph-2026-09-08.json](../docs/homepage-graph-2026-09-08.json) | Exact four-node graph snapshot extracted from built HTML. |
| [docs/release-review-2026-09-08.md](../docs/release-review-2026-09-08.md) | This detailed audit, evidence, verification, changes, and outstanding actions. |
| [eslint.config.js](../eslint.config.js) | Scopes current lint rules to app, configuration, scripts, and tests. |
| [index.html](../index.html) | Minimal language/viewport template populated from the typed source during rendering. |
| [package-lock.json](../package-lock.json) | Locked dependency installation and audit fixes. |
| [package.json](../package.json) | Adds build/render/verification scripts, local fonts, test tooling, and corrected dependency pin. |
| [playwright.config.ts](../playwright.config.ts) | Chromium/WebKit coverage, isolated fixture servers, reports, and failure traces. |
| [scripts/build.mjs](../scripts/build.mjs) | Builds browser assets, pre-renders static documents, and generates discovery files. |
| [scripts/check-output.mjs](../scripts/check-output.mjs) | Targeted privacy, credential, excluded-copy, and source-map scan of final artifacts. |
| [scripts/serve.mjs](../scripts/serve.mjs) | Read-only local static preview with correct file types, index redirect, and true 404 behavior. |
| [src/App.tsx](../src/App.tsx) | Affiliate-only visible copy, canonical facts, founder section, form placement, policies, and 404 view. |
| [src/ContactForm.tsx](../src/ContactForm.tsx) | Validated, accessible, duplicate-safe form with explicit provider acceptance and no-JavaScript protection. |
| [src/entry-server.tsx](../src/entry-server.tsx) | Static rendering of homepage/404 and canonical metadata/discovery files. |
| [src/form-config.ts](../src/form-config.ts) | Resolves the approved public form endpoint for the browser and pre-renderer. |
| [src/index.css](../src/index.css) | Preserves design; improves focus, mobile layout, contrast, founder/policies, and reduced motion. |
| [src/main.tsx](../src/main.tsx) | Hydrates existing HTML, serves fonts locally, and guards accidental unknown-route fallback. |
| [src/site.ts](../src/site.ts) | Central typed facts, provider rules, 12 owner-approved founder profiles, corrected title and current-role connection, entity IDs, and graph. |
| [src/vite-env.d.ts](../src/vite-env.d.ts) | Types the single public form-endpoint variable. |
| [tests/form.spec.ts](../tests/form.spec.ts) | Locally intercepted form acceptance, rejection, validation, timeout, retry and no-JavaScript tests. |
| [tests/output.spec.mjs](../tests/output.spec.mjs) | Output scan, detector canary, and unsafe-variable build rejection tests. |
| [tests/site.spec.ts](../tests/site.spec.ts) | Rendered identity, metadata, graph, copy, routes, accessibility, layout and request regression tests. |
| [tsconfig.json](../tsconfig.json) | Removes project-reference conflicts while preserving strict application checks. |
| [tsconfig.node.json](../tsconfig.node.json) | Type-checks build configuration and its shared facts without generated tracked files. |
| [tsconfig.tests.json](../tsconfig.tests.json) | Strict type-checking of browser tests and their configuration. |
| [vite.config.ts](../vite.config.ts) | Uses static-page behavior and validates public build settings without logging their values. |

Generated/ignored outputs were rebuilt in `dist` (homepage, 404, robots, sitemap, hashed JS/CSS/fonts, copied original PNG assets), `.test-dist`, `.test-empty`, `test-results`, and `playwright-report`; npm refreshed ignored dependencies/cache. The short-lived `.site-build` directory is removed after rendering. Original logo/icon source files, the duplicate original source logo, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, and existing Amplify generated account output were preserved. Only `dist` is deployable.

**Final status: local code corrections complete; NOT ready for deployment. Activation, anonymous branch configuration, authorized deployment, verified receipt, privacy-link review, and hosting-console release steps remain. Nothing committed, staged, pushed, deployed, or submitted to a real form. No profiles, accounts, external settings, or government records were changed.**
