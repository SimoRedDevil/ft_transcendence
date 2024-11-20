import BadgeTour from "./BadgeTour"
export default function WinnerTour(){
    return(
        <div className="w-full h-full flex-col">
        <div className="w-full h-full flex justify-center items-center">
                <div className="xl:w-[50%] lg:h-[50%] lg:w-[70%] xs:w-[90%] xs:h-[50%] x flex flex-col justify-center items-center bg-[url('/images/tour-2.png')] bg-cover bg-center border border-white/50 rounded-xl  trophy-card ">
                <div className=" relative  xs:w-[60%]   md:w-[90%] xs:h-full  lg:w-[40%] lg:h-[70%] xl:h-[90%] 2xl:w-[30%]  xs:flex xs:flex-col xs:justify-center xs:items-center    xs:gap-2">
                <img
        className="relative xs:w-full    top-2 md:w-[40%]  lg:w-[90%] lg:top-2 p-1 border-2 border-[#bff1fafb] rounded-full"
        src="/images/minipic.jpeg"
        alt=""
      />
                    </div>
                    <h1 className="  xl:text-[50px] xs:text-[1rem] md:text-[2rem] lg:text-[40px] relative -top-10 text-winner text-[#bff1fafb]  font-barcade">Tournemant Winner</h1>
                </div>
        </div>
        </div>
    );
}