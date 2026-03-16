"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslate } from "@/context/LanguageContext";

interface NavItem {
  name: string;
  route: string;
}

const defaultMenuItems: NavItem[] = [
  { name: "Home", route: "/" },
  { name: "About", route: "/about" },
  { name: "Contact", route: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<NavItem[]>(defaultMenuItems);
  const t = useTranslate();

  useEffect(() => {
    async function getData() {
      try {
        const response = await axiosInstance.get("/api/v1/landing/navbaritems");
        console.log("Navbar data:", response.data);
        setMenuItems(
        response.data.data?.length
          ? response.data.data
          : defaultMenuItems
      );
      } catch (error) {
        console.error("Navbar API error:", error);
      } 
    }

    getData();
  }, []);

  return (
    <nav className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="text-xl font-bold">
            {t("schoolName", "School")}
          </div>

         
          <div className="hidden md:flex space-x-8 items-center">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.route}>
                {t(item.name.toLowerCase().replace(/ /g, ""), item.name)}
              </Link>
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          
          <div>
            <Link
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="max-md:hidden bg-blue-600 cursor-pointer text-white rounded-3xl p-3 px-5 hover:bg-blue-900 transition"
            >
              {t("login", "Login")}
            </Link>
          </div>

          
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      
      {isOpen && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-40 bg-gray-900 text-white">
          
          <button
            className="absolute top-5 right-5 text-3xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          
          <div className="flex h-full flex-col items-center justify-center space-y-6 text-xl">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.route}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* language + theme for small screen */}
            <LanguageSwitcher />
            <ThemeToggle />

            

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
