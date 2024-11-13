'use client';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../../../components/ProfileCard';
import Winner from '../../../components/Winner';
import ProfileStats from '../../../components/ProfileStats';
import WeeklyStatsDashboard from '../../../components/Linear_log';
import FriendsList from '../../../components/FriendsList';
import AchievementsList from '../../../components/AchievementsList';
import MatchList from '../../../components/MatchList';
import RadialBarChart from '../../../components/Pie_stats_chart';
import { useUserContext } from '../../../components/context/usercontext';

export default function Profile({params}) {
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
    <div className='w-full h-full  flex justify-center items-center'>
        <Winner />
    </div>
    );
}