import AnnouncementBar from "@/components/AnnouncementBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeeCalculator from "@/components/FeeCalculator";
import ProblemStatement from "@/components/ProblemStatement";
import Features from "@/components/Features";
import ComparisonTable from "@/components/ComparisonTable";
import HowItWorks from "@/components/HowItWorks";
import DashboardPreview from "@/components/DashboardPreview";
import Pricing from "@/components/Pricing";
import EarlyAccess from "@/components/EarlyAccess";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

/**
 * Landing page section flow (USP = Mutual Fund Fee Intelligence):
 * 1. Announcement Bar — MF fee audit hook
 * 2. Hero — "your MF is bleeding hidden fees" + fee audit mockup + social proof
 * 3. FeeCalculator — interactive proof (show the fee problem concretely)
 * 4. ProblemStatement — fee-focused data/metrics (₹3.2L+ hidden costs)
 * 5. Features — Fee Transparency FIRST, then Portfolio Intelligence
 * 6. ComparisonTable — fee features lead the comparison
 * 7. HowItWorks — 3 steps to fee transparency
 * 8. DashboardPreview — fee audit dashboard preview
 * 9. Pricing — fee audit is core of free tier
 * 10. EarlyAccess — "Stop overpaying. Start auditing."
 * 11. FAQ — MF fee questions first
 * 12. Footer
 */
const Index = () => (
  <div className="min-h-screen bg-background">
    <AnnouncementBar />
    <Nav />
    <Hero />
    <FeeCalculator />
    <ProblemStatement />
    <Features />
    <ComparisonTable />
    <HowItWorks />
    <DashboardPreview />
    <Pricing />
    <EarlyAccess />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
