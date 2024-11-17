import MatchCard from './MatchCard'
const MatchList = ({main_user_name,  results , main_user_avatar}) => {
    return (
        <>
        <div className='relative  lg:top-4 xs:top-1 lg:h-[90%] xs:h-[95%]  w-full overflow-auto hide-scrollbar'>

        <div className=' w-full h-auto   flex flex-col items-center gap-5 relative xs:top-2'>
            {results.map((result, index) => (

                <div key={index} className=' w-[90%] lg:h-[4rem] xs:h-[10%]    flex flex-col justify-center items-center border-b border-white/40'>
                    <MatchCard main_user_name={main_user_name} main_user_avatar={main_user_avatar} opp={result.opponent.name} img={result.opponent.avatar} result={result.result}  />
                </div>
            ))}
        </div>
        </div>
        </>
    );
};
export default MatchList