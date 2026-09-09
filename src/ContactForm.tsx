import { useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { contactConfig } from "./form-config";
import { canonicalUrl, site } from "./site";

type Status = "idle" | "submitting" | "success" | "error";
const subscribe = () => () => {};

export default function ContactForm() {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);
  const accepted = useRef(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || accepted.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    for (const name of ["name", "email", "message"] as const) {
      if (!String(data.get(name) ?? "").trim()) {
        setStatus("error");
        setMessage(
          "Please complete all required fields with more than spaces.",
        );
        (form.elements.namedItem(name) as HTMLInputElement)?.focus();
        return;
      }
    }
    if (data.get("_honey")) {
      setStatus("error");
      setMessage(
        "Your message was not sent. Please reload the page and try again.",
      );
      return;
    }
    if (!contactConfig.enabled) {
      setStatus("error");
      setMessage(site.contact.unavailableMessage);
      return;
    }
    data.set("_subject", site.contact.subject);
    data.set("_template", "table");
    data.set("_url", `${canonicalUrl}#contact`);
    if (!String(data.get("company") ?? "").trim()) data.delete("company");
    inFlight.current = true;
    setStatus("submitting");
    setMessage("Sending your message…");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(contactConfig.endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      // A 200 HTML fallback, error payload, or network failure is never acceptance.
      if (
        !response.ok ||
        response.redirected ||
        !result ||
        typeof result !== "object" ||
        Array.isArray(result) ||
        !("success" in result) ||
        (result.success !== true && result.success !== "true") ||
        "error" in result ||
        "errors" in result
      ) {
        throw new Error("Submission not accepted");
      }
      accepted.current = true;
      setStatus("success");
      setMessage(
        `Your message was accepted for delivery. ${site.contact.responseExpectation}`,
      );
      form.reset();
      statusRef.current?.focus();
    } catch {
      setStatus("error");
      setMessage(
        "We could not confirm delivery. Your message is still in the form. Please check your connection and try again later.",
      );
      statusRef.current?.focus();
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  }

  return (
    <form
      className="contact-card contact-form"
      onSubmit={handleSubmit}
      aria-labelledby="form-title"
      aria-describedby="form-purpose form-privacy"
    >
      <h3 id="form-title">Send a message</h3>
      <p id="form-purpose">{site.contact.applicationNotice}</p>
      {!contactConfig.enabled && (
        <p className="form-notice">{site.contact.unavailableMessage}</p>
      )}
      <noscript>
        <p className="form-notice">
          Please enable JavaScript to use this form. No information is sent
          without it.
        </p>
      </noscript>
      <p className="form-fineprint">Fields marked * are required.</p>
      <fieldset
        disabled={
          !ready ||
          !contactConfig.enabled ||
          status === "submitting" ||
          status === "success"
        }
      >
        <legend className="sr-only">Your inquiry</legend>
        <div className="form-row">
          <label htmlFor="cf-name">Your name *</label>
          <input
            id="cf-name"
            name="name"
            required
            autoComplete="name"
            maxLength={120}
          />
        </div>
        <div className="form-row">
          <label htmlFor="cf-company">Organization (optional)</label>
          <input
            id="cf-company"
            name="company"
            autoComplete="organization"
            maxLength={160}
          />
        </div>
        <div className="form-row">
          <label htmlFor="cf-email">Your email *</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
          />
        </div>
        <div className="form-row">
          <label htmlFor="cf-message">Message *</label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            required
            maxLength={5000}
            aria-describedby="form-privacy"
          />
        </div>
        <div className="form-honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="_honey" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button type="submit" className="btn btn--primary">
          {status === "submitting"
            ? "Sending…"
            : status === "success"
              ? "Message accepted"
              : "Send message"}
        </button>
      </fieldset>
      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={status === "error" ? "form-error" : "form-status"}
      >
        {message}
      </p>
      <p id="form-privacy" className="form-fineprint">
        We use submitted information to handle your inquiry and related
        follow-up. Please do not include Social Security numbers, payroll
        records, medical information, or other sensitive documents. Read our{" "}
        <a href="#privacy">privacy policy</a> and{" "}
        <a href="#terms">website terms</a>.
        {contactConfig.enabled && (
          <>
            {" "}
            {contactConfig.provider} processes submissions for delivery to
            Cobalt’s privately configured recipient. See its{" "}
            <a href={contactConfig.privacyUrl}>privacy information</a>.
          </>
        )}
      </p>
    </form>
  );
}
