import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Features from "../homePages/Features";
import InfoSection from "../homePages/InfoSection";
import FAQ from "../homePages/FAQ";
import Testimonials from "../homePages/Testimonials";
import Hero from "../homePages/Hero";
import Stats from "../homePages/stats";
import PricingSection from "../homePages/PricingSection";

const Page=()=>{
    return(
        <div>
            <Navbar/>
            <Hero/>
            <Stats/>
            <Features/>
            <PricingSection/>
            <InfoSection/>
            <Testimonials/>
            <FAQ/>
            <Footer/>
        </div>
    )
}

export default Page;
