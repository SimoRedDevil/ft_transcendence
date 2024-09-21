import React from "react";


/* Rectangle 91 */


function Gold(playerdata){
    console.log(playerdata.name)
    return(
        <div className="flex justify-between w-[90%] h-[65px] border border-red-500 box-border bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(247,180,46,0.88)] border-[rgba(255,255,255,0.2)] rounded-[50px]">
            <img   className="box-border w-[62px] h-[62px] border-2 border-[#FFC54D] rounded-full"  src={playerdata.minipic} alt="" />
            <h1 className="text-[20px] relative top-1 text-white" >{playerdata.name}</h1>
            <img className="w-[64px] h-[64px]"    src="/images/Gold.png" alt="" />
        </div>
    )
}
export default Gold