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
    <div className="w-2/3 bg-background flex-col justify-between flex p-8">
      <div className="flex items-center space-x-2">
        <Layers className="h-6 w-6" />
        <span className="font-bold text-xl">KanbanCrew Inc</span>
      </div>
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
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Streamline your project management with our intuitive Kanban board system.
        </p>
      </div>
    </div>
  );
}