'use client'
// import { Button } from "flowbite-react";
export default function Home(){
    return(
        <div className="w-full h-full bg-[url('/images/landing1.png')] bg-center bg-cover flex flex-col ">
            <div className="w-full h-full">
                <h1 className="relative left-16 top-10 text-[220px]  font-Earth font-bold text-[#bff1fafb] typewriter-animation cursor" >AliensPong</h1>
                <p className="relative  font-Earth font-thin left-40 text-[#bff1fafb]" >  
                    Unleash your inner champion in a galactic duel—AlienSpong, where every match is out of this world!
                </p>
            </div>
                <div className="w-full h-full  flex justify-center items-center ">
                        <button className="  p-1  w-[10%] h-[10%] game_info rounded-lg bg-gradient-to-r from-[#00A88C] to-[#004237] text-white font-Pilot">Start</button>
                </div>
        </div>
    );
}
