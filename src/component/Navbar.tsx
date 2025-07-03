"use client";
import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./switcher";
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("navbar");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Navigation items array
  const navItems = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("news"), href: "/news" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <div>
      <nav
        className={`fixed  top-0 left-0 w-full px-4 py-4 z-[9999] transition-all duration-300
          ${scrolled
            ? "bg-black/80 backdrop-blur text-white shadow"
            : "bg-transparent text-white"}
        `}
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link
            href="/"
            className={`mr-4 block cursor-pointer py-1.5 font-bold text-2xl transition-colors duration-300 ${scrolled ? "text-white" : "text-red-400"}`}
          >
          <Image src="/logo.jpg" alt="logo" className="rounded-full" width={50} height={50} />
          </Link>

          <div className="lg:hidden">
            <button
              className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={toggleMobileMenu}
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </span>
            </button>
          </div>

          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-80 transition-opacity duration-300 lg:hidden"
              onClick={toggleMobileMenu}
            />
          )}

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 z-50 w-full h-full text-white transform transition-transform duration-300
              flex flex-col items-center justify-center
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
              lg:hidden`}
          >
            <button
              onClick={toggleMobileMenu}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
            >
              {/* Close icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ul className="flex flex-col items-center gap-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    onClick={() => setIsMobileMenuOpen(false)}
                    href={item.href}
                    className="text-2xl font-bold"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
          </div>

          {/* Desktop Menu */}
          <div className="hidden  lg:block">
            <ul className="flex  flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex collor items-center p-1 text-lg gap-x-2 transition-colors duration-300"
                >
                  <Link href={item.href} className="flex items-center">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li><LocaleSwitcher /></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
