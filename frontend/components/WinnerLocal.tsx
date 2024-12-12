import Badge from "./Badge"

import { Line,  } from 'rc-progress';

interface Props {
    winer: string;
    scoreWinner: string;
    scoreLoser: string;
}

export default function Winner({winer, scoreWinner, scoreLoser}: Props){
    return(
        <>
        <div className="bg-[url('/images/winner_bg_black.png')] bg-cover bg-center xs:flex  xs:justify-between xs:w-[85%]  xs:items-center xs:h-[70%] md:flex-row xs:flex-col  md:w-[90%] md:h-[40%] md:justify-between  lg:w-[70%]  xl:w-[60%] 2xl:w-[60%] xl:h-[60%] lg:h-[50%]  border border-white/50 rounded-xl  lg:flex items-center scale-down  scaleDown_page">
        
            <div className="xs:w-[10rem]   md:w-[40%] xs:h-full  lg:w-[40%] lg:h-[70%] xl:h-[90%] xl:w-[40%] xs:flex xs:flex-col xs:justify-center xs:items-center    xs:gap-2">
                <Badge img='images/adil.png'/>
                <div className=" xl:h-[70px] lg:h-[50px] flex xl:text-[70px] lg:text-[50px] text-black/80">
                <h1 className="scale-yp  font-Bebas font-bold opacity-0" style={{ animationDelay: "0.4s" }}>W</h1>
            <h1 className="scale-yp  font-Bebas font-bold opacity-0" style={{ animationDelay: "0.5s" }}>i</h1>
            <h1 className="scale-yp  font-Bebas font-bold opacity-0" style={{ animationDelay: "0.8s" }}>n</h1>
            <h1 className="scale-yp  font-Bebas font-bold opacity-0" style={{ animationDelay: "1s" }}>n</h1>
            <h1 className="scale-yp  font-Bebas font-bold opacity-0" style={{ animationDelay: "1.2s" }}>e</h1>
            <h1 className="scale-yp  font-Bebas font-bold opacity-0" style={{ animationDelay: "1.5s" }}>r</h1>
                </div>
            </div>
            <div className="relative xS:h-[30%]  lg:w-[40%] md:h-[40%]  shadow-black  xs:flex-col md:flex-row  rounded-xl flex justify-around items-center">
                <h1 className="xs:text-[2rem] md:text-[5rem] xl:text-[6rem] font-Bebas font-thin text-white" >{scoreWinner}</h1>
                <h1 className="xs:text-[2rem] md:text-[5rem] xl:text-[6rem] font-Bebas font-thin text-white" >-</h1>
                <h1 className="xs:text-[2rem] md:text-[5rem] xl:text-[6rem] font-Bebas font-thin text-white" >{scoreLoser}</h1>
            </div>
            <div className="xs:w-[10rem]   md:w-[40%] xs:h-full  lg:w-[40%] lg:h-[70%] xl:h-[90%] xl:w-[40%] xs:flex xs:flex-col xs:justify-center xs:items-center    xs:gap-2 opacity-85">
                <Badge img="images/adil.png" />
            </div>
        </div>
        <div className=" font-[Bona Nova SC] absolute  font-loby  lg:bottom-10 md:bottom-[25%] xs:bottom-[10%]    md:right-auto md:left-auto   xs:w-[50%] xs:h-[5%] md:w-[30%] md:h-[5%]  lg:w-[18%] lg:h-[4%] xl:w-[15%] 2xl:w-[10%] xl:h-[5%] bg-[url('/images/lobby2.png')] bg-cover  scale-lobby  bg-center border border-white/50 flex justify-center items-center lg:[2rem] rounded-xl text-white/80" >  
            <button className="opacity ">Back to lobby <i className="fa-solid fa-right-to-bracket relative "></i>  </button>
          </div>
        </>
    );
}