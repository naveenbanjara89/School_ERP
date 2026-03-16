"use client"

import { axiosInstance } from "@/apiHome/axiosInstanc";
import Image from "next/image";
import { useEffect, useState } from "react";




interface InfoSectionItem {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  reverse?: boolean;
  image?: string;
}


const defaultSections: InfoSectionItem[] = [
  {
    title: "Quality Education",
    description: "We provide top-notch education for all students.",
    ctaText: "Learn More",
    ctaLink: "/programs",
    image: "/home/school.jpg",
  },
  {
    title: "Expert Faculty",
    description: "Our teachers are highly experienced and dedicated.",
    ctaText: "Meet Faculty",
    ctaLink: "/faculty",
    reverse: true,
    image: "/home/faculty.jpg",
  },
];


const InfoSection = () => {
  const [sections, setSections] = useState<InfoSectionItem[]>(defaultSections);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axiosInstance.get("/api/v1/landing/programs")
        console.log("InfoSection data:", response.data);
        setSections(response.data.data || defaultSections);
      } catch (error) {
        console.error("Error fetching InfoSection data:", error);
        setSections(defaultSections);
      }
    }

    getData();
  }, []);

  return (
    <>
      {sections.map((item, index) => (
        <section key={index} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            
            {/* Image (UNCHANGED) */}
            <div
              className={`md:w-1/2 relative h-64 md:h-96 rounded-xl overflow-hidden ${
                item.reverse ? "md:order-2" : ""
              }`}
            >
              <Image
                src="/home/school.jpg"
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                {item.title}
              </h2>

              <p className="text-gray-600 mb-6">
                {item.description}
              </p>

              {item.ctaText && item.ctaLink && (
                <a
                  href={item.ctaLink}
                  className="inline-block bg-blue-400/30 text-blue-900 px-6 py-3 rounded-lg font-semibold transition"
                >
                  {item.ctaText}
                </a>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default InfoSection