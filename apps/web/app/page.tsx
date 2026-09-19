import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";
import { DemoCards } from "../components/demo-cards";
import { GetStartedSection } from "../components/get-started-section";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />

      <DemoCards />

      <GetStartedSection />

      <Footer />
    </div>
  );
}
