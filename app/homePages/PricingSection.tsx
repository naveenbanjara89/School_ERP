"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    desc: "For small schools up to 500 students",
    popular: false,
    features: [
      "Up to 500 Students",
      "5 User Accounts",
      "Student Management",
      "Fees Collection",
      "Attendance (Manual)",
      "Basic Reports",
      "Email Support",
      "Front Office",
    ],
  },
  {
    name: "Professional",
    price: "₹9,999",
    period: "/month",
    desc: "For growing schools up to 2,000 students",
    popular: true,
    features: [
      "Up to 2,000 Students",
      "20 User Accounts",
      "All Starter Features",
      "QR & Biometric Attendance",
      "Online Exams",
      "Certificate Designer",
      "SMS & WhatsApp",
      "Transport & Hostel",
      "Library & Inventory",
      "Scholarship Module",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "₹19,999",
    period: "/month",
    desc: "For large institutions, unlimited students",
    popular: false,
    features: [
      "Unlimited Students",
      "Unlimited Users",
      "All Professional Features",
      "Face Recognition Attendance",
      "Geo Tag & Geo Fencing",
      "G-Meet Live Classes",
      "Online Courses",
      "Canteen & Sports",
      "Front CMS",
      "Alumni Module",
      "Student CV Builder",
      "Audit Trail",
      "Dedicated Account Manager",
      "Custom Integrations",
    ],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your school. All plans include free setup and 30-day trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 ${
                plan.popular
                  ? "ring-2 ring-primary scale-105"
                  : "border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hero-gradient text-black text-sm bg-transparent  font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="font-heading text-xl font-bold text-foreground">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {plan.desc}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm">
                  {plan.period}
                </span>
              </div>

              <Link href="/login">
                <Button
                  className={`w-full mb-6 ${
                    plan.popular ? "bg-hero-gradient hover:opacity-90" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Start Free Trial
                </Button>
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;