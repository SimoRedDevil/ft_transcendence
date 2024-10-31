'use client'

function Achievement({title , des , img, status}){
    return(

        
        <div className=" w-[90%] h-[80%] flex justify-between items-center  relative ">
                <div className=" h-full flex  flex-col justify-between">
                    <div className="flex flex-col ">
                        <h1 className="text-16px text-white" >{title}</h1> 
                        <p className="text-[12px] text-white/50">{des}</p>
                    </div>

                    {status ? <h2 className="text-white text-[13px]">✓ Achieved</h2>: 
                        <div className="flex justify-center items-center absolute w-[100%] h-full bg-black/40">
                            <img className="w-6 h-6 " src="/images/lock.png" />
                        </div>
                    }
                </div>
                <div>
                    <img className="h-14 w-14 relative top-6" src="/images/badge.png" alt="" />
                    <img className="h-12 w-12 rounded-full relative -top-7 left-1" src={img} alt="" />
                </div> 
        </div>
    )
}
export default Achievement