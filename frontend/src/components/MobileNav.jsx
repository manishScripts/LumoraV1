import { useState } from 'react';
import { Home, Search, PlusSquare, Heart, User, MoreHorizontal, MessageCircle, TrendingUp, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const MobileNav = ({ setOpenCreatePost }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);

  const handleMenuClick = (action) => {
    setMenuOpen(false);
    if (action === 'Explore') navigate('/explore');
    if (action === 'Messages') navigate('/chat');
    if (action === 'Logout') {/* Add logout logic here */}
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 shadow-lg flex justify-between items-center h-16 px-2 md:hidden">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center py-2">
          <Home className="text-white w-7 h-7" />
        </Link>
        <Link to="/search" className="flex-1 flex flex-col items-center justify-center py-2">
          <Search className="text-white w-7 h-7" />
        </Link>
        <div onClick={() => setOpenCreatePost(true)} className="flex-1 flex flex-col items-center justify-center py-2">
          <PlusSquare className="text-white w-7 h-7" />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
              <Heart className="text-white w-7 h-7" />
              {likeNotification.length > 0 && (
                <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <div>
              {likeNotification.length === 0 ? (<p>No new notification</p>) : (
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
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Link to={`/profile/${user?._id}`} className="flex-1 flex flex-col items-center justify-center py-2">
          <User className="text-white w-7 h-7" />
        </Link>
        <button onClick={() => setMenuOpen(v => !v)} className="flex-1 flex flex-col items-center justify-center py-2 focus:outline-none">
          <MoreHorizontal className="text-white w-7 h-7" />
        </button>
      </nav>
      {menuOpen && (
        <div className="fixed bottom-20 right-4 z-50 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-2 flex flex-col w-40 animate-fade-in">
          <button onClick={() => handleMenuClick('Explore')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-black dark:text-white">
            <TrendingUp className="w-5 h-5" /> Explore
          </button>
          <button onClick={() => handleMenuClick('Messages')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-black dark:text-white">
            <MessageCircle className="w-5 h-5" /> Messages
          </button>
          <button onClick={() => handleMenuClick('Logout')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-600 dark:text-red-400">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      )}
    </>
  );
};

export default MobileNav; 