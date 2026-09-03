"use client";

import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";
import { DemoCards } from "../components/demo-cards";
import { HowItWorks } from "../components/how-it-works";
import { FeaturesSection } from "../components/features-section";
import { SyntaxSection } from "../components/syntax-section";
import { GetStartedSection } from "../components/get-started-section";
import { Footer } from "../components/footer";
import { CodeDrawer } from "../components/code-drawer";
import { useCodeDrawer } from "../lib/use-code-drawer";

export default function Home() {
  const { codeOpen, setCodeOpen, activeCode, setActiveCode, openCode } =
    useCodeDrawer();

  return (
    <div className="grain">
      <Header />
      <HeroSection />

      <div className="section-divider mx-auto max-w-6xl" />
      <DemoCards openCode={openCode} />

      <div className="section-divider mx-auto max-w-6xl" />
      <HowItWorks openCode={openCode} />

      <div className="section-divider mx-auto max-w-6xl" />
      <FeaturesSection openCode={openCode} />

      <div className="section-divider mx-auto max-w-6xl" />
      <SyntaxSection openCode={openCode} />

      <div className="section-divider mx-auto max-w-6xl" />
      <GetStartedSection openCode={openCode} />

      <Footer />

      <CodeDrawer
        codeOpen={codeOpen}
        setCodeOpen={setCodeOpen}
        activeCode={activeCode}
        setActiveCode={setActiveCode}
      />
    </div>
  );
}
