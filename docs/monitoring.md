# Cobalt monitoring

Status as of November 4, 2026: production monitoring, synthetic error ingestion,
private source-map upload/resolution, private Slack alert delivery, and email
receipt are verified. Shared installation was coordinated by BuzzKill.

## Shared destination

| Resource | Confirmed value / status |
| --- | --- |
| Sentry organization | Master Planning, US region; verified in Sentry General Settings |
| Organization slug / ID | `master-planning` / `4512373753249792` |
| Project | `cobalt-web`, ID `4512376742543360`, React error monitoring only |
| Legacy Cobalt organization | `cobalt-employment-group`; Sentry shows no projects, so no transfer is needed |
| Slack workspace | Master Planning, `T0C66F8M9U3` (connector retains old name ERP) |
| Slack channel | Private `sentry-cobalt`, `C0CFVU71EL8` |
| Slack channel URL | <https://master-planning-slack.slack.com/archives/C0CFVU71EL8> |
| Shared Slack installation | Existing integration `554622`, installed by BuzzKill; bot `U0CEWEMKMJR` |

The project-specific public DSN verified in Sentry is
`https://1cd0334fc395fd24c08b80a02263e5bc@o4512373753249792.ingest.us.sentry.io/4512376742543360`.
The DSN is enabled in the deployed browser build. The project is attached only to
the repo-specific `#cobalt` Sentry team, with Jake as its sole member. The
temporary project association with `#buzzkill` was removed after `#cobalt` was
attached, following BuzzKill's shared coordination guidance. No organization
membership or other repo's project/team configuration was changed.

The enabled fallback rule is **Cobalt production errors - owner email fallback**,
alert ID `6293757`, attached only to Cobalt error monitor `10859661`. It matches
new issues or resolved issues that regress, requires the `environment` tag to
equal `production`, notifies Jake Greasley through Sentry's email action, and
throttles repeat notifications for 30 minutes per issue. It now also has an
explicit production-only environment selection and a native Slack action using
integration `554622`, Master Planning, target `#sentry-cobalt` /
`C0CFVU71EL8`. Only `environment,release` are selected as message tags; notes are
blank. The owner email action remains unchanged. No existing rule was removed.
The rule triggered for synthetic event `275b7b477eb84a44824d4d81495dfc8e`
(issue `COBALT-WEB-1`, ID `7830079272`). Sentry history records the email action,
and receipt at Jake's configured Cobalt address was confirmed in Front at
9:24 PM EST. The received email names alert `6293757` and the exact event ID.

Cobalt has one independently deployed app: the static React/Vite website at
`https://www.cobaltemployment.com`. There is no backend, database, authentication
service, or separately deployed contact service in this repository. FormSubmit is
a third-party delivery provider; do not create a Sentry project for that provider.

Current hosting was located through AWS Organizations and the existing
`OrganizationAccountAccessRole`: AWS account **Cobalt / `964862484529`**, region
**`us-east-1`**, Amplify app **Cobalt / `d11i3zvksioc8v`**, repository
`https://github.com/Cobalt-Employment-Group/Cobalt`, `main` production branch.
The September release review's app `d22dxgvoxraolf` is stale. The current app's
default domain is `d11i3zvksioc8v.amplifyapp.com`. No new IAM access was created.

Dedicated CI token `cobalt-amplify-sourcemaps` (ID `1218563`, `org:ci` only)
was created after Jake's approval and stored as the Cobalt GitHub repository
secret `SENTRY_AUTH_TOKEN`. Token `1218562` was revoked unused after its value
appeared in a browser-tool result; the replacement was handled without display
or clipboard use. No other repo's tokens were changed. The same dedicated
credential is also configured in Amplify's existing `main` branch build
environment. Other branch settings, the empty contact endpoint, and all existing
hosting/email monitoring were preserved. Temporary plaintext copies were removed.

Production activation was released through merged PR #2 and successful Amplify
job `4`, commit `c4384ca3a66f6418cd8bd6498d3ff37a4cf0a62e`, completed November 4
at 9:39:19 PM EST. Its 22-file artifact contains zero source maps, environment
files, private source files, tests, secret-token markers, or sourceMappingURL
directives. The canonical public GET returns 200 and serves
`assets/index-DdF3ewGK.js` with the correct DSN and commit release. The contact
form remains disabled as before; no submission was sent. A missing map URL
serves the host's HTML fallback rather than map data; its status is 200, so map
privacy was verified by inspecting both contents and the actual build artifact.

