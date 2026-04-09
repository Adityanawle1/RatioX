import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemStatement from "@/components/ProblemStatement";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import WhoIsItFor from "@/components/WhoIsItFor";
import DashboardPreview from "@/components/DashboardPreview";
import EarlyAccess from "@/components/EarlyAccess";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Nav />
    <Hero />
    <ProblemStatement />
    <Features />
    <HowItWorks />
    <WhoIsItFor />
    <DashboardPreview />
    <EarlyAccess />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
