# Cobalt monitoring

Status as of November 4, 2026: repository integration is being prepared; no
production telemetry has been enabled, no deployment has been started, and no
shared Sentry organization settings have been changed by this chat.

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
| Shared Slack installation | Pending organization-level setup through BuzzKill |

The project-specific public DSN verified in Sentry is
`https://1cd0334fc395fd24c08b80a02263e5bc@o4512373753249792.ingest.us.sentry.io/4512376742543360`.
It has not been enabled in a deployed browser build. The new project initially
uses the existing `#buzzkill` Sentry team (Jake is the sole organization member);
no organization or team membership was changed.

The enabled fallback rule is **Cobalt production errors - owner email fallback**,
alert ID `6293757`, attached only to Cobalt error monitor `10859661`. It matches
new issues or resolved issues that regress, requires the `environment` tag to
equal `production`, notifies Jake Greasley through Sentry's email action, and
throttles repeat notifications for 30 minutes. No existing rule was removed.
Delivery is not yet verified.

Cobalt has one independently deployed app: the static React/Vite website at
`https://www.cobaltemployment.com`. There is no backend, database, authentication
service, or separately deployed contact service in this repository. FormSubmit is
a third-party delivery provider; do not create a Sentry project for that provider.

The September release review identifies Amplify app `d22dxgvoxraolf`, `main`
production branch. Current CLI credentials have not located that app; existing
deployment configuration has not been changed. Do not assume those credentials
identify the correct hosting account.

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

No production verification results are claimed while the shared destination is
pending. Record event/issue identifiers and alert evidence here after completion.
