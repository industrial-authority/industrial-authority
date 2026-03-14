import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { initializeFlutterwavePayment, generateTransactionRef } from "@/services/flutterwave";
import { toast } from "sonner";

export default function AuditRequest() {
  const [formData, setFormData] = useState<{
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyWebsite: string;
    industry: string;
    auditType: "basic" | "authority_engine" | "ongoing";
  }>({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    industry: "",
    auditType: "basic",
  });

  const [submitted, setSubmitted] = useState(false);
  const createAuditMutation = trpc.audits.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: "basic" | "authority_engine" | "ongoing") => {
    setFormData((prev) => ({ ...prev, auditType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.companyName || !formData.companyEmail || !formData.industry) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // First save the audit request
      await createAuditMutation.mutateAsync(formData);
      
      // Get audit price
      const prices: Record<string, number> = {
        basic: 250,
        authority_engine: 5000,
        ongoing: 2500,
      };
      
      const price = prices[formData.auditType] || 250;
      const txRef = generateTransactionRef();
      
      // Initialize Flutterwave payment
      const paymentPayload = {
        tx_ref: txRef,
        amount: price,
        currency: "NGN",
        payment_options: "card,ussd,bank_transfer,mobilemoney",
        customer: {
          email: formData.companyEmail,
          phonenumber: formData.companyPhone || "0000000000",
          name: formData.companyName,
        },
        customizations: {
          title: "Industrial Authority",
          description: `${formData.auditType.replace(/_/g, " ")} - ${formData.companyName}`,
          logo: "https://industrial-authority.github.io/industrial-authority/assets/logo.png",
        },
        meta: {
          auditType: formData.auditType,
          companyName: formData.companyName,
          industry: formData.industry,
        },
      };
      
      // Save audit data and trigger payment
      localStorage.setItem('pendingAudit', JSON.stringify({
        ...formData,
        price,
        txRef,
        createdAt: new Date().toISOString(),
      }));
      
      // Initialize payment
      initializeFlutterwavePayment(paymentPayload);
      
    } catch (error) {
      console.error("Error submitting audit request:", error);
      toast.error("Failed to process request");
    }
  };

  const auditPrices = {
    basic: "$250",
    authority_engine: "$5,000",
    ongoing: "$2,500/month",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">IA</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Industrial Authority</span>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="container max-w-2xl">
          <Link href="/" className="flex items-center gap-2 text-accent hover:text-accent/80 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {submitted ? (
            <Card className="border-accent/30 bg-card">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-accent" />
                </div>
                <CardTitle className="text-2xl">Audit Request Submitted!</CardTitle>
                <CardDescription className="text-base mt-2">
                  Thank you for requesting your Digital Capability Audit. We've received your information and will contact you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>What's Next?</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-2 list-disc list-inside">
                    <li>We'll analyze your digital presence</li>
                    <li>Identify "Red Flags" that cost you contracts</li>
                    <li>Send you a comprehensive audit report</li>
                    <li>Discuss how to pass the procurement test</li>
                  </ul>
                </div>
                <Button onClick={() => setSubmitted(false)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Submit Another Audit Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Request Your Digital Capability Audit</CardTitle>
                <CardDescription>
                  Get a comprehensive analysis of your digital presence and discover the "Red Flags" costing you contracts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Company Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        required
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Email Address *</Label>
                        <Input
                          id="companyEmail"
                          name="companyEmail"
                          type="email"
                          value={formData.companyEmail}
                          onChange={handleInputChange}
                          placeholder="your@company.com"
                          required
                          className="bg-input border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyPhone">Phone Number</Label>
                        <Input
                          id="companyPhone"
                          name="companyPhone"
                          type="tel"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className="bg-input border-border"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyWebsite">Website</Label>
                        <Input
                          id="companyWebsite"
                          name="companyWebsite"
                          type="url"
                          value={formData.companyWebsite}
                          onChange={handleInputChange}
                          placeholder="https://yourcompany.com"
                          className="bg-input border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          placeholder="Manufacturing, Logistics, etc."
                          className="bg-input border-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Audit Type Selection */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Select Your Audit Type</h3>

                    <div className="space-y-2">
                      <Label htmlFor="auditType">Audit Type *</Label>
                      <Select value={formData.auditType} onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Choose an audit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">
                            <div>
                              <p className="font-semibold">Digital Capability Audit - {auditPrices.basic}</p>
                              <p className="text-xs text-muted-foreground">Identify red flags and vulnerabilities</p>
                            </div>
                          </SelectItem>
                          <SelectItem value="authority_engine">
                            <div>
                              <p className="font-semibold">Authority Engine - {auditPrices.authority_engine}</p>
                              <p className="text-xs text-muted-foreground">Complete digital transformation</p>
                            </div>
                          </SelectItem>
                          <SelectItem value="ongoing">
                            <div>
                              <p className="font-semibold">Ongoing Authority - {auditPrices.ongoing}</p>
                              <p className="text-xs text-muted-foreground">Monthly optimization & support</p>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                      <p className="text-sm font-semibold text-accent mb-2">Selected: {formData.auditType.replace(/_/g, " ").toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        Price: <span className="font-semibold text-foreground">{auditPrices[formData.auditType]}</span>
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={createAuditMutation.isPending}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11"
                  >
                    {createAuditMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Proceed to Payment - ₦${formData.auditType === 'basic' ? '250' : formData.auditType === 'authority_engine' ? '5,000' : '2,500'}`
                    )}
                  </Button>

                  {createAuditMutation.isError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                      <p className="text-sm text-destructive">
                        Error: {createAuditMutation.error?.message || "Failed to submit audit request"}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Flutterwave. Your data is encrypted and protected.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
