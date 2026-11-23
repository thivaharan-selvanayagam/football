import Hero from "@/components/Hero";
import ProductFeature from "@/components/ProductFeature";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <ProductFeature />
      <HowItWorks />
      <WhyChooseUs />
      <FaqSection />
    </div>
  );
}
