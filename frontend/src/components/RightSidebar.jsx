import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className="hidden lg:block w-fit my-10 pr-10 xl:pr-32">
      <div className="flex items-center gap-2 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-800">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="bg-gray-100 dark:bg-[#374151]">
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback className="text-black dark:text-white">CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'>
            <Link to={`/profile/${user?._id}`} className="text-black dark:text-white">
              {user?.username}
            </Link>
          </h1>
          <span className="text-gray-600 dark:text-gray-400 text-sm">{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar