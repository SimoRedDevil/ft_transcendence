const Match = ({main_user_name, main_user_avatar,   opp, img , result}) => {
    const [score1, score2] = result.split(':')
    return(
        <div className=" w-full h-full flex justify-between items-center">
                <div className="h-full flex-col justify-center items-center">
                    <img className="w-12 h-12 rounded-full border-2 border-[#00FFF0]" src={main_user_avatar} alt="" />
                    <h3 className="relative left-1 text-[14px] text-white font-light">{main_user_name}</h3>
                </div>
                <div className="relative flex flex-col justify-center items-center top-2">
                        <h1 className="text-[12px] relative -top-5 text-white/80"> Match Result</h1>
                        <div className="flex justify-center items-center gap-1  absolute  match_result_ w-[100px] h-[30px]">
                                   <p className="share text-white text-[18px] font thin">{score1}</p>                 
                                   <p className="share text-white text-[18px] font thin"> : </p>
                                   <p className="share text-white text-[18px] font thin"> {score2}</p>                 
                        </div>
                </div>
                <div className="h-full flex-col justify-center items-center ">
                    <img className="w-12 h-12 rounded-full border-2 border-[#00FFF0]" src={img} alt="" />
                    <h3 className="relative left-2 text-[14px] text-white font-light">{opp}</h3>
                </div>
        </div>
    )
}
export default Match