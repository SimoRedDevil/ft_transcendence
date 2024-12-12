'use client'
import React from 'react';
import PureComponent from './ProfileStats'
import { PieChart, Area,Tooltip, AreaChart, CartesianGrid,Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
const WeeklyStatsDashboard = () => {
  const donutData = [
    { name: 'Win', value: 62.5 },
    { name: 'Losses', value: 37.5 },
  ];
  const lineData = [
    { day: 'M', value: 10 },
    { day: 'T', value: 70 },
    { day: 'W', value: 20 },
    { day: 'T', value: 80 },
    { day: 'F', value: 45 },
    { day: 'S', value: 15 },
    { day: 'S', value: 45 },
  ];
  const COLORS = ['#3b82f6', '#10b981'];
  return (

    <div className='lg:w-full lg:h-full flex  justify-center items-center'>
      
   
    <div className=" flex lg:flex-row xs:flex-col lg:w-full lg:h-full xs:w-full  lg:gap-4  lg:p-4  text-white justify-center ">
      <div className="w-full  relative  ">
        <ResponsiveContainer width="100%" height="100%" >
          <PieChart >
          <defs>
        <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#007BEC" />
          <stop offset="100%" stopColor="#001F4F" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00B4A9" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
            <Pie
              xlinkTitle="chart"
              blendStroke={true} 
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={6}
              startAngle={90}
              endAngle={-270}
            >
              {donutData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={`url(#gradient${index + 1})`} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom"
              height={30}
              iconType="circle"
              formatter={(value, entry, index) => (
                <span style={{ color: COLORS[index] }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(-10px)' }}>
          <span className="text-white text-3xl font-bold">62.5%</span>
        </div>
      </div>
    </div>
    </div>
  );
};
export default WeeklyStatsDashboard;