import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = ({ setOpenCreatePost }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        try {
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.get(`${API_URL}/api/v1/user/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpenCreatePost(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === 'Explore') {
            navigate("/explore");
        }
    }

    const sidebarItems = [
        { icon: <Home className="text-black dark:text-white" />, text: "Home" },
        { icon: <Search className="text-black dark:text-white" />, text: "Search" },
        { icon: <TrendingUp className="text-black dark:text-white" />, text: "Explore" },
        { icon: <MessageCircle className="text-black dark:text-white" />, text: "Messages" },
        { icon: <Heart className="text-black dark:text-white" />, text: "Notifications" },
        { icon: <PlusSquare className="text-black dark:text-white" />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut className="text-black dark:text-white" />, text: "Logout" },
    ]
    return (
        <div className={`hidden md:flex fixed top-0 z-10 left-0 h-screen flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-colors duration-300 w-[240px]`}>
            <div className='flex flex-col mt-8'>
                <h1 className='pl-3 font-bold text-2xl text-black dark:text-white tracking-tight mb-8'>LUMORA</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            if (item.text === "Notifications") {
                                return (
                                    <Popover key={index}>
                                        <PopoverTrigger asChild>
                                            <div className='flex items-center gap-3 relative hover:bg-gray-100 dark:hover:bg-[#1F2937] cursor-pointer rounded-lg p-3 my-2 transition-colors duration-200 text-black dark:text-white'>
                                                {item.icon}
                                                <span>{item.text}</span>
                                                {
                                                    likeNotification.length > 0 && (
                                                        <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                    )
                                                }
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                                            <div>
                                                {
                                                    likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                        likeNotification.map((notification) => {
                                                            return (
                                                                <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                    <Avatar>
                                                                        <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                        <AvatarFallback>CN</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                }
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 dark:hover:bg-[#1F2937] cursor-pointer rounded-lg p-3 my-2 transition-colors duration-200 text-black dark:text-white'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            
        </div>
    )
}

export default LeftSidebar