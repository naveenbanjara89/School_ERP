"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import Hero from "@/assets/home/school.jpg";

type ContactBlock = {
  title: string;
  address: string;
  phone: string;
  email: string;
};

const defaultContactBlock: ContactBlock = {
  title: "Contact Us",
  address: "Digimate, Vaishali Nagar, Jaipur, Rajasthan",
  phone: "+91 9876543210",
  email: "contact@example.com",
};

export default function Page() {
  const [contactBlock, setContactBlock] =
    useState<ContactBlock>(defaultContactBlock);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axiosInstance.get("/api/v1/landing/contact");
        setContactBlock(response.data?.data ?? defaultContactBlock);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setContactBlock(defaultContactBlock);
      }
    }
    getData();
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src={Hero}
          alt="Contact Us"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/70" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="uppercase tracking-widest text-sm text-primary mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-6 text-gray-200 text-lg md:text-xl">
            We’d love to hear from students, parents, and visitors.
            Reach out to us anytime.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg">Send Message</Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white bg-black border-white"
            >
              Call Now
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Visit Us",
                value: contactBlock.address,
                icon: <MapPin className="h-9 w-9" />,
              },
              {
                title: "Call Us",
                value: contactBlock.phone,
                icon: <Phone className="h-9 w-9" />,
              },
              {
                title: "Email Us",
                value: contactBlock.email,
                icon: <Mail className="h-9 w-9" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-background p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-transparent hover:border-primary/40"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* CONTACT FORM */}
          <div className="max-w-3xl mx-auto bg-background p-10 rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Send Us a Message</h3>
              <p className="text-muted-foreground mt-2">
                We usually reply within 24 hours
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="input"
              />

              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="input resize-none"
              />

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90"
              >
                Send Message 🚀
              </Button>
            </form>
          </div>

          {/* MAP */}
          <div className="mt-24 rounded-3xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=Vaishali%20Nagar%20Jaipur&output=embed"
              className="w-full h-[400px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}









// "use client";
// import Navbar from "@/components/common/Navbar";
// import Footer from "@/components/common/Footer";
// import Hero from "@/assets/home/school.jpg"
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Mail, MapPin, Phone } from "lucide-react";
// import { useEffect, useState } from "react";
// import { axiosInstance } from "@/apiHome/axiosInstanc";



// type ContactBlock = {
//   title: string;
//   address: string;
//   phone: string;
//   email: string;
// };

// const defaultContactBlock: ContactBlock = {
//   title: "Contact Us",
//   address: "digimate Vaishali Nagar Jaipur, Rajasthan",
//   phone: "+91 9876543210",
//   email: "contact@example.com",
// };

// export default function Page() {

//   const [contactBlock, setContactBlock] =
//     useState<ContactBlock>(defaultContactBlock);

//   useEffect(() => {
//     async function getData() {
//       try {
//         const response = await axiosInstance.get(
//           "/api/v1/landing/contact"
//         );
//         console.log("Contact data:", response.data);

//         setContactBlock(
//           response.data?.data ?? defaultContactBlock
//         );
//       } catch (error) {
//         console.error("Error fetching contact data:", error);
//         setContactBlock(defaultContactBlock);
//       }
//     }

//     getData();
//   }, []);

//   return (
//     <>
//       <Navbar />
//         <section id="contact" className="py-20 px-4 bg-muted/30">
//           <div className="max-w-6xl mx-auto">
//             {/* <div className="text-center mb-16">
//               <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
//                 {contactBlock.title}
//               </h2>
//               <div className="w-24 h-1 bg-primary mx-auto mb-6" />
//               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                 We`d love to hear from you. Reach out to us with any questions.
//               </p>
//             </div> */}
//             <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-white">
//             <div className="absolute inset-0">
//               <Image
//                 src={Hero}
//                 alt="Contact Us"
//                 width={2000}
//                 priority
//                 className="object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
//             </div>

//           <div className="relative z-10 text-center px-6 max-w-3xl">
//             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
//               Contact Us
//             </h1>
//             <p className="mt-6 text-gray-200 text-lg md:text-xl">
//               We’d love to hear from students, parents, and visitors.  
//               Send us your questions or messages anytime.
//             </p>
//           </div>
//             </section>

//             <div className="grid md:grid-cols-3 gap-8 mb-12">
//               <div className="bg-background p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <MapPin className="h-8 w-8 text-primary" />
//                 </div>
//                 <h3 className="font-semibold text-foreground mb-2">Visit Us</h3>
//                 <p className="text-muted-foreground text-sm">{contactBlock.address}</p>
//               </div>
//               <div className="bg-background p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Phone className="h-8 w-8 text-primary" />
//                 </div>
//                 <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
//                 <p className="text-muted-foreground text-sm">{contactBlock.phone}</p>
//               </div>
//               <div className="bg-background p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Mail className="h-8 w-8 text-primary" />
//                 </div>
//                 <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
//                 <p className="text-muted-foreground text-sm">{contactBlock.email}</p>
//               </div>
//             </div>

//             {/* Contact Form */}
//             <div className="max-w-2xl mx-auto bg-background p-8 rounded-2xl shadow-lg">
//               <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Send us a Message</h3>
//               <form className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
//                       placeholder="John"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
//                       placeholder="Doe"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Email</label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
//                     placeholder="john@example.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Message</label>
//                   <textarea
//                     rows={4}
//                     className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
//                     placeholder="How can we help you?"
//                   />
//                 </div>
//                 <Button type="submit" size="lg" className="w-full">
//                   Send Message
//                 </Button>
//               </form>
//             </div>
//           </div>
//         </section>
//       <Footer/>
//     </>
//   );
// }








{/* <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        {/* <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-white">
          <div className="absolute inset-0">
            <Image
              src={Hero}
              alt="Contact Us"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Contact Us
            </h1>
            <p className="mt-6 text-gray-200 text-lg md:text-xl">
              We’d love to hear from students, parents, and visitors.  
              Send us your questions or messages anytime.
            </p>
          </div>
        </section> */}

        {/* Contact Form Section */}
        {/* <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Info */}
            {/* <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Get in Touch
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Whether you are a student, parent, or visitor, feel free to
                reach out to us. Our team will respond as soon as possible.
              </p>

              <ul className="mt-6 space-y-3 text-gray-700">
                <li>📍 School Campus, Main City</li>
                <li>📧 info@school.com</li>
                <li>📞 +123 456 7890</li>
              </ul>
            </div> */}

            {/* Form */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message..."
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-700 text-white py-3 font-semibold hover:bg-blue-800 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div> */}
          {/* </div>
        </section> */} 
      {/* </main> */}
