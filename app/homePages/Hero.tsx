"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslate } from "@/context/LanguageContext";


import HeroBanner from "@/assets/home/school.jpg";
import HeroBanner2 from "@/assets/home/school_hero_banner.jpg";
import HeroBanner3 from "@/assets/home/school_hero_banner2.jpg";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface HeroBanner {
  id: number;
  image: string;
  title: string;
  content: string;
  cta_text_1: string;
  cta_link_1: string;
  cta_text_2: string;
  cta_link_2: string;
}

const defaultHeroBanner: HeroBanner = {
  id: 0,
  image: "/images/default-hero.jpg",
  title: "Welcome to Our Institution",
  content: "Building futures with quality education and innovation.",
  cta_text_1: "Admissions Open",
  cta_link_1: "/admissions",
  cta_text_2: "Learn More",
  cta_link_2: "/about",
};


const Hero = () => {
  const t = useTranslate();
  const hero_banners = [
  HeroBanner,
  HeroBanner2,
  HeroBanner3,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

   const [heroBanner, setHeroBanner] = useState<HeroBanner>(defaultHeroBanner);
  useEffect(() => {
    async function getData() {
  await axiosInstance.get("/api/v1/landing/banner").then((response)=>{
    console.log("Banner data:",response.data);
    setHeroBanner(response.data.data  || defaultHeroBanner );
  }).catch((error)=>{
    console.error("Error fetching banner data:",error);
    setHeroBanner(defaultHeroBanner);
  });
}
   getData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hero_banners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, );

  return (
    <section className="relative h-112.5 overflow-hidden text-white">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {hero_banners.map((banner, index) => (
          <div key={index} className="relative min-w-full h-full">
            <Image
              src={banner}
              alt={`Hero Banner ${index + 1}`}
              width={10000}
              className="object-cover h-screen"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/40" />

      {/* Content (stays fixed) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          {heroBanner?.title || t("welcome", "Welcome to Our Institution")}
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-200">
          {heroBanner?.content || t("heroContent", "Building futures with quality education and innovation.")}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {heroBanner?.cta_text_1 && heroBanner?.cta_link_1 && (
            <a
              href={heroBanner.cta_link_1}
              className="bg-yellow-400 text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-300 transition"
            >
              {heroBanner.cta_text_1 || t("admissionsOpen", "Admissions Open")}
            </a>
          )}

          {heroBanner?.cta_text_2 && heroBanner?.cta_link_2 && (
            <a
              href={heroBanner.cta_link_2}
              className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition"
            >
              {heroBanner.cta_text_2 || t("learnMore", "Learn More")}
            </a>
          )}
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 flex gap-2">
          {hero_banners.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full transition ${
                index === currentIndex
                  ? "bg-yellow-400"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero