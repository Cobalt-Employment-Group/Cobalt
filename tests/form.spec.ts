import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

const testUrl = "http://127.0.0.1:4174/";
const endpoint = "https://formsubmit.co/ajax/0123456789abcdef0123456789abcdef";

test.beforeEach(async ({ context }) => {
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).hostname === "127.0.0.1")
      return route.continue();
    return route.abort("blockedbyclient");
  });
});

async function fill(page: Page) {
  await page.goto(testUrl);
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeEnabled();
  await page.getByLabel("Your name *", { exact: true }).fill("Local Test");
  await page
    .getByLabel("Your email *", { exact: true })
    .fill("test@example.invalid");
  await page
    .getByLabel("Message *", { exact: true })
    .fill("Local intercepted test. No delivery.");
}

test("configured privacy explains delivery, provider archive retention, and sensitive-data limits", async ({ page }) => {
  await fill(page);
  await expect(page.locator("#privacy")).toContainText("Cobalt’s privately configured recipient");
  await expect(page.locator("#privacy")).toContainText("FormSubmit states that its submission archive retains submissions for 30 days");
  await expect(page.locator("#privacy")).toContainText("not a Cobalt-controlled deletion guarantee");
  await expect(page.locator("#privacy")).toContainText("Cobalt’s retention of received inquiries");
  await expect(page.locator('#privacy a[href="https://formsubmit.co/documentation"]')).toBeVisible();
  await expect(page.locator('#privacy a[href="https://formsubmit.co/privacy"]')).toBeVisible();
  for (const phrase of ["Social Security numbers", "payroll records", "medical information", "other sensitive documents"])
    await expect(page.locator("#form-privacy")).toContainText(phrase);
  await expect(page.locator('input[name="_honey"]')).toHaveAttribute("tabindex", "-1");
  await expect(page.locator('[name="_cc"], [name="_autoresponse"], [name="_captcha"], [name="_next"], input[type="file"]')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("redirects are unconfirmed and never followed", async ({ page }) => {
  let followed = 0;
  let redirected = 0;
  // WebKit cannot synthesize 302 through route.fulfill; use a real local response.
  const server = createServer((request, response) => {
    if (request.url === "/redirect") {
      redirected++;
      response.writeHead(302, {
        "Access-Control-Allow-Origin": "*",
        Location: "/accepted",
      }).end();
    } else {
      followed++;
      response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }).end('{"success":true}');
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const redirectUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/redirect`;
    await page.addInitScript(({ endpoint, redirectUrl }) => {
      const nativeFetch = window.fetch.bind(window);
      // Substitute only the destination; preserve the app's real fetch options.
      window.fetch = (input, options) => nativeFetch(input === endpoint ? redirectUrl : input, options);
    }, { endpoint, redirectUrl });
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("could not confirm delivery");
    await expect(page.getByLabel("Message *", { exact: true })).toHaveValue("Local intercepted test. No delivery.");
    expect(redirected).toBe(1);
    expect(followed).toBe(0);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

for (const success of [true, "true"]) {
  test(`provider acceptance (${typeof success}) resets the form and prevents duplicates`, async ({
    page,
  }) => {
    let calls = 0;
    let submittedFields: Record<string, unknown> = {};
    let release!: () => void;
    const released = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(endpoint, async (route) => {
      calls++;
      const request = route.request();
      expect(request.method()).toBe("POST");
      expect(request.headers().accept).toBe("application/json");
      expect(request.headers()).not.toHaveProperty("authorization");
      expect(request.headers()).not.toHaveProperty("cookie");
      expect(request.headers()).not.toHaveProperty("referer");
      const submitted = await new Response(request.postData(), {
        headers: { "Content-Type": request.headers()["content-type"] },
      }).formData();
      submittedFields = Object.fromEntries(submitted.entries());
      await released;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success }),
      });
    });
    await fill(page);
    if (success === true)
      await page.getByLabel("Organization (optional)").fill("Local fixture organization");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
    // Even programmatic rapid submit events must not bypass the in-flight guard.
    await page.locator("form").dispatchEvent("submit");
    await page.locator("form").dispatchEvent("submit");
    expect(calls).toBe(1);
    release();
    await expect(page.getByRole("status")).toContainText("accepted for delivery");
    await expect(page.getByRole("status")).toContainText(
      "generally receive a response within one business day",
    );
    await expect(page.getByRole("status")).toBeFocused();
    await expect(page.getByLabel("Your name *", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Your email *", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Message *", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Organization (optional)")).toHaveValue("");
    expect(submittedFields).toEqual({
      _subject: "Cobalt website inquiry",
      _template: "table",
      _url: "https://www.cobaltemployment.com/#contact",
      _honey: "",
      name: "Local Test",
      email: "test@example.invalid",
      message: "Local intercepted test. No delivery.",
      ...(success === true ? { company: "Local fixture organization" } : {}),
    });
    await page.locator("form").dispatchEvent("submit");
    await page.locator("form").dispatchEvent("submit");
    expect(calls).toBe(1);
    await expect(
      page.getByRole("button", { name: "Message accepted" }),
    ).toBeDisabled();
  });
}

for (const scenario of [
  {
    label: "validation rejection",
    status: 422,
    body: '{"errors":[{"message":"Invalid"}]}',
  },
  { label: "HTTP failure", status: 500, body: '{"success":true}' },
  { label: "boolean false", status: 200, body: '{"success":false}' },
  { label: "string false", status: 200, body: '{"success":"false"}' },
  { label: "numeric success", status: 200, body: '{"success":1}' },
  { label: "wrong-case success", status: 200, body: '{"success":"TRUE"}' },
  { label: "missing success", status: 200, body: '{"ok":true}' },
  { label: "JSON array", status: 200, body: '[{"success":true}]' },
  { label: "JSON null", status: 200, body: 'null' },
  { label: "JSON scalar", status: 200, body: 'true' },
  { label: "malformed JSON", status: 200, body: '{"success":true' },
  {
    label: "200 HTML fallback",
    status: 200,
    body: "<html>Homepage</html>",
    contentType: "text/html",
  },
  { label: "activation page", status: 200, body: "<html>Confirm your activation email</html>", contentType: "text/html" },
  { label: "CAPTCHA page", status: 200, body: "<html>Please complete CAPTCHA</html>", contentType: "text/html" },
  { label: "empty 204", status: 204, body: "" },
  {
    label: "conflicting errors",
    status: 200,
    body: '{"success":true,"errors":[{}]}',
  },
  { label: "singular error", status: 200, body: '{"success":"true","error":"Rejected"}' },
  { label: "empty errors collection", status: 200, body: '{"success":true,"errors":[]}' },
  { label: "null error field", status: 200, body: '{"success":true,"error":null}' },
]) {
  test(`never reports success for ${scenario.label}`, async ({ page }) => {
    await page.route(endpoint, (route) =>
      route.fulfill({
        status: scenario.status,
        contentType: scenario.contentType || "application/json",
        body: scenario.body,
      }),
    );
    await fill(page);
    await page.getByLabel("Organization (optional)").fill("Preserved organization");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText(
      "could not confirm delivery",
    );
    await expect(page.getByLabel("Your name *", { exact: true })).toHaveValue("Local Test");
    await expect(page.getByLabel("Your email *", { exact: true })).toHaveValue("test@example.invalid");
    await expect(page.getByLabel("Organization (optional)")).toHaveValue("Preserved organization");
    await expect(page.getByLabel("Message *", { exact: true })).toHaveValue(
      "Local intercepted test. No delivery.",
    );
    await expect(
      page.getByRole("button", { name: "Send message" }),
    ).toBeEnabled();
    await expect(page.getByRole("status")).not.toContainText("accepted");
    await expect(page.getByRole("status")).not.toContainText(endpoint);
  });
}

test("network failure is retryable and accessible", async ({ page }) => {
  await page.route(endpoint, (route) => route.abort("failed"));
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText(
    "could not confirm delivery",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.route(endpoint, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":true}',
    }),
  );
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("accepted for delivery");
});

test("timeout keeps the message and re-enables submission", async ({
  page,
}) => {
  await page.clock.install();
  await page.route(endpoint, () => new Promise<void>(() => {}));
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await page.clock.fastForward(21_000);
  await expect(page.getByRole("status")).toContainText(
    "could not confirm delivery",
  );
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeEnabled();
  await expect(page.getByLabel("Message *", { exact: true })).toHaveValue("Local intercepted test. No delivery.");
});

test("invalid, whitespace-only, and honeypot submissions do not send or fake success", async ({
  page,
}) => {
  let calls = 0;
  await page.route(endpoint, (route) => {
    calls++;
    return route.abort();
  });
  await page.goto(testUrl);
  await page.getByRole("button", { name: "Send message" }).click();
  expect(calls).toBe(0);
  await fill(page);
  await page.getByLabel("Your email *", { exact: true }).fill("invalid-email");
  await page.getByRole("button", { name: "Send message" }).click();
  expect(calls).toBe(0);
  await page
    .getByLabel("Your email *", { exact: true })
    .fill("test@example.invalid");
  await page.getByLabel("Your name *", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("more than spaces");
  expect(calls).toBe(0);
  await page.getByLabel("Your name *", { exact: true }).fill("Local Test");
  await page
    .locator('input[name="_honey"]')
    .evaluate((element: HTMLInputElement) => {
      element.value = "bot";
    });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("was not sent");
  expect(calls).toBe(0);
});

test("enabled form remains safe when JavaScript is unavailable", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort("blockedbyclient"),
  );
  const page = await context.newPage();
  await page.goto(testUrl);
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Your email *", { exact: true })).toBeDisabled();
  // Playwright's text engine deliberately excludes noscript; inspect its rendered child.
  await expect(page.locator("noscript p")).toBeVisible();
  expect(
    await page.locator("noscript").evaluate((element) => element.textContent),
  ).toContain("No information is sent");
  await context.close();
});
