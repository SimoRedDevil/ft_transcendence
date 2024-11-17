'use client';


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../../../components/ProfileCard';
import Versus from '../../../components/Versus';
import ProgressLine from '../../../components/ProgressLine';
import WinnerTour from '../../../components/WinnerTour';
import Winner from '../../../components/Winner';
import ProfileStats from '../../../components/ProfileStats';
import WeeklyStatsDashboard from '../../../components/Linear_log';
import FriendsList from '../../../components/FriendsList';
import AchievementsList from '../../../components/AchievementsList';
import MatchList from '../../../components/MatchList';
import ProfilAnon from '../../../components/ProfilAnon';
import RadialBarChart from '../../../components/Pie_stats_chart';
import { useUserContext } from '../../../components/context/usercontext';

export default function Profile() {
  const { users } = useUserContext();
  const [data, setData] = useState(null);
  const [Send, SetSend] = useState(null);
  const handleSend = () => {
    SetSend(!Send)
  }
  // Fetch data from JSON file in the public folder
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data/user.json');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const img = users.intra_avatar_url ? users.intra_avatar_url : users.avatar_url ;
  return (
    <div className="lg:w-[100%] lg:h-full  lg:overflow-hidden lg:flex  backdrop-blur-md lg:flex-col items-center justify-center gap-5 xs:h-[90vh] xs:overflow-y-auto xs:overflow-x-hidden  xs:space-y-4 lg:space-y-0 overflow-hidden  rounded-xl" >
      
      <div className="lg:h-[30%] lg:w-[95%]  bg-inherit  flex justify-around items-center gap-6" >
               <div className='w-[40%] relative   h-[80%] flex justify-around  gap-4 border border-[white]/40 rounded-xl '>
                <img src={img} alt=""  className='w-56 h-56  rounded-3xl  relative top-4 left-4 border border-[#bff1fafb] p-1'/>
                <div className='w-[60%] flex flex-col justify-around items-start'>
                    <h1 className='text-white text-[2rem] text-center font-Earth'>{users.full_name}</h1>
                    <h3 className='text-white text-[1.5rem] text-center font-Warriot'>Level 7</h3>
                    <ProgressLine progress={50}/>
                      <div className='flex  h-16 w-[70%] justify-start   items-center gap-2 ' >
                           { !Send ? <div className=' h-[70%] w-[40%]  rounded-lg  bg-white border-2 border-gray-900 flex items-center justify-center cursor-pointer' onClick={handleSend}>
                              <h1 className='text-[1rem] flex justify-center items-center gap-2'>Add Friend   <i className="fa-solid fa-user-plus"></i></h1>
                            </div> : 
                            <div className='h-full w-full flex justify-start items-center gap-2'>

                            <div className=' h-[70%] w-[40%]  rounded-lg  bg-inherit border-2 border-white/40 flex items-center justify-center'>
                              <h1 className='text-white text-[1rem]'>Requested</h1>
                            </div>
                            <div className=' h-[70%] w-[40%]  rounded-lg  bg-[white] border-2 border-white/40 flex items-center justify-center cursor-pointer'  onClick={handleSend}>
                              <h1 className='text-[1rem] '><i className="fa-solid fa-circle-xmark"></i> Cancel </h1>
                            </div>
                            </div>}
                      </div>
                </div>
               </div>
       <div className="lg:h-full lg:w-[60%]   flex relative  xs:h-[60vh]  xs:w-[90%] border border-[white]/40 rounded-xl ">
         <WeeklyStatsDashboard />
       </div>

      </div>
      <div className="flex lg:flex-row justify-between items-center lg:h-[55%] lg:w-[95%] xs:flex xs:flex-col gap-5  ">

      <div className="lg:h-full w-[40%]  flex flex-col  justify-center items-start xs:h-[45vh] xs:w-[90%] border border-[white]/40 rounded-xl">
        <h1 className='text-white relative  left-8 font-NeverMind bg-black'>Achievements</h1>
        <div className='h-full w-full'>
          <AchievementsList achievements={data.achievements} />
        </div>
      </div>
      <div className="lg:h-full lg:w-[50%]  xs:h-[60vh] xs:w-[90%] border border-[white]/40 rounded-xl flex flex-col  justify-center items-start">
        <h1 className='text-white relative  left-8 font-NeverMind bg-black'>friends</h1>
        <div className='h-full w-full'>
          <FriendsList friends={data.friends} />
        </div>
      </div>
      <div className="lg:h-full w-[30%] xs:xs:h-[45vh]   xs:w-[90%] border border-[white]/40 rounded-xl flex flex-col  justify-center items-start">
      <h1 className='text-white relative  left-8 font-NeverMind bg-black'>Last Matches</h1>
      <div className='h-full w-full'>
        <MatchList
          main_user_name={users.username}
          results={data.results}
          main_user_avatar={img}
        />
        </div>
      </div>
      </div>
    </div>
  );
}
