import React from "react";

function Basic(playerdata){
    console.log(playerdata.name)
    return(
        <div className="flex  gap-4 w-[90%] h-[65px] border border-[rgba(255, 255, 255, 0.002)] rounded-[50px] bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(14,14,14,0.5)] basic_b">
            <img   className="box-border w-[60px] h-[60px]  border-[#7b7b7a] rounded-full"  src={playerdata.minipic} alt="" />
            <h1 className="text-[20px] text-white relative top-1" >{playerdata.name}</h1>
        </div>
    )
}
export default Basic