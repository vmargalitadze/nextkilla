"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react";

const Footer = () => {
    const t = useTranslations("footer");

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-center items-center">

                    <div className="flex flex-wrap justify-center items-start gap-8 max-w-6xl">

                        {/* Company Info */}
                        <div className="w-full md:w-[30%] lg:w-1/3 space-y-6 flex flex-col h-full">
                            <div className="flex items-center space-x-3">
                                <Image
                                    src="/logo.jpg"
                                    alt="Kila Travel"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    {t("company_name")}
                                </h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                {t("company_desc")}
                            </p>

                            {/* Social Media */}
                            <div className="flex space-x-4 mt-auto">
                                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors duration-300">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                     
                        {/* Contact Info */}
                        <div className="w-full md:w-[30%] lg:w-1/3 space-y-6 flex flex-col h-full">
                            <h4 className="text-lg font-semibold text-white border-b border-orange-500 pb-2">
                                {t("contact_info")}
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm leading-relaxed">
                                        {t("address")}
                                    </span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">
                                        {t("phone")}
                                    </span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">
                                        {t("email")}
                                    </span>
                                </li>
                            </ul>
                        </div>


                    </div>

                </div>
            </div>


        </footer>
    );
};

export default Footer;