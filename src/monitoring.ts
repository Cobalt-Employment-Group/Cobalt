import {
  globalHandlersIntegration,
  init,
  makeFetchTransport,
} from "@sentry/react";
import type { BrowserOptions } from "@sentry/react";
import {
  resolveMonitoringConfig,
  safeAssetUrl,
  sanitizeMonitoringEnvelope,
  sanitizeMonitoringEvent,
} from "./monitoring-privacy";
import type { MonitoringConfig } from "./monitoring-privacy";

function loadedApplicationAssets(config: MonitoringConfig): ReadonlySet<string> {
  const assets = new Set<string>();
  for (const element of document.querySelectorAll(
    'script[type="module"][src], link[rel="modulepreload"][href]',
  )) {
    const value = element.getAttribute("src") ?? element.getAttribute("href");
    const asset = safeAssetUrl(value, config);
    if (asset) assets.add(asset);
  }
  return assets;
}

export function monitoringOptions(
  config: MonitoringConfig,
  assets: () => ReadonlySet<string>,
): BrowserOptions {
  return {
    dsn: config.dsn,
    environment: "production",
    release: config.release,
    debug: false,
    defaultIntegrations: false,
    integrations: [globalHandlersIntegration()],
    attachStacktrace: false,
    maxBreadcrumbs: 0,
    sendClientReports: false,
    // No trace sampler or integration; the final transport rejects non-error items.
    tracePropagationTargets: [],
    propagateTraceparent: false,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    profileSessionSampleRate: 0,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
      frameContextLines: 0,
      databaseQueryData: false,
      queues: false,
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      mcp: { inputs: false, outputs: false },
    },
    beforeBreadcrumb: () => null,
    beforeSend: (event) => sanitizeMonitoringEvent(event, config, assets()),
    beforeSendLog: () => null,
    beforeSendMetric: () => null,
    transport: (options) => {
      const transport = makeFetchTransport({
        ...options,
        headers: undefined,
        fetchOptions: {
          credentials: "omit",
          referrerPolicy: "no-referrer",
          redirect: "error",
          cache: "no-store",
        },
      });
      return {
        send: (envelope) => {
          const safe = sanitizeMonitoringEnvelope(envelope, config, assets());
          return safe ? transport.send(safe) : Promise.resolve({});
        },
        flush: (timeout) => transport.flush(timeout),
      };
    },
  };
}

export function initializeMonitoring(): void {
  const config = resolveMonitoringConfig(import.meta.env, window.location.href);
  if (!config) return;
  init(monitoringOptions(config, () => loadedApplicationAssets(config)));
}
