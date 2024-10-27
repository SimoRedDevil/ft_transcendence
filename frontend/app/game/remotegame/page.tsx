"use client"

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('./tableRemote'), { ssr: false });
const Player1 = dynamic(() => import('./Player1Remote'), { ssr: false });
const Player2 = dynamic(() => import('./Player2Remote'), { ssr: false });

export default function Game() {
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="w-[85%] h-[80vh] flex justify-center items-center xl:flex-row  flex-col mt-[5vh]
                            sm:space-y-[20px]
                            lm:space-y-[40px]
                            lg:space-y-[60px]
                            xl:space-x-[60px]
                            2xl:space-x-[200px]
                            3xl:space-x-[250px]
                            4xl:space-x-[300px]
                            md:border md:border-white md:border-opacity-30 md:space-y-[30px]
                             md:bg-black md:bg-opacity-20
                            md:rounded-[50px]">
                        <Player1 image="/images/sara.png" name="@aaghbal" gameStarted={true} /> 
                        <Table />
                        <Player2 image="/images/abdellah.png" name="@mel-yous" gameStarted={true} />
            </div>
        </div>
    );
}