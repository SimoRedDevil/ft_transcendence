
interface PlayerProps{
    image: string;
}

export default function Player({image}: PlayerProps)
{
    return (
        <div className="lm:box-border lm:border-2 lm:border-red-500
                        min-w-[200px]
                        2xl:min-h-[50%] xl:mt-9 lm:flex
                        lm:justify-center
                        lm:items-start lm:w-[210px]">
            <div className="bg-cover bg-center cover rounded-full
                            sm:w-[50px] sm:h-[50px] 
                            lm:w-[70px] lm:h-[70px] lm:mt-8 
                            lg:w-[100px] lg:h-[100px]
                            xl:w-[100px] xl:h-[100px]
                            2xl:w-[150px] 2xl:h-[150px]
                            3xl:w-[200px] 3xl:h-[200px]"
                    style={{ backgroundImage: `url(${image})` }}></div>
        </div>
    );
}

