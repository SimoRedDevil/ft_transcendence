import React from 'react'
import { useState , useEffect} from 'react'

interface WaitingTournamentProps {
  numberplayer: number
}

export default function WaitingTournament({ numberplayer }: WaitingTournamentProps) {
  const [numplayer, setNumplayer] = useState(0);

  useEffect(() => {
    console.log("numplayer changed:", numplayer);
    setNumplayer(numberplayer);
  }, [numberplayer]);  
  return (
    <div className="flex justify-center items-center bg-[url('/images/waitingimage.png')] w-[800px] h-[550px] bg-cover bg-center border border-white border-opacity-30 rounded-[30px] space-x-3 opacity-90">
        <div className={`bg-[url('/images/avta.png')] w-[100px] h-[100px] border ${ numplayer >= 1 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
        </div>
        <div className={`bg-[url('/images/avta.png')] w-[100px] h-[100px] border ${ numplayer >= 2 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
        </div>
        <div className={`bg-[url('/images/avta.png')] w-[100px] h-[100px] border ${ numplayer >= 3 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
        </div>
        <div className={`bg-[url('/images/avta.png')] w-[100px] h-[100px] border ${ numplayer >= 4 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
        </div>
    </div>
  )
}
