import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { API_URL } from '@/constants';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${API_URL}/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, [dispatch]);

    return (
        <div className="h-full flex flex-col md:flex-row">
            {/* User list panel */}
            <div className="w-full h-64 md:w-72 md:h-full flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800 bg-white dark:bg-black">
                <h1 className='font-bold px-3 py-4 text-xl text-black dark:text-white border-b border-gray-300 dark:border-gray-800 w-full'>
                    {user?.username}
                </h1>
                <div className='flex-1 overflow-y-auto w-full'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div key={suggestedUser?._id} onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 dark:hover:bg-[#1F2937] cursor-pointer rounded-lg transition-colors duration-200 w-full'>
                                    <Avatar className='w-14 h-14 bg-gray-100 dark:bg-[#374151]'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback className="text-black dark:text-white">CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium text-black dark:text-white'>{suggestedUser?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {/* Chat window */}
            {selectedUser ? (
                <div className='flex-1 h-full flex flex-col bg-white dark:bg-black'>
                    {/* Top bar */}
                    <div className='flex items-center px-3 py-2 border-b border-gray-300 dark:border-gray-800 w-full'>
                        <Avatar>
                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback className="text-black dark:text-white bg-gray-100 dark:bg-[#374151]">CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col ml-2'>
                            <span className="text-black dark:text-white">{selectedUser?.username}</span>
                        </div>
                    </div>
                    {/* Messages */}
                    <div className='flex-1 overflow-y-auto w-full'>
                        <Messages selectedUser={selectedUser} />
                    </div>
                    {/* Input */}
                    <div className='flex items-center p-4 border-t border-gray-300 dark:border-gray-800 w-full'>
                        <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent bg-white dark:bg-[#2C2C2E] text-black dark:text-white border border-gray-200 dark:border-gray-800 rounded-md px-2 py-1' placeholder="Messages..." />
                        <Button className="bg-[#877EFF] text-white rounded-full py-2 px-6 font-semibold shadow-md hover:bg-[#6C63FF] transition" onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                    </div>
                </div>
            ) : (
                <div className='flex-1 h-full flex flex-col items-center justify-center text-black dark:text-white'>
                    <MessageCircleCode className='w-32 h-32 my-4' />
                    <h1 className='font-medium'>Your messages</h1>
                    <span>Send a message to start a chat.</span>
                </div>
            )}
        </div>
    )
}

export default ChatPage