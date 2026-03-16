"use client";

import { axiosInstance } from "@/apiHome/axiosInstanc";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { useTranslate } from "@/context/LanguageContext";

interface QuickLink {
  id: string;
  name: string;
  route: string;
  visibility: boolean;
}

interface FooterInfo {
  title: string;
  content: string;
  address: string;
  phone: string;
  email: string;
}

interface FooterResponse {
  footer: FooterInfo;
  quick_links: QuickLink[];
}

const defaultFooter: FooterResponse = {
  footer: {
    title: "My School",
    content:
      "We are committed to providing quality education and nurturing future leaders.",
    address: "123 Education Street, Knowledge City",
    phone: "+91 98765 43210",
    email: "info@myschool.com",
  },
  quick_links: [
    { id: "1", name: "Home", route: "/", visibility: true },
    { id: "2", name: "About Us", route: "/about", visibility: true },
    { id: "3", name: "Admissions", route: "/admissions", visibility: true },
    { id: "4", name: "Contact", route: "/contact", visibility: true },
  ],
};

export default function Footer() {
  const t = useTranslate();
  const [footer, setFooter] = useState<FooterResponse>(defaultFooter);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await axiosInstance.get("/api/v1/landing/footer");
        const apiData = res.data?.data;

        setFooter({
          footer: {
            ...defaultFooter.footer,
            ...(apiData?.footer ?? {}),
          },
          quick_links:
            apiData?.quick_links?.length > 0
              ? apiData.quick_links
              : defaultFooter.quick_links,
        });

        console.log("Footer API data:", apiData);
      } catch (error) {
        console.error("Footer API error:", error);
        setFooter(defaultFooter);
      }
    }

    fetchFooter();
  }, []);

  return (
    <footer className="bg-foreground text-background py-12 px-4 border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ABOUT */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {footer?.footer?.title ?? "My School"}
          </h2>
          <p className="text-gray-200">
            {footer?.footer?.content}
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {t("quickLinks", "Quick Links")}
          </h3>
          <ul className="space-y-2">
            {footer?.quick_links
              ?.filter((link) => link?.visibility)
              ?.map((link) => (
                <li key={link?.id}>
                  <Link
                    href={link?.route ?? "/"}
                    className="hover:text-yellow-400 transition"
                  >
                    {t(
                      link?.name?.toLowerCase().replace(/ /g, "") ?? "",
                      link?.name ?? ""
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {t("contactUs", "Contact Us")}
          </h3>

          <p className="text-gray-200 mb-2">
            {footer?.footer?.address ?? t("address", "Address")}
          </p>

          <p className="text-gray-200 mb-2">
            {t("phone", "Phone")}:{" "}
            {footer?.footer?.phone ?? t("phoneNumber", "Phone number")}
          </p>

          <p className="text-gray-200">
            {t("email", "Email")}:{" "}
            {footer?.footer?.email ?? t("emailAddress", "Email address")}
          </p>

          <div className="flex mt-4">
            <FaLinkedin className="text-2xl hover:text-yellow-400 transition cursor-pointer mr-4" />
            <FaFacebookF className="text-2xl hover:text-yellow-400 transition cursor-pointer mr-4" />
            <FaTwitter className="text-2xl hover:text-yellow-400 transition cursor-pointer mr-4" />
            <FaInstagram className="text-2xl hover:text-yellow-400 transition cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-blue-800 mt-8 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()}{" "}
        {footer?.footer?.title ?? "My School"}. All rights reserved.
      </div>
    </footer>
  );
}