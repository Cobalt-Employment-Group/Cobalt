import ContactForm from "./ContactForm";
import type { ReactNode } from "react";
import { contactConfig } from "./form-config";
import { foundedLabel, site } from "./site";

const NAV = [
  { label: "Operations", href: "#operations" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];

const OPERATIONS = [
  {
    title: "Employment & onboarding",
    summary:
      "Cobalt employs personnel who support affiliated businesses and coordinates their employment documentation and onboarding.",
  },
  {
    title: "Payroll coordination",
    summary:
      "We coordinate payroll information and administration for our affiliate workforce with support from our PEO provider.",
  },
  {
    title: "Benefits administration",
    summary:
      "We coordinate employee benefits administration with ADP TotalSource as Cobalt’s PEO provider.",
  },
  {
    title: "HR operations",
    summary:
      "We coordinate employee records and day-to-day HR administration across the affiliated organizations we support.",
  },
];

const PRINCIPLES = [
  {
    title: "An affiliate operating model",
    body:
      site.operatingModel +
      " Our work connects employment administration with the ongoing operations of those affiliates.",
  },
  {
    title: "Actual-cost reimbursement",
    body: "Within the affiliate operating model, wages, taxes, benefits, premiums, and PEO fees are reimbursed at actual cost, with no hidden margin. Monthly invoices are due Net 30. These are internal affiliate arrangements.",
  },
  {
    title: "Coordinated administration",
    body:
      site.adp.relationship +
      " Cobalt coordinates internal employment, payroll, benefits, and HR operations within that relationship.",
  },
];

function Logo() {
  return (
    <img
      src={site.logos.wordmark}
      width={site.logos.wordmarkWidth}
      height={site.logos.wordmarkHeight}
      alt={site.name}
    />
  );
}

function Address() {
  return (
    <>
      {site.address.streetAddress}
      <br />
      {site.address.addressLocality}, {site.address.addressRegion}{" "}
      {site.address.postalCode}
    </>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-rule" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function App({ notFound = false }: { notFound?: boolean }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header__inner">
          <a
            className="site-header__brand"
            href={notFound ? "/" : "#top"}
            aria-label={`${site.name} home`}
          >
            <Logo />
          </a>
          <nav className="site-nav" aria-label="Primary">
            <ul className="site-nav__list">
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <a
                    className="site-nav__link"
                    href={notFound ? `/${href}` : href}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              className="btn btn--ghost"
              href={notFound ? "/#contact" : "#contact"}
            >
              Contact
            </a>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {notFound ? (
          <section className="hero">
            <div className="container">
              <Eyebrow>Page not found · 404</Eyebrow>
              <h1>That page isn’t here.</h1>
              <p>The address may be incorrect or the page may have moved.</p>
              <a className="btn btn--primary" href="/">
                Return to Cobalt
              </a>
            </div>
          </section>
        ) : (
          <>
            <Hero />
            <Operations />
            <Approach />
            <About />
            <Contact />
            <Policies />
          </>
        )}
      </main>
      <Footer notFound={notFound} />
    </>
  );
}

function Hero() {
  const facts = [
    { label: "Focus", value: "Affiliated businesses" },
    {
      label: "Headquarters",
      value: `${site.address.addressLocality}, Massachusetts`,
    },
    { label: "Founded", value: foundedLabel },
    { label: "PEO provider", value: site.adp.name },
  ];
  return (
    <section id="top" className="hero">
      <div className="container hero__grid">
        <div>
          <span className="hero__eyebrow">
            Affiliated businesses · Massachusetts
          </span>
          <h1 className="hero__title">A capable team behind our teams.</h1>
          <p className="hero__lede">{site.positioning}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#about">
              About Cobalt
            </a>
            <a className="btn btn--ghost" href="#operations">
              Our internal operations
            </a>
          </div>
        </div>
        <aside className="hero__panel" aria-label="At a glance">
          <p className="hero__panel-title">At a glance</p>
          <dl className="hero__facts">
            {facts.map(({ label, value }) => (
              <div key={label} className="hero__facts-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Operations() {
  return (
    <section id="operations" className="section">
      <div className="container">
        <div className="section__head">
          <Eyebrow>What we coordinate</Eyebrow>
          <h2>Four functions, connected.</h2>
          <p className="section__lede">
            {site.operatingModel} Employment, payroll, benefits, and HR are
            coordinated as part of that internal work.
          </p>
        </div>
        <div className="services-grid">
          {OPERATIONS.map(({ title, summary }, index) => (
            <article className="service" key={title}>
              <div className="service__num" aria-hidden="true">
                0{index + 1}
              </div>
              <h3 className="service__title">{title}</h3>
              <p>{summary}</p>
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
          <Eyebrow>How we operate</Eyebrow>
          <h2>A shared foundation for affiliated organizations.</h2>
        </div>
        <div className="approach-grid">
          {PRINCIPLES.map(({ title, body }, index) => (
            <div key={title}>
              <span className="principle__num" aria-hidden="true">
                {["I.", "II.", "III."][index]}
              </span>
              <h3 className="principle__title">{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <p className="scope-notice">{site.publicServiceNotice}</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section--deep">
      <div className="container about-grid">
        <div className="about__body">
          <Eyebrow>About Cobalt</Eyebrow>
          <h2>Based in Marlborough. Built around our affiliates.</h2>
          <p>
            {site.legalName} is a Massachusetts limited liability company
            organized on {foundedLabel}. {site.operatingModel}
          </p>
          <p>{site.adp.relationship}</p>
          <div id="jake-greasley" className="founder">
            <h3>
              {site.founder.name}{" "}
              <span className="founder__title">{site.founder.title}</span>
            </h3>
            <p>
              {site.founder.name}, legally {site.founder.legalName}, is the{" "}
              {site.founder.title} of {site.legalName}.
            </p>
            <p>
              {site.name} was founded by {site.founder.name}, legally{" "}
              {site.founder.legalName}, in {site.foundingDate.slice(0, 4)} to
              support workforce administration across affiliated businesses.
            </p>
            <details className="founder-profiles">
              <summary>{site.founder.name} profiles</summary>
              <p>
                These are Jake’s personal and professional profiles. Other
                roles described there are separate from his Cobalt role. The
                linked platforms do not describe or endorse Cobalt.
              </p>
              <ul aria-label={`${site.founder.name} profiles`}>
                {site.founder.profiles.map(({ label, url }) => (
                  <li key={url}>
                    <a href={url}>{label}</a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
        <aside className="fact-card" aria-label="Company details">
          <dl>
            <dt>Legal name</dt>
            <dd>{site.legalName}</dd>
            <dt>Massachusetts entity ID</dt>
            <dd>{site.entityId}</dd>
            <dt>Founded & organized</dt>
            <dd>
              <time dateTime={site.foundingDate}>{foundedLabel}</time>
            </dd>
            <dt>Headquarters</dt>
            <dd>
              <Address />
            </dd>
            <dt>PEO provider</dt>
            <dd>{site.adp.name}</dd>
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
          <Eyebrow>Contact Cobalt</Eyebrow>
          <h2>Organizational inquiries.</h2>
          <p className="section__lede">
            For questions about Cobalt, affiliate administration, or this
            website, use the contact form. {site.contact.responseExpectation}
          </p>
          <p>{site.contact.applicationNotice}</p>
          <ul className="contact-channels">
            <li>
              <span className="contact-channels__label">Headquarters</span>
              <address className="contact-channels__value">
                <Address />
              </address>
            </li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function Policies() {
  return (
    <div className="container policies">
      <section
        id="privacy"
        className="policy-section"
        aria-labelledby="privacy-title"
      >
        <Eyebrow>Information & trust</Eyebrow>
        <h2 id="privacy-title">Privacy policy</h2>
        <p>
          Updated <time dateTime={site.policyDate}>September 8, 2026</time>.
          This policy covers this website and its contact form, operated by{" "}
          {site.legalName} in Massachusetts, United States.
        </p>
        <div className="policy-grid">
          <div>
            <h3>Information you provide</h3>
            <p>
              The form asks for your name, email address, message, and an
              optional organization name. Please provide only what is needed for
              your inquiry. Do not send sensitive employment, financial, or
              health records through this form.
            </p>
          </div>
          <div>
            <h3>Website and form providers</h3>
            <p>
              AWS Amplify hosts this website. Its hosting infrastructure
              processes technical request information, such as IP address,
              requested URL, browser information, and request time, to deliver
              the site and support security and troubleshooting.
            </p>
            {contactConfig.enabled ? (
              <p>
                {contactConfig.provider} processes form submissions for delivery
                to Cobalt’s privately configured recipient, with associated
                technical information used for delivery and spam prevention.
                See the{" "}
                <a href={contactConfig.privacyUrl}>
                  {contactConfig.provider} privacy information
                </a>
                .
              </p>
            ) : (
              <p>
                Form delivery is currently unavailable. No form information is
                transmitted while the form is disabled.
              </p>
            )}
          </div>
          <div>
            <h3>Use of submissions</h3>
            <p>
              Information submitted through this form is used to review and
              respond to organizational or privacy inquiries and related
              follow-up. The website does not include analytics, advertising
              scripts, or embedded social feeds. Fonts and brand images are
              served with the site.
            </p>
          </div>
          <div>
            <h3>Retention and privacy requests</h3>
            {contactConfig.enabled && (
              <p>
                {site.contact.archiveNotice} See the{" "}
                <a href={contactConfig.documentationUrl}>
                  {contactConfig.provider} documentation
                </a>
                .
              </p>
            )}
            <p>
              Cobalt’s retention of received inquiries depends on the inquiry,
              related business records, and applicable obligations; this policy
              does not specify a fixed deletion period for Cobalt’s records.
              To ask about your information or request
              deletion, use the <a href="#contact">contact form</a> and identify
              the request in your message. Additional information may be needed
              to verify a request. Deletion may be limited by recordkeeping
              obligations.
            </p>
          </div>
          <div>
            <h3>Security and location</h3>
            <p>
              This is a United States organizational website. Hosting and any
              enabled form processing involve service-provider infrastructure;
              this policy does not promise a particular data-storage location.
              Internet transmission and storage cannot be guaranteed completely
              secure.
            </p>
          </div>
          <div>
            <h3>Policy updates</h3>
            <p>
              Changes to this website or its information practices may require
              an updated policy. The date above identifies this version. For
              questions about this policy, use the{" "}
              <a href="#contact">contact form</a>. If it is unavailable, please
              return later; no request is sent while it is disabled.
            </p>
          </div>
        </div>
      </section>
      <section
        id="terms"
        className="policy-section"
        aria-labelledby="terms-title"
      >
        <h2 id="terms-title">Website terms</h2>
        <p>
          This website provides general organizational information about{" "}
          {site.name}. Its material is not legal, tax, insurance, benefits, or
          regulatory advice.
        </p>
        <p>
          {site.publicServiceNotice} The affiliate reimbursement information
          describes internal arrangements and is not public pricing or an offer
          to outside customers.
        </p>
        <p>
          The contact form is not a general job application. Submitting it does
          not create an employment, staffing, client, advisory, or contractual
          relationship. Any such relationship requires separate, appropriate
          arrangements.
        </p>
        <p>
          {site.adp.relationship} Cobalt does not own, operate, resell, or
          represent ADP. Naming ADP TotalSource does not imply ADP’s endorsement
          of Cobalt. Links to individual profiles identify the founder; other
          professional roles shown there are not Cobalt roles.
        </p>
      </section>
    </div>
  );
}

function Footer({ notFound }: { notFound: boolean }) {
  const prefix = notFound ? "/" : "";
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo />
            <p className="site-footer__tag">
              Workforce administration for affiliated businesses.
            </p>
          </div>
          <div>
            <p className="site-footer__heading">Company</p>
            <ul className="site-footer__list">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <a href={`${prefix}${href}`}>{label}</a>
                </li>
              ))}
              <li>
                <a href={`${prefix}#privacy`}>Privacy policy</a>
              </li>
              <li>
                <a href={`${prefix}#terms`}>Website terms</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="site-footer__heading">Headquarters</p>
            <ul className="site-footer__list">
              <li>
                <Address />
              </li>
              <li>
                <a href={`${prefix}#contact`}>Contact form</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p className="site-footer__legal">
            © {site.policyDate.slice(0, 4)} {site.legalName}.
          </p>
          <p className="site-footer__legal">
            {site.adp.name} is Cobalt’s PEO provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
