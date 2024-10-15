"use client"

import Table from "./Table";
import Player1 from "./Player1";
import Player2 from "./Player2";

export default function Game() {
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="w-[85%] h-[80vh] flex justify-center items-center xl:flex-row  flex-col mt-[5vh]
                            lg:space-x-[60px]
                            xl:space-x-[60px]
                            2xl:space-x-[200px]
                            3xl:space-x-[250px]
                            4xl:space-x-[300px]
                            md:border md:border-white md:border-opacity-30
                             md:bg-black md:bg-opacity-20
                            md:rounded-[50px]">
                        <Player1 image="/images/sara.png"/> 
                        <Table />
                        <Player2 image="/images/abdellah.png"/>
            </div>
        </div>
    );
}

