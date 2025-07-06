import Category from "@/component/Category";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 pb-16">
        <Category />
      </div>
      <Footer />
    </>
  );
} 