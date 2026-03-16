import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Image from "next/image";

import heroBanner from "../../assets/home/school_hero_banner.jpg";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <section className="relative h-100 md:h-125 flex items-center justify-center bg-blue-900 text-white">
          <div className="absolute inset-0">
            <Image
              src={heroBanner}
              width={600}
              height={400}
              alt="About Us"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative text-center px-6">
            <h1 className="text-4xl md:text-6xl font-bold">About School</h1>
            <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-lg md:text-xl">
              Dedicated to shaping bright minds with excellence in education,
              values, and holistic development.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src="/home/school.jpg"
                width={600}
                height={400}
                alt="Our Mission"
                className="w-full rounded-xl object-cover h-64 md:h-96"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600">
                Our mission is to provide high-quality education while fostering
                strong moral values, creativity, and critical thinking. We
                strive to nurture well-rounded individuals prepared for success
                in life.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src="/home/school.jpg"
                alt="Our Vision"
                width={600}
                height={400}
                className="w-full rounded-xl object-cover h-64 md:h-96"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600">
                To become a leading institution known for excellence in
                education, innovative teaching, and producing responsible,
                confident, and compassionate students ready to face the
                challenges of the modern world.
              </p>
            </div>
          </div>
        </section>

        {/* <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">
              Our Core Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  Striving for the highest standards in education and personal
                  growth.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Integrity
                </h3>
                <p className="text-gray-600">
                  Fostering honesty, responsibility, and ethical behavior in our
                  students.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Creativity
                </h3>
                <p className="text-gray-600">
                  Encouraging innovation, critical thinking, and artistic
                  expression.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* <section className="py-16 bg-blue-900 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join School Today
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Become part of a vibrant learning community dedicated to nurturing
            success and lifelong learning.
          </p>
          <a
            href="/auth"
            className="inline-block bg-yellow-400 text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-300 transition"
          >
            Admissions Open
          </a>
        </section> */}
      </div>
    </>
  );
};

export default function Page() {
  return (
    <div>
      <AboutUs />
      <Footer />
    </div>
  );
}
