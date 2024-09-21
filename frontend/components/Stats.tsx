function Stats(stats)
{
    return(
        <div className="border w-[60%] h-[40%]   flex flex-col justify-center items-center stats_styles ">
            <h2 className="text-white 2xl:text-[100%] lg:text-[14px] text-center  ">{stats.type}</h2>
            <p className="text-white">{stats.number}</p>
        </div>
    );
}
export default Stats