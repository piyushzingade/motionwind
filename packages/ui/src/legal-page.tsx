import type { ReactNode } from "react";
import { LegalLinks } from "./legal-links";

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-7 opacity-75">{children}</div>
    </section>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="How Motionwind handles information when you use our websites, documentation, and playground."
    >
      <LegalSection title="Information we collect">
        <p>
          We collect information you provide directly, such as feedback
          messages, and limited technical information needed to keep the
          services reliable.
        </p>
        <p>
          When analytics are enabled, we may collect page views, sessions,
          performance signals, and interaction events. We do not use analytics
          to collect passwords, payment details, or other sensitive personal
          information.
        </p>
      </LegalSection>
      <LegalSection title="How we use information">
        <p>
          We use information to operate, secure, improve, and understand
          Motionwind, respond to requests, and maintain documentation and
          developer tools.
        </p>
      </LegalSection>
      <LegalSection title="Third-party services">
        <p>
          Motionwind may use hosting, analytics, source-control, and
          error-monitoring providers. Those providers process information under
          their own policies and only as needed to provide their services.
        </p>
      </LegalSection>
      <LegalSection title="Your choices">
        <p>
          You can limit analytics through browser settings or content blockers.
          You can also contact us through the project repository to ask
          questions about information associated with your request.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          For privacy questions, open an issue at{" "}
          <a
            className="underline underline-offset-4"
            href="https://github.com/piyushzingade/motionwind/issues"
          >
            github.com/piyushzingade/motionwind
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}

export function TermsOfServicePage() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro="The simple terms for using Motionwind's websites, documentation, packages, and playground."
    >
      <LegalSection title="Using Motionwind">
        <p>
          You may use Motionwind and its documentation for lawful personal,
          commercial, and educational projects, subject to the licenses included
          with each package and repository.
        </p>
      </LegalSection>
      <LegalSection title="Open-source licenses">
        <p>
          Motionwind source code is provided under the applicable open-source
          license in the repository. Those licenses control your rights to copy,
          modify, and distribute the software.
        </p>
      </LegalSection>
      <LegalSection title="Your responsibility">
        <p>
          You are responsible for your projects, dependencies, deployments, and
          compliance with laws that apply to your use of Motionwind. Do not use
          the services to abuse, disrupt, or attempt to gain unauthorized access
          to systems.
        </p>
      </LegalSection>
      <LegalSection title="Availability and warranties">
        <p>
          Motionwind is provided on an “as is” and “as available” basis. We may
          change, pause, or discontinue hosted experiences, documentation, or
          playground features without guaranteeing uninterrupted availability.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update these terms as the project evolves. The effective date
          below indicates the latest revision.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Questions about these terms can be raised at{" "}
          <a
            className="underline underline-offset-4"
            href="https://github.com/piyushzingade/motionwind/issues"
          >
            github.com/piyushzingade/motionwind
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}

function LegalDocument({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
      <header className="mb-12 space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-55">
          Motionwind
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 opacity-70">{intro}</p>
        <p className="text-xs opacity-50">Effective September 20, 2026</p>
      </header>
      <div className="space-y-10">{children}</div>
      <footer className="mt-16 border-t border-current/10 pt-6 text-xs opacity-60">
        <LegalLinks />
      </footer>
    </main>
  );
}
