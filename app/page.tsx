import FAQSection from "@/components/landing-page/faq";
import FeaturesSection from "@/components/landing-page/features";
import FooterSection from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import ServicesSection from "@/components/landing-page/service";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
