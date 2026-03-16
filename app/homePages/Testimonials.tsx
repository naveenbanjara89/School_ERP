"use client"

import { axiosInstance } from "@/apiHome/axiosInstanc";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";


interface Testimonial{
  id:string;
  name:string;
  role:string;
  feedback:string;
  avatar:string;
}


const defaultTestimonials: Testimonial[] = [
  {
    id: "0",
    name: "John Doe",
    role: "Teacher",
    feedback: "This platform really helped improve our workflow.",
    avatar: "/home/school.jpg",
  },
  {
    id: "1",
    name: "Sarah Smith",
    role: "Principal",
    feedback: "Amazing experience and great support team!",
    avatar: "/home/school.jpg",
  },
  {
    id: "2",
    name: "Alex Johnson",
    role: "Student",
    feedback: "I learned so much here, highly recommend!",
    avatar: "/home/school.jpg",
  },
];


const Testimonials = () => {

  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  useEffect(() => {
    async function getData() {
  await axiosInstance.get("/api/v1/landing/testimonials").then((response)=>{
    console.log("Testimonials data:",response.data);
    setTestimonials(response.data?.data?.length ? response.data.data : defaultTestimonials);
  }).catch((error)=>{
    console.error("Error fetching testimonials data:",error);
    setTestimonials(defaultTestimonials);
  });
}
   getData();
  }, []);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">
          What People Say
        </h2>
      <div className=" grid grid-cols-3  gap-5">
       {testimonials.map((testimonial)=>{
        return(  
            <div
                  key={testimonial.id}
                  className="bg-muted/30 p-8 rounded-2xl relative border hover:border-blue-400 hover:shadow-lg transition-shadow"
                >
                  <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    {testimonial.feedback}
                  </p>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
        )})}
      </div>
      </div>
    </section>
  );
};

export default Testimonials