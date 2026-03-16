"use client"

import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useEffect, useState } from "react";

interface FAQItem{
  question:string;
  answer:string;
}


const defaultFaqs: FAQItem[] = [
  {
    question: "How do I apply for admission?",
    answer:
      "You can apply online through our admissions portal by filling out the application form and submitting the required documents.",
  },
  {
    question: "What courses do you offer?",
    answer:
      "We offer a wide range of undergraduate and postgraduate programs across multiple disciplines.",
  },
  {
    question: "Is online fee payment available?",
    answer:
      "Yes, you can pay fees securely online using debit cards, credit cards, or net banking.",
  },
  {
    question: "Do you provide placement assistance?",
    answer:
      "Yes, we have a dedicated placement cell that assists students with internships and job opportunities.",
  },
];



const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFaqs);
  useEffect(() => {
    async function getData() {
  await axiosInstance.get("/api/v1/landing/faqs").then((response)=>{
    console.log("FAQ data:",response.data);
    setFaqs(
        response.data.data?.length
          ? response.data.data
          : defaultFaqs
      );
  }).catch((error)=>{
    console.error("Error fetching FAQ data:",error);
    setFaqs(defaultFaqs);
  });
}
   getData();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-blue-900 hover:bg-blue-50 transition"
                >
                  <span>{faq.question}</span>
                  <span className="text-2xl">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