Production private archive `6086b911-c034-b11a-316b-aeb368858060` contains the
minified file and map for debug ID `37469376-8d3f-4fa9-af1a-5f0eeb7dc359`.
Synthetic deployed-release event `194deac7cad64baf83186670a7c8b880` was accepted
with HTTP 200 and resolves the deployed frame to `main.tsx:13:1` in Sentry.

The full regression run passed 104 Chromium/WebKit checks. After final destination
pinning and Sentry-token scanning, 22 focused checks plus typecheck/lint passed.
Live browser QA also identified an obsolete v11 tracing hook; it was removed,
and eight real-SDK runtime checks verify that initialization no longer logs
Sentry configuration warnings. The transport still rejects all non-error items.

The warning fix was released through PR #3 and successful Amplify job `5`, commit
`e1c6c4a5d61dbff81348ffebd29ef02ccecca030`, completed at 9:47:46 PM EST. Its
22-file build artifact has the same privacy guarantees. Public homepage and
`assets/index-DY_JS6P0.js` both return 200, and the served JS bytes match the build
artifact. A fresh normal browser load has no console warnings or errors.

The final release's private source-map archive is
`0249ec8d-85e9-b31c-f20a-9dd23ffd7825`, debug ID
`c0f754ca-17b4-4028-b609-6e8be9d179b0`. The final deployed-release event
`aebbc04adfc74b489d84ab727c520dbd` was accepted with HTTP 200. A distinct
synthetic routing event, `0cac1e00c95b4b3f93649f9a8b1a3f51`, uses a fixed
diagnostic fingerprint so it exercises the new-issue alert rather than joining
an already-throttled verification issue. It contains no customer data and points
to the final compiled asset at line 22, column 35549 (`main.tsx:13:1`).

Only Jake and the already installed Sentry bot are members of the private alert
channel. The bot was invited to this channel only. Shared billing, organization
membership/slug, app installation, OAuth scopes, and other repos' settings were
not changed by this chat. Optional Slack history access remains disabled by the
shared installation; no replacement app or separate subscription was created.

Native Slack delivery was received at **9:51:14 PM EST** from Sentry bot
`U0CEWEMKMJR` in private channel `C0CFVU71EL8`, message timestamp
`1793847074.363299`. The message identifies **COBALT-WEB-4 / `7830108349`**,
production environment, final release `e1c6c4a5d61d`, project `cobalt-web`, and
alert `6293757`. This was an actual synthetic issue-rule notification, not a
direct Slack post or a manual notification-only test. The original email action
was retained alongside Slack. All four labelled verification issues were then
resolved, preserving their event history and notification evidence.

Alert evidence: <https://master-planning-slack.slack.com/archives/C0CFVU71EL8/p1793847074363299>.

A local build using that dedicated credential successfully uploaded private
artifact bundle `a7884266-2b26-b197-2430-58fc2923ae23` for release
`cobalt-web@04779afd7ee4468bd196ee57f69a34904e782b9c`. Sentry shows two private
artifacts (minified JS and source map), debug ID
`c3da4f54-ce6f-4af8-a32c-d6d332b2b3dd`. Publishable `dist` contains zero `.map`
files and zero `sourceMappingURL` directives. The release is a diagnostic build,
not a claim that this code is deployed.

Source-map event `3bd1f4bdf73340f98d402cedd6514cda` (issue `COBALT-WEB-2`, ID
`7830086132`) was accepted with HTTP 200. Sentry resolved the minified frame
`index-BGyFZq9T.js:22:35580` to `src/main.tsx:13:1`, displaying the original
`initializeMonitoring();` source line. This verifies server-side symbolication
of the actual private uploaded map without deploying a test button or causing
an error for a real visitor.

Project-side browser origins are restricted to
`https://www.cobaltemployment.com`, TLS verification is enabled, and JavaScript
source fetching remains disabled. Existing organization-enforced server data
scrubbing, default scrubbers, and IP-address removal remain enabled.

## Privacy and runtime

Monitoring requires a production build, explicitly configured production
environment, valid project DSN and commit release, and the exact canonical HTTPS
host. Development, local testing, unknown paths, staging, and preview hosts must
remain silent. A blank configuration preserves the ordinary static build.

