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
import { axiosInstance } from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {useRouter} from 'next/navigation';
import { getCookies } from '../../../components/auth';

import { getFriends } from '@/components/friendHelper';


export default function Profile({params}) {
  const { authUser, loading } = useUserContext();
  const [data, setData] = useState(null);
  const [Send, SetSend] = useState(false);
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState(null);
  const [friends, setFriends] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const resolvedParam = React.use(params);
  const { t } = useTranslation();
  const router = useRouter();

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
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('auth/get-user/', {
          params: {
            username: resolvedParam.user
          }
        });
        setUser(response.data);
      } catch (error) {
        router.push(`/${error.status}`);
      }
      finally {
        setUserLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setProfileLoading(true);
        const response = await axiosInstance.get('matches/', {
          params: {
            username: resolvedParam.user
          }
        });
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
  
  if (!data || loading || userLoading) {
    return <div>Loading...</div>;
  }
  console.log("hrhrh")
  console.log(user)

  const img = user?.avatar_url ;
  return (
    // <div className='h-full w-full backdrop-blur-lg flex justify-center items-center'>
    //       <Versus img={img}/>
    // </div>
    <div className=" lg:w-[100%]  lg:overflow-hidden lg:flex   items-center justify-center  md:border border-white/40 p-2 mobile:w-full mobile:overflow-y-auto mobile:overflow-x-hidden  mobile:space-y-4 lg:space-y-0 overflow-hidden  rounded-xl mobile:pb-14 pa" >
      <div className='mobile:w-full mobile:h-[80vh] lg:w-[30%]  lg:h-full flex flex-col justify-around items-center mobile:gap-3 lg:gap-0 ' >
          <div className='mobile:w-full card special mobile:h-1/2 lg:w-[90%] lg:h-[50%] rounded-[30px] user_info  border flex flex-col  justify-between items-center lg:p-4 2xl:pb-10 '>
            {/* <div className='w-full h-[80%] bg-black' ></div> */}
            <div className=' rounded-[30px] h-[30%] relative profile_pic  2xl:-top-2  w-full flex justify-center '> 
                  <img  className='relative p-1 ls:w-32 ls:h-32     z-10  mobile:w-32 mobile:h-32 lg:w-28 lg:h-28 2xl:w-40 2xl:h-40 rounded-full overflow-hidden shadow-lg  border-2 border-[#0ecff1fb]'  src={img} alt="" />
            </div>
            <div className='w-full lg:h-[70%] mobile:-top-4 ls:-top-4 lm:-top-1 md:-top-1 md:pt-2 lg:-top-0   flex flex-col justify-around items-center relative  lg:pt-16 xl:pt-20 '>
              <div className='text_holder flex flex-col lg:justify-center mobile:justify-around items-center'>
                <h1 className='mobile:text-[7vw] lm:text-[5vw] lg:text-[2vw] ls:text-[5vw] lg:font-bold  font-Earth relative '>{user.full_name.slice(0,15)}..</h1>
                <h2 className='relative text_info text-white/70'>@{user.username}</h2>
                <h2 className='relative text_info text-white/80'>{user.email}</h2>
              </div>
              <h1 className=" relative textlvl font-Warriot">
                Level: {user.level}
              </h1>
              <div className='relative   w-[90%] '>
              <ProgressLine progress={user?.level} />
              </div>
            </div>
          </div>
          <div className='mobile:w-full lg:w-[90%] lg:h-[45%]  mobile:h-1/2  rounded-lg user_info' >
          <AchievementsList achievements={data} wins={user?.wins}/>
          </div>
      </div>
      
      <div className='mobile:w-full lg:w-[30%]   h-full flex justify-center items-center' >
      {friends.lenght > 0 ?  
      <div className='mobile:w-full lg:w-[90%] h-full user_info'>
        <FriendsList friends={friends} />
      </div>:
      <div className='mobile:w-full lg:w-[90%] h-full user_info flex justify-center items-center' >
        <h1 className='font-Oceanic  lg:text-[1vw]'>New friends will appers here</h1>
      </div>
        }
      </div>
      <div className='mobile:w-full lg:w-[40%] h-full '>
      <div className='mobile:w-full lg:w-full  h-full  flex  flex-col justify-center gap-5 ' >
        <div className='mobile:w-full  h-[40%] border border-white/40 rounded-[30px] box-border bg-gradient-to-r from-[#00000080] to-[#293B45B3]  flex lg:flex-row mobile:flex-col items-center justify-between'>
        <div className='  w-[70%]  flex  items-center justify-center  lg:h-full' >
          <h1 className='text-center text-white md:text-[4vw] lg:text-[2vw] font-semibold '>Total Matches : {authUser?.matches} </h1>
        </div>
        <div className='mobile:w-full h-full  flex items-center justify-center ' >
        <WeeklyStatsDashboard  matches={user?.matches} wins={user?.wins}/>
        </div>
        </div>
        <div className='mobile:w-full  h-[55%] border border-white/40 rounded-[30px]  bg-gradient-to-r from-[#00000080] to-[#293B45B3]'>
        <MatchList
            main_user_name={user?.username}
            results={matches}
            main_user_avatar={img}
  
          />
        </div>
      </div>
      </div>
    </div>
  );
}


