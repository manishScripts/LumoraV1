import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle, Bookmark, Grid, Video, Tag } from 'lucide-react';
import useFollowOrUnfollow from '@/hooks/useFollowOrUnfollow';
import { setSelectedUser } from '@/redux/chatSlice';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const location = useLocation();
  useGetUserProfile(userId, location.key);
  const [activeTab, setActiveTab] = useState('posts');
  const followOrUnfollow = useFollowOrUnfollow();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const messageHandler = (profile) => {
    dispatch(setSelectedUser(profile));
    navigate('/chat');
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="w-full flex justify-center bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <div className="w-full max-w-5xl mx-auto px-0 sm:px-2 py-8 md:pl-60">
        {/* Profile header row (horizontal on desktop, stacked on mobile) */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-12 gap-4 mb-6 md:mb-8 border-b border-gray-200 dark:border-gray-800 pb-6 md:pb-8">
          {/* Profile image */}
          <div className="flex-shrink-0 flex flex-col items-center w-full md:w-40 mb-4 md:mb-0">
            <Avatar className="h-24 w-24 md:h-40 md:w-40 border-2 border-gray-300 dark:border-gray-700">
              <AvatarImage src={isLoggedInUserProfile ? user?.profilePicture : userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback className="text-black dark:text-white bg-gray-100 dark:bg-[#374151]">CN</AvatarFallback>
            </Avatar>
          </div>
          {/* Profile info */}
          <div className="flex-1 flex flex-col gap-4 items-center md:items-start w-full">
            {/* Username, buttons */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-center md:justify-start">
              <span className="font-semibold text-2xl text-black dark:text-white text-center md:text-left">{userProfile?.username}</span>
              {isLoggedInUserProfile ? (
                <div className="flex gap-2 justify-center md:justify-start">
                  <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 dark:hover:bg-[#23272e] h-8 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white'>Edit profile</Button></Link>
                  <Button variant='secondary' className='hover:bg-gray-200 dark:hover:bg-[#23272e] h-8 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white'>View archive</Button>
                </div>
              ) : (
                isFollowing ? (
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button onClick={() => followOrUnfollow(userProfile?._id)} variant='secondary' className='h-8 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white'>Unfollow</Button>
                    <Button onClick={() => messageHandler(userProfile)} variant='secondary' className='h-8 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white'>Message</Button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button onClick={() => followOrUnfollow(userProfile?._id)} className='bg-[#0095F6] hover:bg-[#3192d2] h-8 text-white'>Follow</Button>
                  </div>
                )
              )}
            </div>
            {/* Stats */}
            <div className="flex gap-8 text-center md:text-left w-full justify-center md:justify-start">
              <span><b className="text-black dark:text-white">{userProfile?.posts.length}</b> posts</span>
              <span><b className="text-black dark:text-white">{userProfile?.followers.length}</b> followers</span>
              <span><b className="text-black dark:text-white">{userProfile?.following.length}</b> following</span>
            </div>
            {/* Name, bio */}
            <div className="text-center md:text-left w-full">
              <span className="font-bold block text-black dark:text-white">{userProfile?.name || userProfile?.username}</span>
              <p className="text-sm text-black dark:text-white">{userProfile?.bio || 'bio here...'}</p>
              <Badge className='w-fit bg-gray-100 dark:bg-[#23272e] text-black dark:text-white mt-1' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
              {/* Highlights as a list */}
              {userProfile?.highlights && userProfile.highlights.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {userProfile.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-black dark:text-white text-sm">
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex justify-center border-t border-b py-2 mb-4 w-full sticky top-0 z-40 bg-white dark:bg-black">
          <div className="flex w-full max-w-md">
            <button className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'posts' ? 'font-bold border-t-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => handleTabChange('posts')}>
              <Grid className={`w-5 h-5 mx-auto ${activeTab === 'posts' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className="text-xs">POSTS</span>
            </button>
            <button className={`flex flex-col items-center flex-1 py-2 ${activeTab === 'saved' ? 'font-bold border-t-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => handleTabChange('saved')}>
              <Bookmark className={`w-5 h-5 mx-auto ${activeTab === 'saved' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className="text-xs">SAVED</span>
            </button>
            <button className="flex flex-col items-center flex-1 py-2 opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600">
              <Video className="w-5 h-5 mx-auto" />
              <span className="text-xs">REELS</span>
            </button>
            <button className="flex flex-col items-center flex-1 py-2 opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600">
              <Tag className="w-5 h-5 mx-auto" />
              <span className="text-xs">TAGS</span>
            </button>
          </div>
        </div>
        {/* Posts grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800">
          {displayedPost?.length > 0 ? displayedPost.map((post) => (
            <div key={post?._id} className='relative group cursor-pointer bg-white dark:bg-black'>
              <img src={post.image} alt='postimage' className='w-full aspect-square object-cover border border-gray-100 dark:border-gray-900' />
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='flex items-center text-white space-x-4'>
                  <button className='flex items-center gap-2 hover:text-gray-300'>
                    <Heart />
                    <span>{post?.likes.length}</span>
                  </button>
                  <button className='flex items-center gap-2 hover:text-gray-300'>
                    <MessageCircle />
                    <span>{post?.comments.length}</span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center text-gray-400 dark:text-gray-600 py-10">No posts to show.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile