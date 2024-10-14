import { Layers } from "lucide-react";
import { useState, useEffect } from "react";

export function WelcomeSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true); // State for fade animation

  const slides = [
    { src: "/images/Welcome Slide1.png", alt: "Welcome Slide 1", description: "Burntdown Chart" },
    { src: "/images/Welcome Slide2.png", alt: "Welcome Slide 2", description: "Effort Graph" },
    ];

  const nextSlide = () => {
    setFade(false); // Start fading out
    setTimeout(() => {
      setCurrentSlide((currentSlide + 1) % slides.length);
      setFade(true); // Fade in after changing the slide
    }, 500); // Duration of fade-out before changing the slide
  };

  const prevSlide = () => {
    setFade(false); // Start fading out
    setTimeout(() => {
      setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
      setFade(true); // Fade in after changing the slide
    }, 500); // Duration of fade-out before changing the slide
  };

  // Automatically change the slide every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 3000);
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [currentSlide]);

  return (
    <div className="flex">
      {/* Welcome Text Section */}
      <div className="w-1/2 bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white p-12 flex flex-col justify-between">
        <div className="flex items-center space-x-2 mb-8">
          <Layers className="h-10 w-10 text-teal-500" />
          <span className="font-extrabold text-3xl tracking-widest">KanbanCrew Inc</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-8xl font-extrabold text-teal-400">Welcome</h1>
          <p className="text-2xl">
            Streamline your project management with our intuitive Kanban board system.
          </p>
        </div>
        <div className="space-y-2 mt-6">
          <p className="text-lg font-medium text-gray-400">
            Be productive. Be efficient. Be AGILE.
          </p>
        </div>
      </div>

      {/* Sliding Demo Section */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          className={`object-cover w-full h-full transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white p-4">
          <p>{slides[currentSlide].description}</p>
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-teal-500 p-2 rounded-full"
        >
          &#8249;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-teal-500 p-2 rounded-full"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
