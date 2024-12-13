function Achievement({title , des , img, status}){
    return(

        
        <div className=" w-[90%] h-full flex justify-between items-center  relative  box-border">
                <div className=" h-full flex  flex-col justify-between ">
                    <div className="flex flex-col ">
                        <h1 className="mobile:text-[5vw] ls:text-[3vw] lm:text-[2vw]  lg:text-[1vw] text-white " >{title}</h1> 
                        <p className="mobile:text-[4vw] ls:text-[2vw] lg:text-[0.6vw] text-white/50">{des.slice(0, 20)}...</p>
                    </div>

                    {status ? <h2 className="mobile:text-[2vw] text-white ls:text-[1.5vw] lm:text-[0.8vw] lg:text-[0.8vw] md:text-[0.8vw] truncate">
    ✓ Achieved
</h2>
: 
                        <div className="flex justify-center items-center absolute w-[100%] h-full bg-black/40">
                            <img className="mobile:w-[3vw] lg:w-[1vw] h-auto " src="/images/lock.png" />
                        </div>
                    }
                </div>
                <div className="bg-[url('/images/badge.png')] bg-cover bg-center items-center justify-center lg:scale-75 xl:scale-80">

                    {/* <img className="lg:h-10 lg:w-10  xl:h-14 xl:w-14 relative top-6" src="/images/badge.png" alt="" /> */}
                    <img className="mobile:w-12 mobile:h-12   lg:h-8 lg:w-8 xl:h-12 xl:w-12 rounded-full p-1" src={img} alt="" />
                </div> 
        </div>
    )
}
export default Achievement