import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";
import { DemoCards } from "../components/demo-cards";
import { HowItWorks } from "../components/how-it-works";
import { FeaturesSection } from "../components/features-section";
import { SyntaxSection } from "../components/syntax-section";
import { GetStartedSection } from "../components/get-started-section";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />

      <div className="section-divider mx-auto max-w-7xl" />
      <DemoCards />

      <div className="section-divider mx-auto max-w-7xl" />
      <HowItWorks />

      <div className="section-divider mx-auto max-w-7xl" />
      <FeaturesSection />

      <div className="section-divider mx-auto max-w-7xl" />
      <SyntaxSection />

      <div className="section-divider mx-auto max-w-7xl" />
      <GetStartedSection />

      <Footer />
    </div>
  );
}
