function Option({ img, title, des }) {
  return (
    <div className="xs:w-[90%] lg:w-[40%] lg:h-[80%] xs:h-[95%] bg-transparent/45 rounded-2xl border-2 border-gray-600 p-5 flex flex-col justify-around items-center">
        <img className="w-64 h-64 rounded-xl" src={img} alt="" />
        <h1 className="xs:text-[30px] lg:text-[1.5vw] font-NK57" >{title}</h1>
        <p className="xs:text-[15px] text-center lg:text-[0.8vw] font-Red">{des}</p>
    </div>
  );
}
export default Option