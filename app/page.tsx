import Hero from "@/components/Hero";
import ProductFeature from "@/components/ProductFeature";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <ProductFeature />
      <HowItWorks />
      {/* <Testimonials /> */}
      <WhyChooseUs />
    </div>
  );
}