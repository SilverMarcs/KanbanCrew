import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  '/images/slideshow_BdownChart.png', 
  '/images/slideshow_EffortGraph.png',
  '/images/slideshow_sbacklog.png',
  '/images/slideshow_pbacklog.png'
];

export function WelcomeSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="w-2/3 flex flex-col justify-between p-8 bg-gradient-to-b from-gray-800 to-[#0f121a] h-screen">
      {/* Top Section */}
      <div className="flex flex-col text-center">
        <h1 className="text-6xl font-bold text-teal-500">Welcome</h1>
        <p className="text-lg text-secondary-foreground text-center">Be productive. Be efficient. Be AGILE.</p>
      </div>

      {/* Centered Slideshow */}
      <div className="relative w-full h-96">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
        ))}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex items-start space-x-2 mt-4">
        <Layers className="h-6 w-6 text-muted-foreground" />
        <span className="font-bold text-xl text-muted-foreground">KanbanCrew Inc</span>
      </div>
    </div>
  );
}