//////////////////////

// return (
//   // <div className='h-full w-full backdrop-blur-lg flex justify-center items-center'>
//   //       <Versus img={img}/>
//   // </div>
//   <div className=" lg:w-[100%]  lg:overflow-hidden lg:flex   items-center justify-center  md:border border-white/40 p-2 mobile:w-full mobile:overflow-y-auto mobile:overflow-x-hidden  mobile:space-y-4 lg:space-y-0 overflow-hidden  rounded-xl mobile:pb-14 pa" >
//     <div className='mobile:w-full mobile:h-[80vh] lg:w-[30%]  lg:h-full flex flex-col justify-around items-center mobile:gap-3 lg:gap-0 ' >
//         <div className='mobile:w-full card special mobile:h-1/2 lg:w-[90%] lg:h-[50%] rounded-[30px] user_info  border flex flex-col  justify-between items-center lg:p-4 2xl:pb-10 '>
//           {/* <div className='w-full h-[80%] bg-black' ></div> */}
//           <div className=' rounded-[30px] h-[30%] relative profile_pic  2xl:-top-2  w-full flex justify-center '> 
//                 <img  className='relative p-1 ls:w-32 ls:h-32     z-10  mobile:w-32 mobile:h-32 lg:w-28 lg:h-28 2xl:w-40 2xl:h-40 rounded-full overflow-hidden shadow-lg  border-2 border-[#0ecff1fb]'  src={img} alt="" />
//           </div>
//           <div className='w-full lg:h-[70%] mobile:-top-4 ls:-top-4 lm:-top-1 md:-top-1 md:pt-2 lg:-top-0   flex flex-col justify-around items-center relative  lg:pt-16 xl:pt-20 '>
//             <div className='text_holder flex flex-col lg:justify-center mobile:justify-around items-center'>
//               <h1 className='mobile:text-[7vw] lm:text-[5vw] lg:text-[2vw] ls:text-[5vw] lg:font-bold  font-Earth relative '>{user.full_name.slice(0,15)}..</h1>
//               <h2 className='relative text_info text-white/70'>@{user.username}</h2>
//               <h2 className='relative text_info text-white/80'>{user.email}</h2>
//             </div>
//             <h1 className=" relative textlvl font-Warriot">
//               Level: {user.level}
//             </h1>
//             <div className='relative   w-[90%] '>
//             <ProgressLine progress={user?.level} />
//             </div>
//           </div>
//         </div>
//         <div className='mobile:w-full lg:w-[90%] lg:h-[45%]  mobile:h-1/2  rounded-lg user_info' >
//         <AchievementsList achievements={data} wins={user?.wins}/>
//         </div>
//     </div>
    
//     <div className='mobile:w-full lg:w-[30%]   h-full flex justify-center items-center' >
//     {friends.lenght > 0 ?  
//     <div className='mobile:w-full lg:w-[90%] h-full user_info'>
//       <FriendsList friends={friends} />
//     </div>:
//     <div className='mobile:w-full lg:w-[90%] h-full user_info flex justify-center items-center' >
//       <h1 className='font-Oceanic  lg:text-[1vw]'>New friends will appers here</h1>
//     </div>
//       }
//     </div>
//     <div className='mobile:w-full lg:w-[40%] h-full '>
//     <div className='mobile:w-full lg:w-full  h-full  flex  flex-col justify-center gap-5 ' >
//       <div className='mobile:w-full  h-[40%] border border-white/40 rounded-[30px] box-border bg-gradient-to-r from-[#00000080] to-[#293B45B3]  flex lg:flex-row mobile:flex-col items-center justify-between'>
//       <div className='  w-[70%]  flex  items-center justify-center  lg:h-full' >
//         <h1 className='text-center text-white md:text-[4vw] lg:text-[2vw] font-semibold '>Total Matches : {authUser?.matches} </h1>
//       </div>
//       <div className='mobile:w-full h-full  flex items-center justify-center ' >
//       <WeeklyStatsDashboard  matches={user?.matches} wins={user?.wins}/>
//       </div>
//       </div>
//       <div className='mobile:w-full  h-[55%] border border-white/40 rounded-[30px]  bg-gradient-to-r from-[#00000080] to-[#293B45B3]'>
//       <MatchList
//           main_user_name={user?.username}
//           results={matches}
//           main_user_avatar={img}

//         />
//       </div>
//     </div>
//     </div>
//   </div>
// );