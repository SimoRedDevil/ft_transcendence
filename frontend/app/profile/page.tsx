
import React from 'react'
import axios from 'axios'
import ProfileCard from '../../components/ProfileCard'
import ProfileStats from '../../components/ProfileStats'
import WeeklyStatsDashboard from '../../components/Linear_log'
import FriendsList from '../../components/FriendsList'
import AchievementsList from '../../components/AchievementsList'
import MatchList from '../../components/MatchList'
import RadialBarChart from '../../components/Pie_stats_chart'
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
export  default async function Profile ()
{
    const filePath = path.join(process.cwd(), 'public', 'data', 'user.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const img = (data.avatar.url)
    return(
        <div className=' lg:w-[85%]  lg:h-[80vh] flex flex-col items-center justify-center relative lg:left-[8%] xs:gap-8  lg:top-10 lg:gap-[5%] xs:h-auto xs:hide-scrollbar xs:overflow-auto xs:w-full'>
            <div className=' flex justify-between items-center  lg:h-[30%] lg:w-[95%] lg:flex-row xs:flex-col xs:h-auto xs:w-[95%] xs:gap-8 border'>
                <div className='xs:w-full xs:h-[30vh]  lg:w-[35%] user_info lg:h-full flex justify-center items-center '>
                    <ProfileCard img={img} F_name={data.full_name} user={data.username} mail={data.email} lvl={data.level} />
                </div>
                <div className='lg:w-[60%] lg:h-full user_info flex xs:h-[50vh] xs:w-full'>
                <WeeklyStatsDashboard />
                </div>
            </div>
            <div className='flex justify-between items-center  lg:flex-row lg:h-[55%] lg:w-[95%] xs:flex-col xs:h-[100vh] xs:w-[95%] xs:gap-8 border pb-8'>
                <div className='lg:h-full lg:w-[40%] user_info flex justify-center items-start xs:w-full xs:h-[60vh]' >
                    <AchievementsList achievements={data.achievements} />
                </div>
                <div className='lg:h-full lg:w-[20%] user_info xs:w-full xs:h-[60vh]'>
                    <FriendsList friends={data.friends}/>
                </div>
                <div className='lg:h-full lg:w-[30%] user_info xs:w-full xs:h-[80vh] ' >
                    <MatchList main_user_name={data.full_name} results={data.results} main_user_avatar={data.avatar}/>
                </div>
            </div>
        </div>

    );
}   