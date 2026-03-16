import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

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
  ];

  const MarqueeItemComponent = ({ text }: { text: string }) => (
    <span className="text-2xl font-bold text-foreground/80 flex items-center gap-3 flex-shrink-0 px-4">
      <CheckCircle className="w-6 h-6 text-accent" /> {text}
    </span>
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
            backgroundImage: "url(\'https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/industrial-authority-pattern-VABhVmjWtXcb7jtP49iF8r.webp\')",
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/60 backdrop-blur-md rounded-xl border border-white/10">
                <p className="text-sm font-bold text-accent uppercase tracking-widest mb-2">Market Insight</p>
                <p className="text-lg font-bold text-foreground leading-snug">"Digital authority is no longer optional in industrial procurement."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-16 bg-card border-y border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="flex whitespace-nowrap marquee-container">
          <div className="flex animate-marquee gap-12 items-center pr-12">
            {marqueeItems.map((text, i) => (
              <MarqueeItemComponent key={i} text={text} />
            ))}
            {marqueeItems.map((text, i) => (
              <MarqueeItemComponent key={`duplicate-${i}`} text={text} />
            ))}
            {marqueeItems.map((text, i) => (
              <MarqueeItemComponent key={`duplicate2-${i}`} text={text} />
            ))} {/* Duplicate content for seamless loop */}
          </div>
        </div>
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
                  <span>Performance Tracking</span>
                </div>
              </div>
              <div className="mt-auto pt-8 border-t border-border/50">
                <div className="text-3xl font-extrabold text-accent">$2,500<span className="text-lg font-bold text-muted-foreground">/mo</span></div>
                <p className="text-sm text-muted-foreground mt-1 font-bold">Monthly optimization</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        .marquee-container {
          overflow: hidden;
        }

        .marquee-container .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content; /* Ensure content takes up full width */
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%); /* Adjust to half the content width for seamless loop */
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
