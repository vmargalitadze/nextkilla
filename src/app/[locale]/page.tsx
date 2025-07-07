"use client";
import { useParams } from "next/navigation";
import Booking from "@/component/Booking";
import Category from "@/component/Category";
import Company from "@/component/Company";
import CompanyFilter from "@/component/CompanyFilter";
import Dest from "@/component/Dest";
import Footer from "@/component/Footer";
import Hero from "@/component/Hero";
import Top from "@/component/Top";

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;

  // Debug logging
  console.log('Main page - params:', params);
  console.log('Main page - locale:', locale);

  return (
    <>
      <Hero />
      <CompanyFilter />
      {/* <Info /> */}
      <Booking locale={locale} />
      <Category />
      <Top locale={locale} />
      <Dest locale={locale} />
      <Company />
      <Footer />
    </>
  );
}
