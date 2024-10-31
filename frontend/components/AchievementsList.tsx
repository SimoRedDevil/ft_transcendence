import React from 'react';
import Achievement from './Achievement'

const AchievementsList = ({ achievements }) => {
  return (
    <div className='relative top-3 w-full h-[90%] flex flex-col justify-start items-center  gap-2 overflow-auto  hide-scrollbar'>
      {achievements.map((achievement, index) => (
        achievement.status ?
        <div key={index} className='relative top-4  w-[90%] h-[25%] flex justify-center items-center border rounded-[25px]  ach'>
                        <Achievement title={achievement.title} des={achievement.description} img={achievement.icon} status={achievement.status} />
        </div>:
        <div key={index} className='relative top-4  w-[90%] h-[25%] flex justify-center items-center border rounded-[25px] opacity-35 ach'>
          <Achievement title={achievement.title} des={achievement.description} img={achievement.icon} status={achievement.status} />
        </div>
      ))}
    </div>
  );
};
export default AchievementsList