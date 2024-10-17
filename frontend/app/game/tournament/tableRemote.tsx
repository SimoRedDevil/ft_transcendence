import React, { useRef, useEffect} from 'react';


export default function Table() {

  
  useEffect(() => {
    if (typeof window !== 'undefined') {

      
    }
  }, []);

  return (
    // @ts-ignore
    <div  className="aspect-[3/4] w-[250px]
                                      xs:w-[350px]
                                      ls:w-[380px]
                                      sm:w-[330px]
                                      md:w-[350px]
                                      lm:w-[400px]
                                      2xl:w-[430px]
                                      3xl:w-[530px]
                                      4xl:w-[530px]
                                      rounded-lg overflow-hidden 
                                      border-2 border-teal-300
                                      shadow-[0_0_12px_#fff]"/>
  );
}
