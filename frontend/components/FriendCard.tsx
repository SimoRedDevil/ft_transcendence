const FriendCard = ({Name, Username, online}) => {
    return(
        <div className="w-[90%] h-full flex justify-between lg:gap-2 xl:gap-0 items-start border-b border-t rounded-3xl border-gray-500/40 p-2">
            <div className="xl:w-[60%] lg:w-[80%] xs:w-[90%]   flex items-center   relative -top-1 xs:gap-2 ">

                <div className=" md:w-14 xs:w-11 lg:w-full  h-full flex justify-center items-start  w-full gap-2 ">
                    <img className="xl:border-2 xs:border border-[#00FFF0]  rounded-full   xl:h-12 xl:w-12  lg:w-10 lg:h-10 xs:w-10 xs:h-10 md:w-12 md:h-12" src="/images/Me.png" alt="" />
                <div className="lg:w-full xl:w-[%] flex lg:flex-col xl:flex-row justify-between items-start  ">
                    <div className="flex flex-col ">

                    <h1 className="text-white text-[14px]  lg:text-[12px]">{Name}</h1>
                    {
                        online?<h3 className="flex gap-1  text-[10px] lg:text-[5px]"><p className="text-[12px] text-white/80">@{Username} </p> </h3>:<h3 className="text-[10px] text-white/60"><p className="text-[10px] text-white/60">@{Username} </p></h3>
                    }
                    </div>
                </div>
                </div>
            </div>
                {/* <div className="flex gap-1 items-center h-full ">
                    <img className="xl:h-10 xl:w-10 lg:w-5 lg:h-5 xs:w-9 xs:h-9" src="/images/msg.png" alt="" />
                </div> */}
        </div>
    )
}
export default FriendCard