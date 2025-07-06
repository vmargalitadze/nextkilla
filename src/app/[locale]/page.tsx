
import Booking from "@/component/Booking";
import Category from "@/component/Category";
import Company from "@/component/Company";
import CompanyFilter from "@/component/CompanyFilter";
import Dest from "@/component/Dest";
import Footer from "@/component/Footer";
import Hero from "@/component/Hero";

import Top from "@/component/Top";

export default function Home() {
  return (
    <>
      <Hero />
      <CompanyFilter />
      {/* <Info /> */}
      <Booking />
      <Category />
      <Top />
      <Dest />
      <Company />
      <Footer />
    </>

  );
}
