import React from "react";

function Silver(playerdata){
    console.log(playerdata.name)
    return(
        <div className="flex justify-between w-[90%] h-[65px] bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(193,154,107,0.5)] border border-[rgba(255,255,255,0.2)] rounded-[50px]">
            <img   className="box-border  w-[62px] h-[62px]  border-2 border-[#BCBCBC] rounded-full" src={playerdata.minipic}  />
            <h1 className="text-[24px] relative top-1 text-white" >{playerdata.name}</h1>
            <img className="w-[64px] h-[64px]"    src="/images/silver.png" alt="" />
        </div>
    )
}
export default Silver