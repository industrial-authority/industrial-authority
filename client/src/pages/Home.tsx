
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import Marquee from "react-fast-marquee";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const marqueeItems = [
    "Procurement Readiness Audit",
    "Digital Authority Engine",
    "Lead Friction Elimination",
    "RFP Compliance Check",
    "Searchability Analysis",
    "Social Proof Review",
    "Conversion Friction Audit",
  ];

  const MarqueeItemComponent = ({ text }: { text: string }) => (
    <div className="text-2xl font-bold text-foreground/80 flex items-center gap-3 border border-border rounded-lg bg-background p-4"> {/* Removed min-w and mr-10 */}
      <CheckCircle className="w-6 h-6 text-accent" />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">IA</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Industrial Authority</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#services" className="text-sm hover:text-accent transition-colors font-medium">Services</a>
            <a href="#audit" className="text-sm hover:text-accent transition-colors font-medium">Audit</a>
            {isAuthenticated ? (
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                Dashboard
              </Button>
            ) : (
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => window.location.href = getLoginUrl()}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(\'https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/industrial-authority-pattern-VABhVmjWtXcb7jtP49iF8r.webp\")",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-in fade-in duration-1000">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-accent/15 border border-accent/40">
                  <span className="text-sm font-bold text-accent tracking-wide uppercase">Digital Procurement Authority</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-foreground">
                  Turn Your Digital Presence Into a
                  <span className="text-accent block mt-2 drop-shadow-sm">$1M Contract Engine</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                  Industrial firms lose contracts because procurement officers see "Digital Red Flags." We eliminate them. Pass the procurement test. Secure your next big deal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/audit-request">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group h-14 px-8 text-lg font-bold shadow-lg shadow-accent/20">
                    Request Digital Capability Audit
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-border hover:bg-card h-14 px-8 text-lg font-bold">
                  Learn How It Works
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/50">
                <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-accent">70%</div>
                  <p className="text-base text-muted-foreground font-medium leading-tight">of procurement officers check your digital presence before calling</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-accent">$100k+</div>
                  <p className="text-base text-muted-foreground font-medium leading-tight">average contract value at risk from poor digital presence</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden group shadow-2xl border border-border/50">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/hero-industrial-facility-VABhVmjWtXcb7jtP49iF8r.webp" 
                alt="Industrial facility"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/60 backdrop-blur-md rounded-xl border border-white/10">
                <p className="text-sm font-bold text-accent uppercase tracking-widest mb-2">Market Insight</p>
                <p className="text-lg font-bold text-foreground leading-snug">"Digital authority is no longer optional in industrial procurement."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-16 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <Marquee gradient={false} speed={40} className="py-4" gap={40}>
          {marqueeItems.map((text, i) => (
            <MarqueeItemComponent key={i} text={text} />
          ))}
        </Marquee>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background relative">
        <div className="container relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              From audit to implementation, we handle every aspect of your digital procurement readiness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group p-10 rounded-2xl bg-card border border-border hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent/20 transition-colors">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4">Digital Capability Audit</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed font-medium">
                Identify the "Red Flags" that cause procurement officers to disqualify you. Get a detailed report of your digital vulnerabilities.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Searchability Analysis</span>
                </div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Social Proof Review</span>
                </div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Conversion Friction Audit</span>
                動
                </div>
              </div>
              <div className="mt-auto pt-8 border-t border-border/50">
                <div className="text-3xl font-extrabold text-accent">$250</div>
                <p className="text-sm text-muted-foreground mt-1 font-bold">One-time investment</p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="group p-10 rounded-2xl bg-card border-2 border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 md:scale-105 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 bg-accent text-accent-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-br-lg">Most Popular</div>
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent/20 transition-colors">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4">Authority Engine</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed font-medium">
                Complete digital transformation. Website, SEO, branding, and email automation. Everything you need to pass the procurement test.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Web Development</span>
                </div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>SEO Optimization</span>
                </div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Email Automation</span>
                </div>
              </div>
              <div className="mt-auto pt-8 border-t border-border/50">
                <div className="text-3xl font-extrabold text-accent">$5,000</div>
                <p className="text-sm text-muted-foreground mt-1 font-bold">Complete setup</p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="group p-10 rounded-2xl bg-card border border-border hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4">Ongoing Authority</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed font-medium">
                Monthly retainer. Continuous optimization, content strategy, and lead nurturing to keep you ahead of competitors.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Monthly Content</span>
                </div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Lead Nurturing</span>
                </div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Performance Analytics</span>
                </div>
              </div>
              <div className="mt-auto pt-8 border-t border-border/50">
                <div className="text-3xl font-extrabold text-accent">$1,500/mo</div>
                <p className="text-sm text-muted-foreground mt-1 font-bold">Billed monthly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Section */}
      <section id="audit" className="py-24 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden group shadow-2xl border border-border/50">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/audit-report-mockup-VABhVmjWtXcb7jtP49iF8r.webp"
                alt="Audit report mockup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-accent/15 border border-accent/40">
                  <span className="text-sm font-bold text-accent tracking-wide uppercase">The Red Flag Report</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                  Uncover the Hidden Risks in Your Digital Presence
                </h2>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                  Our Digital Capability Audit is a comprehensive, data-driven analysis of your entire digital footprint. We identify the exact "Red Flags" that cause procurement officers to hesitate, giving you a clear roadmap for improvement.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="font-bold text-accent-foreground">1</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Searchability & SEO</h4>
                    <p className="text-muted-foreground">Can procurement officers find you for the right keywords? We analyze your search engine ranking and visibility.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="font-bold text-accent-foreground">2</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Social Proof & Reputation</h4>
                    <p className="text-muted-foreground">What do your online reviews, testimonials, and case studies say about you? We assess your digital reputation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="font-bold text-accent-foreground">3</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Website & Conversion</h4>
                    <p className="text-muted-foreground">Is your website professional, easy to navigate, and designed to convert visitors into leads? We audit your user experience.</p>
                  </div>
                </div>
              </div>

              <Link href="/audit-request">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group h-14 px-8 text-lg font-bold shadow-lg shadow-accent/20">
                  Get Your Audit for $250
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Industrial Authority. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
