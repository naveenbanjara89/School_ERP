// "use client";

// import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// const plans = [
//   {
//     name: "Starter",
//     price: "₹4,999",
//     period: "/month",
//     desc: "For small schools up to 500 students",
//     popular: false,
//     features: [
//       "Up to 500 Students",
//       "5 User Accounts",
//       "Student Management",
//       "Fees Collection",
//       "Attendance (Manual)",
//       "Basic Reports",
//       "Email Support",
//       "Front Office",
//     ],
//   },
//   {
//     name: "Professional",
//     price: "₹9,999",
//     period: "/month",
//     desc: "For growing schools up to 2,000 students",
//     popular: true,
//     features: [
//       "Up to 2,000 Students",
//       "20 User Accounts",
//       "All Starter Features",
//       "QR & Biometric Attendance",
//       "Online Exams",
//       "Certificate Designer",
//       "SMS & WhatsApp",
//       "Transport & Hostel",
//       "Library & Inventory",
//       "Scholarship Module",
//       "Priority Support",
//     ],
//   },
//   {
//     name: "Enterprise",
//     price: "₹19,999",
//     period: "/month",
//     desc: "For large institutions, unlimited students",
//     popular: false,
//     features: [
//       "Unlimited Students",
//       "Unlimited Users",
//       "All Professional Features",
//       "Face Recognition Attendance",
//       "Geo Tag & Geo Fencing",
//       "G-Meet Live Classes",
//       "Online Courses",
//       "Canteen & Sports",
//       "Front CMS",
//       "Alumni Module",
//       "Student CV Builder",
//       "Audit Trail",
//       "Dedicated Account Manager",
//       "Custom Integrations",
//     ],
//   },
// ];

// const PricingSection = () => {
//   return (
//     <section id="pricing" className="py-20 bg-muted/50">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-14"
//         >
//           <span className="text-primary text-sm font-semibold uppercase tracking-wider">
//             Pricing
//           </span>
//           <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">
//             Simple, Transparent Pricing
//           </h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Choose the plan that fits your school. All plans include free setup and 30-day trial.
//           </p>
//         </motion.div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {plans.map((plan, i) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className={`relative bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 ${
//                 plan.popular
//                   ? "ring-2 ring-primary scale-105"
//                   : "border border-border"
//               }`}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hero-gradient text-black text-sm bg-transparent  font-medium px-4 py-1 rounded-full">
//                   Most Popular
//                 </div>
//               )}

//               <h3 className="font-heading text-xl font-bold text-foreground">
//                 {plan.name}
//               </h3>
//               <p className="text-sm text-muted-foreground mt-1 mb-4">
//                 {plan.desc}
//               </p>

//               <div className="flex items-baseline gap-1 mb-6">
//                 <span className="font-heading text-4xl font-extrabold text-foreground">
//                   {plan.price}
//                 </span>
//                 <span className="text-muted-foreground text-sm">
//                   {plan.period}
//                 </span>
//               </div>

//               <Link href="/login">
//                 <Button
//                   className={`w-full mb-6 ${
//                     plan.popular ? "bg-hero-gradient hover:opacity-90" : ""
//                   }`}
//                   variant={plan.popular ? "default" : "outline"}
//                 >
//                   Start Free Trial
//                 </Button>
//               </Link>

//               <ul className="space-y-3">
//                 {plan.features.map((feature) => (
//                   <li key={feature} className="flex items-start gap-2 text-sm">
//                     <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
//                     <span className="text-muted-foreground">{feature}</span>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PricingSection;

"use client";

import { Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Basic",
    subtitle: "0 – 300 Students",
    level: "25% Essential Level",
    price: "Contact Us",
    period: "",
    popular: false,
    features: [
      "Single Branch Only",
      "Manual Attendance + Monthly Summary",
      "Basic Admission & Student Management",
      "Exam Marks Entry + Report Card PDF",
      "Simple Fee Collection",
      "Fixed WhatsApp Templates",
      "Basic Admin Dashboard",
      "Staff Directory + Attendance + Leave",
      "Front Office (Enquiry / Visitor Log)",
      "PDF Reports Only",
    ],
  },
  {
    name: "Standard",
    subtitle: "0 – 700 Students",
    level: "50% Growing School Level",
    price: "Contact Us",
    period: "",
    popular: true,
    features: [
      "All Basic Features Included",
      "Multi-Branch Support (Limited)",
      "QR Code Attendance + Leave Approval",
      "Custom WhatsApp Templates + Scheduling",
      "Installment + Discount + Late Fee",
      "Library Management",
      "Transport Management",
      "Inventory Management",
      "Website Builder (CMS)",
      "ID Card Designer & Generator",
      "Excel Export Reports",
    ],
  },
  {
    name: "Premium",
    subtitle: "1500+ Students",
    level: "100% Complete ERP Solution",
    price: "Contact Us",
    period: "",
    popular: false,
    features: [
      "All Basic & Standard Features",
      "Face / Biometric / Geo Attendance",
      "Full Online Examination Platform",
      "Live Class (Zoom / Google Meet)",
      "Hostel Management",
      "Canteen with Student Wallet",
      "Advanced Reports (Charts + Scheduler)",
      "Advanced Fee System with Refunds",
      "Student CV Builder",
      "Teacher Rating System",
      "Complete System & Security Controls",
    ],
  },
];

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
            💰 Simple Pricing
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Plans that Scale with You
          </h2>

          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free for 14 days, then pick the plan that fits your school.
          </p>

          {/* Toggle */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center bg-muted rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  !annual
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>

              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  annual
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground"
                }`}
              >
                Annually
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border flex flex-col ${
                plan.popular
                  ? "bg-primary text-primary-foreground scale-[1.02]"
                  : "bg-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              {/* Title */}
              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm opacity-70">
                  {plan.subtitle} | {plan.level}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-extrabold">
                  {plan.price}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button className="w-full gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            All plans include: Teacher Panel • Parent Portal • WhatsApp & Email
            Automation • Payment Gateway • Auto Fee Receipts • Secure Login
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;