import React from "react";

function Bronze(playerdata){
    console.log(playerdata.name)
    return(
        <div className="flex justify-between w-[90%] h-[65px] bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(188,188,188,0.5)] border border-[rgba(255,255,255,0.2)] rounded-[50px]">
            <div className="flex  gap-3">
                <img   className="box-border w-[62px] h-[62px] border-2 border-[#C19A6B] rounded-full"  src={playerdata.minipic} alt="" />
                <h1 className="text-[24px] relative top-1 text-white" >{playerdata.name}</h1>
            </div>
            <img className="w-[64px] h-[64px]"    src="/images/bronze.png" alt="" />
        </div>
    )
}
export default Bronze