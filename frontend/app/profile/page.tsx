'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import ProfileCard from '../../components/ProfileCard';
import MatchSelect from '../../components/MatchSelect';
import Versus from '../../components/Versus';
import ProgressLine from '../../components/ProgressLine';
import WinnerTour from '../../components/WinnerTour';
import Winner from '../../components/Winner';
import ProfileStats from '../../components/ProfileStats';
import WeeklyStatsDashboard from '../../components/Linear_log';
import FriendsList from '../../components/FriendsList';
import AchievementsList from '../../components/AchievementsList';
import MatchList from '../../components/MatchList';
import ProfilAnon from '../../components/ProfilAnon';
import RadialBarChart from '../../components/Pie_stats_chart';
import { useUserContext } from '../../components/context/usercontext';
import { getFriends } from '@/components/friendHelper';
import { axiosInstance } from '@/utils/axiosInstance';
import FriendCard from '@/components/FriendCard';

export default function Profile() {
  const { authUser, loading } = useUserContext();
  const [data, setData] = useState(null);
  const [friends, setFriends] = useState(null);
  const [matches, setMatches] = useState(null);
  const { t } = useTranslation();
  const [profileLoading, setProfileLoading] = useState(true);
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

  useEffect(() => {
   getFriends().then((friends) => setFriends(friends));
   if (friends)
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setProfileLoading(true);
        const response = await axiosInstance.get('matches/');
        if (response.status === 200) {
          setMatches(response.data);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
      finally {
        setProfileLoading(false);
      }
    };
    fetchMatches();
  }, []);
  if (!data || loading || profileLoading) {
    return <div>Loading...</div>;
  }

  const img = authUser?.avatar_url ;
  return (
    // <div className='h-full w-full backdrop-blur-lg flex justify-center items-center'>
    //       <MatchSelect />
    // </div>
    <div className=" lg:w-[100%]  lg:overflow-hidden lg:flex    items-center justify-center  md:border border-white/40 p-2 mobile:w-full mobile:overflow-y-auto mobile:overflow-x-hidden  mobile:space-y-4 lg:space-y-0 overflow-hidden  rounded-xl mobile:pb-14 hide-scrollbar" >
      <div className='mobile:w-full mobile:h-[80vh] lg:w-[30%] min-h-[900px] lg:h-full flex flex-col justify-around items-center mobile:gap-3 lg:gap-0 ' >
          <div className='mobile:w-full  min-h-[300px] h-[400px] xl:h-[450px]  lg:w-[90%]  rounded-[30px] user_info  border flex flex-col  justify-around items-center lg:p-4 2xl:pb-10 '>
            {/* <div className='w-full h-[80%] bg-black' ></div> */}
            <div className=' rounded-[30px] h-[30%]  profile_pic  2xl:-top-2  w-full flex justify-center '> 
                  <img  className=' p-1 ls:w-32 ls:h-32       mobile:w-32 mobile:h-32 lg:w-28 lg:h-28  xl:w-40 xl:h-40 rounded-full overflow-hidden shadow-lg  border-2 border-[#0ecff1fb]'  src={img} alt="" />
            </div>
            <div className='w-full lg:h-[70%] mobile:-top-4 ls:-top-4 lm:-top-1 md:-top-1 md:pt-2 lg:-top-0   flex flex-col justify-around items-center relative  lg:pt-16 xl:pt-20 '>
              <div className='text_holder flex flex-col lg:justify-center mobile:justify-around items-center'>
              {
               <h1 title={authUser?.full_name} className='mobile:text-[7vw] lm:text-[5vw] lg:text-[2vw] 2xl:[1.6vw] ls:text-[6vw] lg:font-bold font-Earth relative ptet text-center'>
               {authUser?.full_name.length > 10 
                 ? `${authUser.full_name.slice(0, 10)}..` 
                 : authUser.full_name}
             </h1>
                }
                <h2 className='relative text_info text-white/70  '>@{authUser?.username}</h2>
                <h2 className='relative text_info text-white/80'> {authUser?.email.length > 20 
                 ? `${authUser.email.slice(0, 20)}..` 
                 : authUser.email}</h2>
              </div>
              <h1 className=" relative textlvl font-Warriot">
                {t("Level")}: {authUser?.level}
              </h1>
              <div className='relative   w-[90%] '>
                <ProgressLine progress={authUser?.level} />
              </div>
            </div>
          </div>
          <div className='mobile:w-full lg:w-[90%] lg:h-[45%]  mobile:h-1/2  rounded-lg user_info' >
          <AchievementsList achievements={data} wins={authUser?.wins}/>
          </div>
      </div>
      
      <div className='mobile:w-full lg:w-[30%]   h-full flex justify-center items-center' >
      {friends && friends?.length > 0 ?  
      <div className='mobile:w-full lg:w-[90%] h-full user_info'>
        <FriendsList friends={friends} />
      </div>:
      <div className='mobile:w-full lg:w-[90%] h-full user_info flex justify-center items-center' >
        <h1 className='font-Oceanic  lg:text-[1.2vw]'>{t("New friends will appers here")}</h1>
      </div>
        }
      </div>
      <div className='mobile:w-full lg:w-[40%] h-full '>
      <div className='mobile:w-full lg:w-full  h-full  flex  flex-col justify-center gap-5 ' >
        <div className='mobile:w-full  h-[40%] border border-white/40 rounded-[30px] box-border bg-gradient-to-r from-[#00000080] to-[#293B45B3]  flex lg:flex-row mobile:flex-col items-center justify-between'>
        <div className='  w-[70%]  flex  items-center justify-center  lg:h-full' >
          <h1 className='text-center text-white md:text-[4vw] lg:text-[2vw] font-semibold font-r2014 '>{t("Total Matches")} : {authUser?.matches} </h1>
        </div>
        <div className='mobile:w-full h-full  flex items-center justify-center ' >
              <WeeklyStatsDashboard  matches={authUser?.matches} wins={authUser?.wins}/>
        </div>
        </div>
        <div className='mobile:w-full  h-[55%] border border-white/40 rounded-[30px]  bg-gradient-to-r from-[#00000080] to-[#293B45B3]'>
       {matches && matches.length > 0 ? 
       <MatchList
          main_user_name={authUser?.username}
          results={matches}
          main_user_avatar={img}
          
        /> : <h1  className='text-white text-center font-Oceanic lg:text-[1.2vw]'>
          {t("No matches found")}
        </h1>
        }
        </div>
      </div>
      </div>
    </div>
  );
}


