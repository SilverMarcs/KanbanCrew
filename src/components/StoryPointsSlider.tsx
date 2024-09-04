import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useState } from "react";

type SliderProps = React.ComponentProps<typeof Slider>

export function SliderStoryPoints({ className, ...props }: SliderProps) {
  const storyPoints = 0; // Declare and initialize the 'storyPoints' variable

  const [value, setValue] = useState([1])
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <p className="text-gray-500 font-bold">
        {storyPoints} SP
      </p>
      {isHovered && (
        <div className="py-2">
          <Slider
            defaultValue={[1]}
            max={10}
            step={1}
            className={cn("w-40 ", className, )}
            {...props}

          />
          {/* <div className="w-6 rounded bg-secondary px-2 py-1 text-sm">
              {value}
            </div> */}
        </div>
      )}
    </div>
  );
};
    // <div className="w-full max-w-sm px-8 py-16">
    //   <p
    //     className="text-gray-500 font-bold"
    //     onMouseEnter={() => setIsHovering(true)}
    //     onMouseLeave={() => setIsHovering(false)}
    //   >
    //     {storyPoints} SP
    //     {isHovering && showSlider && ( // Conditionally render the slider when hovering over the story points
    //       <div
    //         className={cn(
    //           "absolute left-1/2 bottom-full mb-2 -translate-x-1/2 transition-opacity",
    //           "opacity-100" // Remove the opacity toggle, as we're controlling visibility with the showSlider state
    //         )}
    //       >
    //         <div className="relative">
    //           <Slider
    //             min={1}
    //             max={10}
    //             step={1}
    //             value={value}
    //             onValueChange={setValue}
    //             onMouseEnter={() => setShowSlider(true)} // Set showSlider to true when hovering over the slider
    //             onMouseLeave={() => setShowSlider(false)} // Set showSlider to false when leaving the slider
    //             className=""
    //           />
    //         </div>
            // <div className="rounded bg-secondary px-2 py-1 text-sm">
            //   {value}
            // </div>
    //         <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-secondary" />
    //       </div>
    //     )}
    //   </p>
    // </div>
//   )
// }
