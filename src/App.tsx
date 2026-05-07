import { useState } from "react";
import type { FormEvent } from "react";
import logoUrl from "./assets/cobalt-logo.png";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Industries", href: "#industries" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    num: "01",
    title: "Employment & onboarding",
    summary:
      "We serve as the worksite employer of record for assigned personnel — handling offers, paperwork, I-9 and E-Verify, and onboarding so the first day starts cleanly.",
    items: [
      "Recruitment, hiring, and offer administration",
      "I-9, E-Verify, and new-hire reporting",
      "Onboarding documentation and acknowledgments",
    ],
  },
  {
    num: "02",
    title: "Payroll & tax administration",
    summary:
      "Payroll runs on a predictable cadence, with federal, state, and local tax withholding remitted on your behalf and reconciled each cycle.",
    items: [
      "Payroll processing and wage payment",
      "Federal, state, and local tax withholding & remittance",
      "Quarterly and year-end filings",
    ],
  },
  {
    num: "03",
    title: "Benefits & insurance",
    summary:
      "Through our PEO partnership with ADP TotalSource, assigned employees gain access to group benefits, leave administration, and statutory coverages.",
    items: [
      "Health, dental, vision, and retirement plan administration",
      "Leave program administration (FMLA, PFML, sick time)",
      "Workers' compensation and unemployment insurance",
    ],
  },
  {
    num: "04",
    title: "HR administration & compliance",
    summary:
      "We maintain employee records, support policy administration, and coordinate the day-to-day work of staying compliant with Massachusetts employment law.",
    items: [
      "Employee recordkeeping and document retention",
      "Policy administration and compliance support",
      "Termination processing and offboarding",
    ],
  },
];

const PRINCIPLES = [
  {
    num: "I.",
    title: "Employer of record, by design",
    body: "We take on the worksite employer responsibilities for the people you depend on. You direct the work; we handle employment, payroll, and HR coordination — including, where appropriate, through ADP TotalSource as our PEO partner.",
  },
  {
    num: "II.",
    title: "Pass-through economics",
    body: "Costs are reimbursed monthly at what they actually are: wages, taxes, benefits, premiums, and PEO fees — invoiced clearly, due in 30 days. No hidden margins on the underlying spend.",
  },
  {
    num: "III.",
    title: "Quiet, capable execution",
    body: "Workforce administration is most useful when it doesn't require attention. We aim to be the part of your operation you don't have to think about — until you want to.",
  },
];

const INDUSTRIES = [
  {
    name: "Property management",
    desc: "On-site, maintenance, and back-office staff supporting residential and commercial portfolios.",
  },
  {
    name: "Insurance & financial services",
    desc: "Licensed and unlicensed roles supporting agencies, brokerages, and small carriers.",
  },
  {
    name: "Professional services",
    desc: "Operating, administrative, and client-service staff for firms across the Commonwealth.",
  },
  {
    name: "Field & trade operations",
    desc: "Hourly and salaried personnel for service-based businesses with distributed worksites.",
  },
];

