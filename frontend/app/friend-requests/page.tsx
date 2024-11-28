'use client';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { axiosInstance } from '@/utils/axiosInstance'
import { UserContext, useUserContext } from '@/components/context/usercontext'
import Image from 'next/image'
import axios from 'axios'
import { getCookies } from '../../components/auth';
import { FaUserFriends } from "react-icons/fa";
import { TbMessageUser } from "react-icons/tb";
import { IoIosSend } from "react-icons/io";
import TextBox from '@/components/TextBox';
import { fetchSearchResults } from '@/components/friendHelper';
import {toast} from 'react-toastify'

function page() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isFriend, setIsFriend] = useState(false);
    const [createdRequests, setCreatedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [requests, setRequests] = useState(true);
    const [sentRequest, setSentRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const {authUser,loading,} = useUserContext();
    const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearchInput(searchInput);
        }, 300);
    
        return () => clearTimeout(handler);
      }, [searchInput]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const res = await axiosInstance.get('friends/requests/')
                setFriendRequests(res.data)
            } catch (error) {
                console.log(error)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchFriendRequests();
    }, [requests, sentRequest, isSearch]);

    const handleAccept = async (requestId) => {
        const body = {
            id: requestId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`http://localhost:8000/api/friends/requests/accept-request/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 200) {
                toast.success('Friend request accepted')
            }
          } catch (error) {
            toast.error('An error occurred')
          }
    }
    
    useEffect(() => {
        if (debouncedSearchInput !== "") {
          fetchSearchResults(debouncedSearchInput, setSearchResults, setSearchLoading);
        } else {
          setSearchResults([]);
        }
      }, [debouncedSearchInput]);
    
    const handleReject = async (requestId) => {
        const body = {
            id: requestId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`http://localhost:8000/api/friends/requests/reject-request/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 200) {
                toast.success('Friend request rejected')
            }
          } catch (error) {
            toast.error('An error occurred')
          }
    }

    const createFriendRequest = async (receiverId, senderId) => {
        const body = {
            receiver: receiverId,
            sender: senderId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`http://localhost:8000/api/friends/requests/create-request/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 201) {
                toast.success('Friend request sent')
            }
          } catch (error) {
            toast.error('An error occurred')
          }
    }
    const getFriendRequests = async () => {
        try {
            const res = await axiosInstance.get('auth/get-friends/')
            if (res.status === 200) {
                setFriends(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getFriendRequests();
    }
    , [isFriend])
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (!value || value.length < 1) {
            setSearchInput('');
            setSearchResults([]);
            return;
        }
        setSearchInput(value);
    };
    
    
    if (loading || isLoading) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className='border border-white/30 rounded-[30px] bg-black bg-opacity-50 w-[90%] h-[95%] flex items-center p-5'>
                    <div className='text-white text-lg'>Loading...</div>
                </div>
            </div>
        )
    }
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='border border-white/30 rounded-[30px] bg-black bg-opacity-50 w-[90%] h-[95%] pr-10 p-5 
        overflow-hidden no-scrollbar
        '>
            <div className='flex justify-around w-full  sm:w-[900px] h-[30px] sm:h-[50px]'>
            <button onClick={
                () => {setRequests(true)
                    setSentRequest(false)
                    setIsSearch(false)
                    setIsFriend(false)
                    setSearchInput('');
                    setSearchResults([])
                }
            } className='flex  justify-start mx-2 xs:mx-0'>
                <FaUserFriends className='text-[30px] text-white mr-2' />
                <div className='text-white text-lg hidden sm:block'>Requests</div>
            </button>
            <button onClick={
                () => {setSentRequest(true)
                    setRequests(false)
                    setIsSearch(false)
                    setIsFriend(false)
                    setSearchInput('');
                    setSearchResults([])
                }
            } className='flex  justify-start mx-2 xs:mx-0 '>
                <TbMessageUser className='text-[30px] text-white mr-2' />
                <div className='text-white text-lg hidden sm:block'>Sent</div>
            </button>
            <button onClick={
                () => {setSentRequest(false)
                    setRequests(false)
                    setIsSearch(false)
                    setIsFriend(true)
                    setSearchInput('');
                    setSearchResults([])
                }
            } className='flex  justify-start mx-2 xs:mx-0 '>
                <FaUserFriends className='text-[30px] text-white mr-2' />
                <div className='text-white text-lg hidden sm:block'>
                    Friends
                </div>
            </button>
            <button onClick={
                () => {setSentRequest(false)
                    setRequests(false)
                    setIsFriend(false)
                    setIsSearch(true)
                }
            } className='flex justify-start mx-2 xs:mx-0 '>
                {!isSearch ?
                <>
                    <IoIosSend className='text-[30px] text-white mr-2' />
                    <div className='text-white text-lg hidden sm:block'>Send</div>
                </>
                :
                <TextBox focus={true} onChange={(e) => handleInputChange(e)} placeholder='Search'
                    icon='/icons/search.png' className='border border-white border-opacity-30 w-full sm:w-[90%] h-[40px]
                        bg-black bg-opacity-50 rounded-[30px] flex items-center '/>
                }
            </button>
            </div>
            <div className='w-full h-[1px] bg-white/30 my-5'></div>
            <div className='w-full text-white gap-3 h-full overflow-y-auto overflow-x-hidden no-scrollbar '>
            {requests && (
                <>
                    {friendRequests && friendRequests.length < 1 && <p>No friend requests</p>}
                    {friendRequests?.map((request) => (
                    request.receiver_info.username === authUser?.username && (
                        <div key={request.id} className='flex flex-col gap-2 xs:gap-0 xs:flex-row xs:items-center xs:justify-between'>
                        <div className='flex items-center gap-2 w-full'>
                            <Image src={request.sender_info.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                            <div className='text-white text-[15px] sm:text-[20px]'>{request.sender_info.full_name}</div>
                        </div>
                        <div className='flex gap-1'>
                            <button onClick={() => handleAccept(request.id)} className='bg-[#2A9D8F] hover:bg-[#32b7a8] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Accept</button>
                            <button onClick={() => handleReject(request.id)} className='bg-[#c75462] hover:bg-[#db5e6c] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Reject</button>
                        </div>
                        </div>
                    )
                    ))}
                </>
                )}
                {sentRequest && (
                <>
                    {friendRequests && friendRequests.length < 1 && <p>No sent requests</p>}
                    {friendRequests?.map((request) => (
                    request.sender_info.username === authUser?.username && (
                        <div key={request.id} className='flex flex-col gap-2 xs:gap-0 xs:flex-row xs:items-center xs:justify-between'>
                        <div className='flex items-center gap-2 w-full'>
                            <Image src={request.receiver_info.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                            <div className='text-white text-[15px] sm:text-[20px]'>{request.receiver_info.full_name}</div>
                        </div>
                        <div className='flex gap-1'>
                        <button onClick={() => handleReject(request.id)} className='bg-[#c75462] hover:bg-[#db5e6c] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Cancel</button>
                        </div>
                        </div>
                    )
                    ))}
                </>
                )}
                {isFriend && (
                <>
                    {friends && friends.length < 1 && <p>No friends</p>}
                    {friends?.map((friend) => (
                    <div key={friend.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                        <div className='flex items-center gap-2 w-full'>
                        <Image src={friend.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                        <div className='text-white text-[15px] sm:text-[20px]'>{friend.full_name}</div>
                        </div>
                        <div className='flex gap-1'>
                        <button className='bg-[#c75462] hover:bg-[#db5e6c] text-[15px]
                            sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>
                                Remove
                            </button>
                        </div>
                    </div>
                    ))}    

                </>
                )
                }
                {isSearch && (
                    <>
                    {(!searchResults || searchResults.length < 1) && <p>No search results</p>}
                    {searchResults?.map((result) => (
                        result.username !== authUser?.username &&
                        friends.filter(friend => friend.username === result.username).length < 1 && (
                        <div key={result.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                            <div className='flex items-center gap-2 w-full'>
                                <Image src={result.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                                <div className='text-white text-[15px] sm:text-[20px]'>{result.full_name}</div>
                            </div>
                            <div className='flex gap-1'>
                                <button onClick={() => createFriendRequest(result.id, authUser.id)} className='bg-[#2A9D8F] hover:bg-[#32b7a8]
                                    text-[17px] xs:text-[20px] w-[75px] xs:w-[100px] rounded-[30px] p-2'>Add</button>
                            </div>
                        </div>
                        )
                    ))}
                    </>
                )}

            </div>
        </div>
    </div>
  )
}

export default page