Reports are limited to errors with code locations in Cobalt's compiled assets.
The sanitizer reconstructs events from an allowlist, replaces arbitrary error
messages with static text, and keeps only source-map identifiers and safe code
locations. Contact names, emails, organizations, messages, raw form responses,
payloads, credentials, authentication links, URL parameters/fragments, user
identity, request context, and scope extras must never leave the browser.

Replay, tracing, profiling, structured logs, feedback, sessions, DOM/console/
network/navigation breadcrumbs, and attachments are disabled. Outbound transport
must omit cookies and referrer information, suppress IP inference, and send only
sanitized error items. The website privacy notice describes limited error
monitoring and Sentry's role as a processor.

## Build configuration and credentials

Public browser variables are `VITE_SENTRY_DSN`,
`VITE_SENTRY_ENVIRONMENT=production`, and
`VITE_SENTRY_RELEASE=cobalt-web@<git-commit>`. A DSN is a public ingestion key,
not a CI credential. Amplify derives the release from its `AWS_COMMIT_ID` when a
DSN is set. Never use a visitor-provided value for a release or project target.

Private build variables are `SENTRY_ORG`, `SENTRY_ORG_ID`,
`SENTRY_PROJECT=cobalt-web`, `SENTRY_PROJECT_ID`, `SENTRY_AUTH_TOKEN`, and
`SENTRY_UPLOAD_SOURCEMAPS=true`. Populate them only after confirming the final
organization slug/ID and the project-specific DSN. Keep the token in Cobalt's
existing CI secret store; never put it in a `VITE_` variable or commit it.

Use a separately named Cobalt CI credential with the minimum upload permissions.
Sentry documents `org:ci` for CI release and source-map workflows. An organization
CI token may reach other projects: a distinct name and pinned upload target do
not themselves provide project-level access isolation. Verify the token's actual
scope and restrictions before storing it. Never reuse BuzzKill's or another
repository's credential or place an administrator's token in CI. Coordinate any
required shared membership or access-policy change through BuzzKill.

For an enabled production build, generate hidden browser source maps, upload them
privately to the verified `cobalt-web` target, and remove them before publishing.
Upload failure blocks the build. SSR prerender and test fixtures never upload.
`npm run check:output` continues to reject every deployable `.map` file and
credential-bearing output. Publish only `dist`; keep sources, secret files,
reports, and test fixtures out of the hosting artifact.

See [Sentry's Vite source-map guide](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/),
[data collection options](https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/),
and [API permission scopes](https://docs.sentry.io/api/permissions/).

## Alerts and verification gate

In the shared organization, create a project-specific issue rule for
`cobalt-web`, filtered to `environment=production`, for new and regressed errors.
Route to private `#sentry-cobalt` and retain a verified owner email fallback.
Confirm the shared Sentry app can access this private channel without changing
the organization's Slack installation. Do not enable a trial, paid add-on, or
usage-based spending to make a feature available; route any plan prerequisite
to the BuzzKill chat.

Preserve Amplify build/hosting logs and all existing remote email notifications.
The repository contains no earlier Sentry SDK or alert rules to replace. Do not
remove existing monitoring until ingestion and replacement delivery are proven.

Before reporting the rollout complete:

1. Read the final organization slug and immutable ID directly in Sentry, then
   record the `cobalt-web` project ID and freshly verified project DSN.
2. Verify the dedicated CI credential and private source-map upload succeed;
   confirm the publishable artifact has no maps or private build values.
3. Send one clearly identified synthetic error from an isolated diagnostic
   browser/workflow, without visiting or mutating customer records or submitting
   the public contact form. Inspect the complete outbound envelope for synthetic
   sensitive canaries before allowing real ingestion.
4. Confirm the event belongs to `cobalt-web`, has the intended production
   environment/release, and resolves a minified frame to its original source.
5. Confirm Sentry's rule delivers to `C0CFVU71EL8` and the retained email route.
   A direct Slack test message alone is not proof of Sentry alert delivery.
6. Verify a normal public GET and local regression checks. Keep the existing
   FormSubmit activation/release prerequisites from the README in force; do not
   deploy an incomplete contact workflow merely to exercise monitoring.

Production, source-map, email, and native Slack verification evidence is recorded
above. Existing hosting logs and email fallback remain enabled. Verification used
only labelled synthetic errors and read-only site requests; it did not submit the
contact form, change customer records, or trigger an error for a real visitor.
