import GameMode from '../../components/GameMode'
import Rank from '../../components/Rank'
import Stats from '../../components/Stats'
import ApexChart from '../../components/pg'


import Pie  from '../../components/Pie';
import ProgressHolder from '../../components/Pg_holder';
const Dashboard = () => {
  const percentage = 66;
  return (
    <div className="relative  xs:h-[85vh] w-full xs:overflow-y-auto space-y-1  lg:flex  lg:h-full  ">
      <div className='xs:h-[55vh] xs:w-full flex justify-center  lg:h-full'>
        <div className="xs:flex xs:flex-col xs:h-[full] xs:w-[89%] lg:h-[90%]  xs:items-center xs:justify-between ">
                <GameMode  type="Normal" des="Our normal game mode provides flexible and enjoyable gameplay for all types of players. Choose between offline mode or online 1 vs 1 matches to suit your preferences." bg="/images/normal.jpeg"  /> 
                <GameMode  type="Tournemant" des="Our tournament game mode offers an exciting and competitive environment where players or teams face off in a series of matches to determine the ultimate champion." bg="/images/search.jpeg"  />
        </div>
      </div>
      <div className='xs:w-full xs:h-[80vh] xs:flex xs:justify-center lg:h-[90%]'>
          <div className="xs:flex xs:justify-center xs:items-center  xs:w-[89%] xs:h-full  lg:h-full">
                {/* <Rank player="50" /> */}
          </div>
      </div>
  <div className='xs:h-[80vh] xs:w-full flex justify-center lg:h-[90%]'>
    <div className="relative h-full  w-[89%] xs:flex xs:flex-col xs:justify-around xs:items-center stats_holder mb-4  ">
            <div className=' md:w-[60%] xs:w-[80%]   flex justify-center lg:w-[80%]'>
              <Pie percentage={50} colour={"rgba(0, 225, 220, 0.8)"}   />
            </div>
            <div className=' h-[30%] w-full flex justify-center '>
              <div className=' w-[50%] flex flex-col justify-around items-center gap-2'>
                <Stats type="Profile visits" number="0"/>
                <Stats type="Total matches" number="0"/>
              </div>
              <div className='  w-[50%] flex flex-col justify-around items-center gap-2'>
                <Stats type="Friends count" number="0"/>
                <Stats type="Top score" number="0"/>
              </div>
            </div>
            <div className='flex  justify-center items-center  xl:w-full xs:w-[90%] h-auto'>
                <ApexChart />
            </div> 
      </div>
  </div>
</div>
    // <div className='flex lg:flex-row xs:h-[80vh] xs:w-full xs:overflow-y-auto lg:justify-around lg:items-center   rounded-3xl lg:h-[100%] 2xl:w-[90%] lg:w-[95%] xl:w-[95%] relative 2xl:left-[6%] lg:left-8 xl:left-[2%]  lg:top-[2%] bg-black/50 xs:flex-col '>
    //     <div className='lg:w-[32%] xs:h-[50vh] lg:h-[89%] xs:w-full flex flex-col justify-center items-center gap-[5%]  stats_holder '>
    //     </div>
    //     <div className='lg:w-[37%] lg:h-[100%] xs:h-[70vh] xs:w-full flex justify-center items-center  stats_holder'>
    //     </div>
    //     <div className='lg:w-[25%]  lg:h-[89%] xs:h-[50vh] xs:w-full lg:border flex flex-col justify-center  items-center lg:bg-custom-gradient lg:gap-[8%] xl:gap-[4%] stats_holder  p-2 gap-4'>
    //     </div>
    // </div>
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
