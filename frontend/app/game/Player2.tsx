
interface PlayerProps{
    image: string;
}

export default function Player({image}: PlayerProps)
{
    return (
        <div className="border-2 border-red-500 w-[200px] 2xl:w-[20%] 2xl:h-[50%]  lm:flex lm:justify-center lm:w-[210px] ">
            <div className="bg-cover bg-center cover rounded-full
                            sm:w-[50px] sm:h-[50px] 
                            lm:w-[70px] lm:h-[70px] lm:mt-8 
                            lg:w-[100px] lg:h-[100px]
                            xl:w-[100px] xl:h-[100px]
                            2xl:w-[150px] 2xl:h-[150px]
                            3xl:w-[200px] 3xl:h-[200px]
                        "
                    style={{ backgroundImage: `url(${image})` }}></div>
            <div>PLAYER2</div>
        </div>
    );
}