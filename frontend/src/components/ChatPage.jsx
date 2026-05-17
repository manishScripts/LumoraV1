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
                headers: { 'Content-Type': 'application/json' },
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
        return () => { dispatch(setSelectedUser(null)); }
    }, [dispatch]);

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-black">

            {/* ── Left sidebar ── */}
            <div className="w-64 flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <h1 className="font-bold px-4 py-4 text-lg text-black dark:text-white border-b border-gray-200 dark:border-gray-800">
                    {user?.username}
                </h1>
                <div className="flex-1 overflow-y-auto">
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div
                                key={suggestedUser?._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className="flex gap-3 items-center px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors duration-150"
                            >
                                <Avatar className="w-11 h-11 flex-shrink-0">
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm">CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-sm text-black dark:text-white truncate">{suggestedUser?.username}</span>
                                    <span className={`text-xs font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                                        {isOnline ? 'online' : 'offline'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Chat window ── */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-black">

                    {/* Top bar */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                        <Avatar className="w-9 h-9">
                            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm">CN</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-black dark:text-white">{selectedUser?.username}</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3">
                        <Messages selectedUser={selectedUser} />
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                        <Input
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            type="text"
                            className="flex-1 bg-gray-100 dark:bg-[#2C2C2E] text-black dark:text-white border-transparent focus-visible:ring-transparent rounded-full px-4"
                            placeholder="Messages..."
                        />
                        <Button
                            className="bg-[#877EFF] hover:bg-[#6C63FF] text-white rounded-full px-6 font-semibold transition-colors"
                            onClick={() => sendMessageHandler(selectedUser?._id)}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-black dark:text-white">
                    <MessageCircleCode className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                    <h1 className="font-semibold text-lg">Your messages</h1>
                    <span className="text-sm text-gray-500">Send a message to start a chat.</span>
                </div>
            )}
        </div>
    );
}

export default ChatPage;