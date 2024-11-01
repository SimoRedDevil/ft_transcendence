const FriendCard = ({Name, Username, online}) => {
    return(
        <div className="w-[90%] h-full flex lg:gap-2 xl:gap-0 items-start ">
            <div className="w-16 lg:w-2/3 h-full flex justify-center items-start ">
                <img className="xl:border-2 lg:border border-[#00FFF0]  rounded-full lg:w-10 lg:h-10  xl:h-12 xl:w-12" src="/images/Me.png" alt="" />
            </div>
            <div className="lg:w-full xl:w-[%] flex lg:flex-col xl:flex-row justify-between items-start  ">
                <div className="flex flex-col ">

                <h1 className="text-white text-[14px]  lg:text-[12px] font-thin">{Name}</h1>
                {
                    online?<h3 className="flex gap-1  text-[10px] lg:text-[5px]"><p className="text-[10px] text-white/60">@{Username} </p> 🟢 </h3>:<h3 className="text-[10px] text-white/60"><p className="text-[10px] text-white/60">@{Username} </p></h3>
                }
                </div>
                <div className="flex gap-1 ">
                    <img className="xl:h-5 xl:w-5 lg:w-3 lg:h-3" src="/images/msg.png" alt="" />
                </div>
            </div>
        </div>
    )
}
export default FriendCard