const FACTS = [
  { label: "Entity", value: "Massachusetts LLC" },
  { label: "Headquarters", value: "Marlborough, Massachusetts" },
  { label: "Founded", value: "2026" },
  { label: "PEO partner", value: "ADP TotalSource" },
];

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Approach />
        <Industries />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="Cobalt Employment Group home">
          <img src={logoUrl} alt="Cobalt Employment Group" />
        </a>
        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            {NAV.map((n) => (
              <li key={n.href}>
                <a className="site-nav__link" href={n.href}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--ghost" href="#contact">
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__grid">
        <div>
          <span className="hero__eyebrow">Workforce administration · Massachusetts</span>
          <h1 className="hero__title">A capable team behind your team.</h1>
          <p className="hero__lede">
            Cobalt Employment Group serves as employer of record for established
            Massachusetts businesses — handling payroll, benefits, and HR
            administration so leaders can spend their attention where it
            counts.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              Request a consultation
            </a>
            <a className="btn btn--ghost" href="#services">
              See what we handle
            </a>
          </div>
        </div>
        <aside className="hero__panel" aria-label="At a glance">
          <p className="hero__panel-title">At a glance</p>
          <dl className="hero__facts">
            {FACTS.map((f) => (
              <div key={f.label} className="hero__facts-row">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section__head">
          <h4>
            <span className="eyebrow-rule" />
            What we handle
          </h4>
          <h2>Four functions, run as one.</h2>
          <p className="section__lede">
            Employment, payroll, benefits, and HR are tightly interconnected.
            We operate them together so changes propagate cleanly and nothing
            falls through the seams.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <article key={s.num} className="service">
              <div className="service__num">{s.num}</div>
              <h3 className="service__title">{s.title}</h3>
              <p>{s.summary}</p>
              <ul className="service__items">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="section section--soft">
      <div className="container">
        <div className="section__head">
          <h4>
            <span className="eyebrow-rule" />
            How we operate
          </h4>
          <h2>A few principles, applied consistently.</h2>
        </div>

        <div className="approach-grid">
          {PRINCIPLES.map((p) => (
            <div key={p.num}>
              <span className="principle__num">{p.num}</span>
              <h3 className="principle__title">{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section id="industries" className="section">
      <div className="container">
        <div className="section__head">
          <h4>
            <span className="eyebrow-rule" />
            Who we serve
          </h4>
          <h2>Established operators, not startups in a hurry.</h2>
          <p className="section__lede">
            We work with businesses whose workforce is part of how they make
            their living — not a side project. Our model fits operators that
            want predictable, well-administered employment for the long run.
          </p>
        </div>

        <div className="industries">
          {INDUSTRIES.map((i) => (
            <div key={i.name} className="industry">
              <h3 className="industry__name">{i.name}</h3>
              <p className="industry__desc">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section--deep">
      <div className="container about-grid">
        <div className="about__body">
          <h4>
            <span className="eyebrow-rule" />
            About Cobalt
          </h4>
          <h2>Based in Marlborough. Operating across the Commonwealth.</h2>
          <p>
            Cobalt Employment Group is a Massachusetts LLC operating from
            Marlborough. We serve as employer of record for the businesses we
            partner with, coordinating with ADP TotalSource as our PEO partner
            for payroll, benefits, and statutory coverages.
          </p>
          <p>
            We are deliberately small. The work we take on is operational and
            ongoing — not project-shaped — and we keep the team sized to the
            quality bar we hold ourselves to.
          </p>
          <p>
            If your business is established and you'd rather not run an HR
            department in-house, we should talk.
          </p>
        </div>

        <aside className="fact-card" aria-label="Company details">
          <dl>
            <dt>Legal name</dt>
            <dd>Cobalt Employment Group LLC</dd>
            <dt>Form</dt>
            <dd>Massachusetts domestic LLC</dd>
            <dt>Office</dt>
            <dd>
              420 Lakeside Ave, Suite 303
              <br />
              Marlborough, MA 01752
            </dd>
            <dt>Industry classification</dt>
            <dd>NAICS 541611 — Management consulting</dd>
            <dt>PEO partner</dt>
            <dd>ADP TotalSource</dd>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section section--soft">
      <div className="container contact-grid">
        <div>
          <h4>
            <span className="eyebrow-rule" />
            Get in touch
          </h4>
          <h2>Talk through a fit.</h2>
          <p className="section__lede">
            We respond to every inquiry from a real person, generally within
            one business day. There is no sales process — only a conversation
            about whether the work makes sense for both of us.
          </p>

          <ul className="contact-channels">
            <li>
              <span className="contact-channels__label">Office</span>
              <address className="contact-channels__value">
                420 Lakeside Ave, Suite 303
                <br />
                Marlborough, MA 01752
              </address>
            </li>
            <li>
              <span className="contact-channels__label">Hours</span>
              <span className="contact-channels__value">
                Monday – Friday, 8:30 a.m. – 5:00 p.m. ET
              </span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const endpoint = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? "";
  const accessKey = (import.meta.env.VITE_FORM_KEY as string | undefined) ?? "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill hidden fields; humans don't.
    if (data.get("company_url")) {
      setStatus("success");
      form.reset();
      return;
    }

    if (!endpoint) {
      setStatus("error");
      setErrorMsg(
        "Submissions are temporarily unavailable. Please try again later.",
      );
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    if (accessKey) data.set("access_key", accessKey);
    data.set("subject", "New inquiry from cobaltemployment.com");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(
          "We couldn't deliver your message. Please try again in a moment.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "We couldn't deliver your message. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <aside className="contact-card contact-card--success" role="status">
        <h3>Message received.</h3>
        <p>
          Thanks for reaching out. We'll be in touch within one business day.
        </p>
      </aside>
    );
  }

  return (
    <form className="contact-card contact-form" onSubmit={handleSubmit}>
      <h3>Send a message</h3>

      <div className="form-row">
        <label htmlFor="cf-name">
          Your name <span aria-hidden="true">*</span>
        </label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" />
      </div>

      <div className="form-row">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" type="text" autoComplete="organization" />
      </div>

      <div className="form-row">
        <label htmlFor="cf-email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
        />
      </div>

      <div className="form-row">
        <label htmlFor="cf-phone">Phone (optional)</label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <div className="form-row">
        <label htmlFor="cf-message">
          What can we help with? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          placeholder="A few sentences about your business and what you're considering."
        />
      </div>

      {/* Honeypot — visually hidden but available to bots. */}
      <div className="form-honeypot" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--primary"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      <p className="form-fineprint">
        We use your contact information only to respond to your inquiry.
      </p>
    </form>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <img src={logoUrl} alt="Cobalt Employment Group" />
            <p className="site-footer__tag">
              Workforce administration for established Massachusetts
              businesses.
            </p>
          </div>

          <div>
            <h5 className="site-footer__heading">Company</h5>
            <ul className="site-footer__list">
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#approach">Approach</a>
              </li>
              <li>
                <a href="#industries">Industries</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="site-footer__heading">Office</h5>
            <ul className="site-footer__list">
              <li>
                420 Lakeside Ave, Suite 303
                <br />
                Marlborough, MA 01752
              </li>
              <li>
                <a href="#contact">Send a message</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__legal">
            © {year} Cobalt Employment Group LLC. A Massachusetts limited
            liability company.
          </p>
          <p className="site-footer__legal">
            Co-employment services administered through ADP TotalSource.
          </p>
        </div>
      </div>
    </footer>
  );
}
