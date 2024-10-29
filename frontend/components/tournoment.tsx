import { useContext } from "react";
import { UserContext } from "./context/usercontext";


const Tournament = () => {
    return (
        <div className="
        flex items-center justify-center w-[90%] h-[90%] bg-opacity-70 text-white
        ">
            <div className="
            border-[0.5px] border-white flex h-[85%] laptop:w-[100%] rounded-[50px] border-opacity-40
            bg-black bg-opacity-70 flex-col items-center mobile:w-full tablet:w-[80%] less-than-tablet:w-[90%]
            less-than-tablet:h-[75%] less-than-tablet:pb-5 tablet:pt-[57px] less-than-mobile:w-[200px] less-than-mobile:h-[80vh]
            less-than-mobile:overflow-auto
            ">

            <h1>TOURNOMENT</h1>
            </div>
        </div>
    );
}

export default Tournament;