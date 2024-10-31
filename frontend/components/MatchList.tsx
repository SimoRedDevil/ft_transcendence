import MatchCard from './MatchCard'
const MatchList = ({main_user_name,  results , main_user_avatar}) => {
    return (
        <>
        <div className='relative  top-4 h-[90%] w-full overflow-auto hide-scrollbar'>

        <div className=' w-full h-auto   flex flex-col items-center gap-5 '>
            {results.map((result, index) => (

                <div key={index} className='relative w-[90%] h-[4rem]  flex flex-col justify-center items-center'>
                    <MatchCard main_user_name={main_user_name} main_user_avatar={main_user_avatar.url} opp={result.opponent.name} img={result.opponent.avatar} result={result.result}  />
                </div>
            ))}
        </div>
        </div>
        </>
    );
};
export default MatchList