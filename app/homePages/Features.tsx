"use client"

import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useEffect, useState } from "react";
import { FaBookOpen } from "react-icons/fa";



interface FeatureItem {
  heading: string;
  subheading: string;
  // icon: keyof typeof iconMap;
}


const defaultFeatures: FeatureItem[] = [
  {
    heading: "Student Management",
    subheading: "Easily manage students, profiles, attendance, and records.",
  },
  {
    heading: "Admissions",
    subheading: "Streamline admissions with online forms and automation.",
  },
  {
    heading: "Courses & Classes",
    subheading: "Organize courses, schedules, and class assignments.",
  },
  {
    heading: "Exams & Results",
    subheading: "Create exams, publish results, and track performance.",
  },
  {
    heading: "Fees & Payments",
    subheading: "Collect fees online and manage payment history.",
  },
  {
    heading: "Reports & Analytics",
    subheading: "Get insights with real-time reports and dashboards.",
  },
];


 
const Features = () => {
  const [features, setFeatures] = useState<FeatureItem[]>(defaultFeatures);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axiosInstance.get("/api/v1/landing/features");
        console.log("Features data:", response.data);
        setFeatures(response.data.data?.length ? response.data.data : defaultFeatures);
      } catch (error) {
        console.error("Error fetching features:", error);
        setFeatures(defaultFeatures)
      } 
    }

    getData();
  }, []);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to{" "}
            <span className="text-blue-500">Run Your Institute</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            From admissions to alumni — manage every aspect of your educational
            institution with ease.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 lg:grid-cols-3 gap-6">
          

          {features.map((item, index) => (
            
            <div key={index} className="group relative cursor-pointer scale hover:border-blue-400  rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center border rounded-lg bg-blue-500/10 text-blue-400">
                <FaBookOpen size={22} />
              </div>

              <h3 className="mb-2 text-lg font-semibold">
                {item.heading}
              </h3>

              <p className="text-sm text-gray-400">
                {item.subheading}
              </p>
            </div>
          ))}




          
        </div>

        {/* <TrustBadges /> */}
      </div>
    </section>
  );

};

export default Features