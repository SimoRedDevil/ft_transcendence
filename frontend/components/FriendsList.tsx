import FriendCard from './FriendCard'
const FriendsList = ({ friends }) => {

    return (
        <>
        <div className='relative left-4 top-4 h-[90%] w-full overflow-auto hide-scrollbar'>

        <div className=' w-full h-auto   flex flex-col items-center gap-5 '>
            {friends.map((friend, index) => (

                <div key={index} className='relative w-[100%] h-[3.5rem]  flex flex-col justify-start items-center border'>
                    <FriendCard Name={friend.full_name} Username={friend.username} online={friend.online} />
                </div>
            ))}
        </div>
        </div>
        </>
    );
};
export default FriendsList