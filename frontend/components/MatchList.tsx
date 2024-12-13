import MatchCard from './MatchCard'
const MatchList = ({main_user_name,  results , main_user_avatar}) => {
    return (
        <>
        <div className='relative  lg:top-4 mobile:top-1 lg:h-[90%] mobile:h-[95%]  w-full overflow-auto hide-scrollbar'>

        <div className=' w-full h-auto   flex flex-col items-center gap-5 relative mobile:top-2'>
            {results.map((result, index) => (

                <div key={index} className=' w-[90%] lg:h-[4rem] mobile:h-[10%]    flex flex-col justify-center items-center border-b border-white/40'>
                    <MatchCard main_user_name={result.player1.full_name} main_user_avatar={result.player1.avatar_url} opp={result.player2.full_name} img={result.player2.avatar_url} result={(result.score1 + ":" + result.score2)}  />
                </div>
            ))}
        </div>
        </div>
        </>
    );
};
export default MatchList