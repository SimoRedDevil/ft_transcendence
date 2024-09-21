import GameMode from '../../components/GameMode'
import Rank from '../../components/Rank'
import Stats from '../../components/Stats'
import ApexChart from '../../components/pg'


import Pie  from '../../components/Pie';
import ProgressHolder from '../../components/Pg_holder';
const Dashboard = () => {
  const percentage = 66;
  return (
    <div className='lg:flex lg:flex-row lg:justify-around lg:items-center border_cus lg:rounded-3xl lg:h-[90%] 2xl:w-[90%]  lg:w-[95%] lg:relative 2xl:left-[6%] lg:left-[2%]  lg:top-[2%] bg-black/50   sm:flex sm:flex-col sm:justify-center sm:items-center sm:h-auto sm:overflow-auto ' >
        <div className='lg:w-[32%] lg:h-[100%] lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-[5%]  '>
            <GameMode  type="Tournemant" des="Our tournament game mode offers an exciting and competitive environment where players or teams face off in a series of matches to determine the ultimate champion." bg="/images/search.jpeg"  />
            <GameMode  type="Normal" des="Our normal game mode provides flexible and enjoyable gameplay for all types of players. Choose between offline mode or online 1 vs 1 matches to suit your preferences." bg="/images/normal.jpeg"  />
        </div>
        <div className='lg:w-[37%] lg:h-[100%] lg:flex lg:justify-center lg:items-center  '>
            <Rank player="50" />
        </div>
        <div className='lg:w-[25%]  lg:h-[89%] lg:border lg:flex lg:flex-col lg:justify-center  lg:items-center lg:bg-custom-gradient lg:gap-[8%] xl:gap-[4%] stats_holder'>
            <div className='lg:w-full  lg:flex lg:justify-center '>
              <Pie percentage={66} colour={"rgba(0, 225, 220, 0.8)"}   />
            </div>
            <div className=' lg:h-[30%] lg:w-full lg:flex lg:justify-center '>
              <div className=' border-red-500 lg:w-[50%] lg:flex lg:flex-col lg:justify-around lg:items-center '>
                <Stats type="Profile visits" number="0"/>
                <Stats type="Total matches" number="0"/>
              </div>
              <div className=' border-yellow-500 lg:w-[50%] lg:flex lg:flex-col lg:justify-around lg:items-center '>
                <Stats type="Friends count" number="0"/>
                <Stats type="Top score" number="0"/>
              </div>
            </div>
            <div className='lg:flex  lg:justify-center items-center lg:w-full h-auto'>
                <ApexChart />
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
// {/* <div className="flex flex-col  justify-center items-center  gap-4 w-[100vw] h-auto bg-black/55  2xl:w-[2000px] 2xl:h-[1200px]  2xl:border 2xl:rounded-[50px] 2xl:border-custom-gradient absolute left-0 top-[2vh]  overflow-auto pb-[90px] " >
//     <div className='lg:flex lg:gap-4 lg:relative lg:left-24 flex flex-col  justify-center items-center gap-4'>
//     </div>
//     <div className='flex flex-col justify-center items-center  w-full lg:w-[40%] lg:h-[30%]  lg:relative  lg:right-[18%] '>
//     <div className="w-[95%]   rounded-lg shadow  border-[0.5px] border-[#9a9a9a] bg-gradient-to-b from-[rgba(26,31,38,0.7)] to-[rgba(0,0,0,0.5)] p-4 md:p-6">
//     </div>
//     </div>
//   }