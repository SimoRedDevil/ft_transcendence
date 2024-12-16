import Option from './Option';

function MatchSelectTour() {
  return (
    <div className='h-[95%] w-full  flex justify-center items-center '>
        <div className="mobile:w-[90%] mobile:h-full lg:w-[80%] lg:h-[60%] 2xl:w-[65%] 2xl:h-[65%] bg-yellow-500 flex flex-col justify-around items-center border-white/60 border-2 rounded-2xl user_info pb-6">
            <h1 className='font-Earth lg:text-[2vw] md:-top-0 mobile:text-[30px] relative mobile:-top-3 md:text-[40px] '>Select</h1>
            <div className='w-full lg:h-full mobile:h-[90%] flex lg:flex-row mobile:flex-col justify-around items-center mobile:gap-3 lg:gap-0 '>
                <Option img={"/images/local.png"} title="Local" des="Challenge friends in a local match—play, compete, win!"/>
                <Option img={"/images/remote.png"} title="Online" des="Dive into an online world—compete, conquer, rise!"/>
            </div>
        </div>
    </div>
  );
}
export default MatchSelectTour



