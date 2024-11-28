'use client'
import { useState, useEffect } from "react";
import Badge from "./Badge"
import BadgeTour from "./BadgeTour"
// import { useState, useEffect } from 'react';
// import BadgeTour from './BadgeTour';  // Assuming this is the correct import path

export default function Versus({ socket , game_roum , username, image1, image2}: any) {
  const images = [
    "/images/minipic.jpeg",
    "/images/ach1.jpeg",
    "/images/adil.png",
    "/images/3945dc8d49882ca3d2c4d53e3d6608ff.jpeg",
    "/images/sara.png",
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isFinal, setIsFinal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleButtonClick = () => {
    socket.send(JSON.stringify({ type: 'playerReady', game_roum: game_roum, username: username }));
    setIsReady(true);
};
  useEffect(() => {
    let randomIndex;
    let intervalId;

    if (!isFinal) {
      intervalId = setInterval(() => {
        randomIndex = Math.floor(Math.random() * images.length);
        setCurrentImage(images[randomIndex]);
      }, 500);
    }


    
    const timeoutId = setTimeout(() => {
      setCurrentImage(images[randomIndex]); 
      setIsFinal(true);
    }, 1000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isFinal, images]);

  return (
    <>
      <div className="bg-[url('/images/vs.png')] bg-cover bg-center xs:flex xs:justify-between xs:w-[85%] xs:items-center xs:h-[70%] md:flex-row xs:flex-col md:w-[90%] md:h-[40%] md:justify-between lg:w-[70%] xl:w-[60%] 2xl:w-[60%] xl:h-[60%] lg:h-[50%] border border-white/50 rounded-xl lg:flex items-center scale-down scaleDown_page">
        <div className="xs:w-[10rem] md:w-[40%] xs:h-full lg:w-[40%] lg:h-[70%] xl:h-[90%] xl:w-[40%] xs:flex xs:flex-col xs:justify-center xs:items-center xs:gap-2">
          <BadgeTour img={image1} />
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="relative xs:h-[30%] lg:w-[40%] md:h-[40%] shadow-black xs:flex-col md:flex-row rounded-xl flex justify-center items-center gap-3 lg:h-full">
            <h1 className="text-[200px] text-[#d3e2e5fb] shadow-[#d3e2e5fb] shado up font-thin">V</h1>
            <div className="h-[200px] w-4 bg-[#d3e2e5fb] rotate-12 shadow-lg shadow-[#d3e2e5fb] border border-[#d3e2e5fb] rounded-2xl shado-b middle"></div>
            <h1 className="text-[200px] text-[#d3e2e5fb] shadow-[#d3e2e5fb] shado down font-thin">S</h1>
          </div>
          <div>
              <button
                    className={`w-[70px] h-[70px] rounded-[100px] border-[4px] ${!isReady ? 'bg-[#C28F5F] text-white border-[#39696e]' : 'text-white/60 bg-[#C28F5F]/30 border-[#39696e]/30'} `}
                    onClick={handleButtonClick}
                    disabled={isReady}
                  >
                    {!isReady ? 'Play' : 'Ready'}
              </button>
          </div>
        </div>

        <div className="xs:w-[10rem] md:w-[40%] xs:h-full lg:w-[40%] lg:h-[70%] xl:h-[90%] xl:w-[40%] xs:flex xs:flex-col xs:justify-center xs:items-center xs:gap-2 opacity-85">
          <BadgeTour img={image2} />
        </div>
      </div>

      <div className="font-[Bona Nova SC] absolute font-loby lg:bottom-10 md:bottom-[25%] xs:bottom-[10%] md:right-auto md:left-auto xs:w-[50%] xs:h-[5%] md:w-[30%] md:h-[5%] lg:w-[18%] lg:h-[4%] xl:w-[15%] 2xl:w-[10%] xl:h-[5%] bg-[url('/images/lobby2.png')] bg-cover scale-lobby bg-center border border-white/50 flex justify-center items-center lg:[2rem] rounded-xl text-white/80">
        <button className="opacity">
          Back to lobby <i className="fa-solid fa-right-to-bracket relative"></i>
        </button>
      </div>
    </>
  );
}
