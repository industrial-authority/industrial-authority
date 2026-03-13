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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
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
            <a href="#services" className="text-sm hover:text-accent transition-colors">Services</a>
            <a href="#audit" className="text-sm hover:text-accent transition-colors">Audit</a>
            {isAuthenticated ? (
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Dashboard
              </Button>
            ) : (
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => window.location.href = getLoginUrl()}>
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
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/industrial-authority-pattern-VABhVmjWtXcb7jtP49iF8r.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-in fade-in duration-1000">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
                  <span className="text-sm font-medium text-accent">Digital Procurement Authority</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Turn Your Digital Presence Into a
                  <span className="text-accent block mt-2">$1M Contract Engine</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Industrial firms lose contracts because procurement officers see "Digital Red Flags." We eliminate them. Pass the procurement test. Secure your next big deal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/audit-request">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group">
                    Request Digital Capability Audit
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-border hover:bg-card">
                  Learn How It Works
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">70%</div>
                  <p className="text-sm text-muted-foreground">of procurement officers check your social before calling</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">$100k+</div>
                  <p className="text-sm text-muted-foreground">average contract value at risk from poor digital presence</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/hero-industrial-facility-VABhVmjWtXcb7jtP49iF8r.webp"
                alt="Industrial facility"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 bg-card border-y border-border overflow-hidden">
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                <span className="text-lg font-semibold text-muted-foreground">✓ Procurement Readiness Audit</span>
                <span className="text-lg font-semibold text-muted-foreground">✓ Digital Authority Engine</span>
                <span className="text-lg font-semibold text-muted-foreground">✓ Lead Friction Elimination</span>
                <span className="text-lg font-semibold text-muted-foreground">✓ RFP Compliance Check</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From audit to implementation, we handle every aspect of your digital procurement readiness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group p-8 rounded-xl bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Digital Capability Audit</h3>
              <p className="text-muted-foreground mb-6">
                Identify the "Red Flags" that cause procurement officers to disqualify you. Get a detailed report of your digital vulnerabilities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Searchability Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Social Proof Review</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Conversion Friction Audit</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-2xl font-bold text-accent">$250</div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="group p-8 rounded-xl bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 md:scale-105">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Authority Engine</h3>
              <p className="text-muted-foreground mb-6">
                Complete digital transformation. Website, SEO, branding, and email automation. Everything you need to pass the procurement test.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Web Development</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>SEO Optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Email Automation</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-2xl font-bold text-accent">$5,000</div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="group p-8 rounded-xl bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ongoing Authority</h3>
              <p className="text-muted-foreground mb-6">
                Monthly retainer. Continuous optimization, content strategy, and lead nurturing to keep you ahead of competitors.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Monthly Content</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Lead Nurturing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Performance Tracking</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-2xl font-bold text-accent">$2,500/mo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, proven process to transform your digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Audit", desc: "We identify your digital red flags" },
              { num: "02", title: "Strategy", desc: "We create your authority plan" },
              { num: "03", title: "Build", desc: "We implement the solution" },
              { num: "04", title: "Convert", desc: "You start winning contracts" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-accent/20 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute -right-4 top-8 text-accent text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="audit" className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663429849797/PrP2HAoGc2YV6heoDcNCck/procurement-trust-H34qYcLaLv7WRwgzpvPwKf.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Pass the Procurement Test?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start with a $250 Digital Capability Audit. Identify your red flags. Then scale to the Authority Engine and start winning $100k+ contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/audit-request">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group">
                  Get Your Audit Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border hover:bg-card">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold">IA</span>
                </div>
                <span className="font-bold">Industrial Authority</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Digital Procurement Consulting for Manufacturing & Logistics
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Digital Audit</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Authority Engine</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Ongoing Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                <a href="mailto:contact@industrialauthority.com" className="hover:text-accent transition-colors">
                  contact@industrialauthority.com
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Industrial Authority. All rights reserved. | Built by Olamilekan</p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
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
