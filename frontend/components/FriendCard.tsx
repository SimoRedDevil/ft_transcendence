const FriendCard = ({Name, Username, online}) => {
    return(
        <div className="w-full h-full flex gap-2 items-start">
            <div className="w-16 flex justify-center items-center">
                <img className="border-2 border-[#00FFF0] lg:border-red-600 rounded-full lg:h-[40px] lg:w-[40px] xl:h-12 xl:w-12" src="/images/Me.png" alt="" />
            </div>
            <div className="w-full flex flex-col justify-between items-start ">
                <div className="flex flex-col ">

                <h1 className="text-white text-[14px] font-thin">{Name}</h1>
                {
                    online?<h3 className="flex gap-1  text-[10px]"><p className="text-[10px] text-white/60">@{Username} </p> 🟢 </h3>:<h3 className="text-[10px] text-white/60"><p className="text-[10px] text-white/60">@{Username} </p></h3>
                }
                </div>
                <div className="flex gap-1">
                    <img className="h-5 w-5" src="/images/msg.png" alt="" />
                </div>
            </div>
        </div>
    )
}
export default FriendCard