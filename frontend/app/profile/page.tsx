'use client'
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
import { useContext } from 'react';
import {UserContext, useUserContext} from '../../components/context/usercontext';
export  default function Profile ()
{
    const {users} = useUserContext()
    // const filePath = path.join(process.cwd(), 'public', 'data', 'user.json');
    // const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = [];
    const img = (users.avatar_url)
    return(
        <div className='lg:w-[85%]  lg:h-[80vh] flex lg:flex-col items-center justify-center lg:relative lg:left-[8%]  lg:top-10 lg:gap-[5%] border'>
            <div className=' flex justify-between  lg:h-[30%] lg:w-[95%]'>
                <div className='lg:w-[35%] user_info h-full flex justify-center items-center'>
                    <ProfileCard img={img} F_name={users.full_name} user={users.username} mail={users.email} lvl={users.level} />
                </div>
                <div className='lg:w-[60%] user_info flex '>
                <WeeklyStatsDashboard />
                </div>
            </div>
            <div className='flex justify-between items-center   lg:h-[55%] lg:w-[95%]'>
                <div className=' h-full w-[40%] user_info flex justify-center items-start' >
                    {/* heheh */}
                    {/* <AchievementsList achievements={data.achievements} /> */}
                </div>
                <div className='h-full w-[20%] user_info'>
                    hahaha
                    {/* <FriendsList friends={data.friends}/> */}
                </div>
                <div className='h-full w-[30%] user_info'>
                    jajajaj
                    {/* <MatchList main_user_name={users.full_name} results={data.results} main_user_avatar={users.savatar_url}/> */}
                </div>
            </div>
        </div>
    );
}   