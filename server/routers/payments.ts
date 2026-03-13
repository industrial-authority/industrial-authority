import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import Stripe from "stripe";
import type { Stripe as StripeType } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Audit pricing in cents
const AUDIT_PRICES = {
  basic: 25000, // $250
  authority_engine: 500000, // $5,000
  ongoing: 250000, // $2,500/month
};

export const paymentsRouter = router({
  /**
   * Create a Stripe checkout session for an audit
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        auditId: z.number(),
        auditType: z.enum(["basic", "authority_engine", "ongoing"]),
        companyName: z.string(),
        companyEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const price = AUDIT_PRICES[input.auditType];
        const origin = ctx.req.headers.origin || "https://industrialauthority.com";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name:
                    input.auditType === "basic"
                      ? "Digital Capability Audit"
                      : input.auditType === "authority_engine"
                      ? "Authority Engine - Complete Digital Transformation"
                      : "Ongoing Authority - Monthly Optimization",
                  description:
                    input.auditType === "basic"
                      ? "Comprehensive analysis of your digital presence"
                      : input.auditType === "authority_engine"
                      ? "Complete digital transformation including web, SEO, branding, and email"
                      : "Monthly optimization, content strategy, and lead nurturing",
                  metadata: {
                    auditType: input.auditType,
                    companyName: input.companyName,
                  },
                },
                unit_amount: price,
              },
              quantity: 1,
            },
          ],
          mode: input.auditType === "ongoing" ? "subscription" : "payment",
          customer_email: input.companyEmail,
          client_reference_id: input.auditId.toString(),
          metadata: {
            auditId: input.auditId.toString(),
            auditType: input.auditType,
            companyName: input.companyName,
            companyEmail: input.companyEmail,
          },
          success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/audit-request`,
          allow_promotion_codes: true,
        });

        if (!session.url) {
          throw new Error("Failed to create checkout session");
        }

        return {
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("Stripe checkout error:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Retrieve checkout session details
   */
  getCheckoutSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          id: session.id,
          status: session.payment_status,
          customerEmail: session.customer_email,
          amount: session.amount_total,
          currency: session.currency,
          metadata: session.metadata,
        };
      } catch (error) {
        console.error("Error retrieving session:", error);
        throw new Error("Failed to retrieve session");
      }
    }),

  /**
   * Get payment history for authenticated user
   */
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const charges = await stripe.charges.list({
        limit: 50,
      });

      return charges.data
        .filter((charge: StripeType.Charge) => charge.metadata?.user_id === ctx.user.id.toString())
        .map((charge: StripeType.Charge) => ({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          created: new Date(charge.created * 1000),
          description: charge.description,
          metadata: charge.metadata,
        }));
    } catch (error) {
      console.error("Error retrieving payment history:", error);
      throw new Error("Failed to retrieve payment history");
    }
  }),

  /**
   * Get invoice details
   */
  getInvoice: publicProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const invoice = await stripe.invoices.retrieve(input.invoiceId);
        return {
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          pdfUrl: (invoice as any).pdf || null,
          created: new Date(invoice.created * 1000),
          dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        };
      } catch (error) {
        console.error("Error retrieving invoice:", error);
        throw new Error("Failed to retrieve invoice");
      }
    }),

  /**
   * Refund a payment
   */
  refundPayment: protectedProcedure
    .input(
      z.object({
        chargeId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify the charge belongs to the user
        const charge: StripeType.Charge = await stripe.charges.retrieve(input.chargeId);
        if ((charge.metadata as any)?.user_id !== ctx.user.id.toString()) {
          throw new Error("Unauthorized");
        }

        const refund = await stripe.refunds.create({
          charge: input.chargeId,
          reason: (input.reason as "duplicate" | "fraudulent" | "requested_by_customer") || "requested_by_customer",
        });

        return {
          success: true,
          refundId: refund.id,
          amount: refund.amount,
          status: refund.status,
        };
      } catch (error) {
        console.error("Error refunding payment:", error);
        throw new Error("Failed to refund payment");
      }
    }),
});
