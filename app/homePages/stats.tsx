"use client"

import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useEffect, useState } from "react";



const defaultStats: Stats[] = [
  { value: "500+", label: "Students Enrolled" },
  { value: "50+", label: "Expert Faculty" },
  { value: "100+", label: "Courses Available" },
  { value: "95%", label: "Placement Rate" },
];

interface Stats{
  value: string;
  label:string;
}

const Stats = () => {
  const [stats, setStats] = useState<Stats[]>(defaultStats);
  useEffect(() => {
    async function getData() {
  await axiosInstance.get("/api/v1/landing/stats").then((response)=>{
    console.log("Stats data:",response.data);
    setStats(response.data.data || defaultStats);
  }).catch((error)=>{
    console.error("Error fetching stats data:",error);
    setStats(defaultStats);
  });
}
   getData();
  }, []);

  return (
    <section className="bg-blue-400/30 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.length>0 &&stats?.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-sm hover:shadow-md transition bg-white border border-white hover:border-blue-500"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
                {stat.value}
              </h2>
              <p className="mt-2 text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
           
    </section>
    
  );
};
export default Stats