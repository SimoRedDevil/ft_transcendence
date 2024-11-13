'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../../components/ProfileCard';
import Winner from '../../components/Winner';
import ProfileStats from '../../components/ProfileStats';
import WeeklyStatsDashboard from '../../components/Linear_log';
import FriendsList from '../../components/FriendsList';
import AchievementsList from '../../components/AchievementsList';
import MatchList from '../../components/MatchList';
import RadialBarChart from '../../components/Pie_stats_chart';
import { useUserContext } from '../../components/context/usercontext';

export default function Profile() {
  const { users } = useUserContext();
  const [data, setData] = useState(null);

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

    <div className="lg:w-[95%] lg:h-[80vh] lg:flex lg:flex-col items-center justify-center lg:gap-[5%] xs:h-[90vh] xs:overflow-y-auto xs:overflow-x-hidden  space-y-4">
      <div className="lg:flex lg:flex-row justify-between lg:h-[30%] lg:w-[95%] xs:h-[90vh] space-y-4 xs:flex xs:flex-col xs:justify-around items-center " >
        <div className="lg:w-[35%] user_info lg:h-full flex justify-center items-center md:h-[45vh] xs:h-[30vh] xs:w-[90%]">
          <ProfileCard
            img={img}
            F_name={users.full_name}
            user={users.username}
            mail={users.email}
            lvl={users.level}
          />
        </div>
        <div className="lg:h-full lg:w-[60%] user_info flex xs:h-[60vh] xs:w-[90%]">
          <WeeklyStatsDashboard />
        </div>
      </div>
      <div className="flex lg:flex-row justify-between items-center lg:h-[55%] lg:w-[95%] xs:flex xs:flex-col gap-5  ">
        <div className="lg:h-full w-[40%] user_info flex justify-center items-start xs:h-[45vh] xs:w-[90%]">
          <AchievementsList achievements={data.achievements} />
        </div>
        <div className="lg:h-full lg:w-[50%] user_info xs:h-[60vh] xs:w-[90%]">
          <FriendsList friends={data.friends} />
        </div>
        <div className="lg:h-full w-[30%] xs:xs:h-[45vh]  user_info xs:w-[90%]">
          <MatchList
            main_user_name={users.username}
            results={data.results}
            main_user_avatar={img}
          />
        </div>
      </div>
    </div>
  );
}
