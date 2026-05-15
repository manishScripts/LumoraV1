import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useFollowOrUnfollow from '@/hooks/useFollowOrUnfollow';

const SuggestedUsers = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const followOrUnfollow = useFollowOrUnfollow();

    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((sUser) => {
                    const isFollowing = user?.following?.includes(sUser._id);
                    return (
                        <div key={sUser._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${sUser?._id}`}>
                                    <Avatar className="bg-gray-100 dark:bg-[#374151]">
                                        <AvatarImage src={sUser?.profilePicture} alt="post_image" />
                                        <AvatarFallback className="text-black dark:text-white">CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <Link to={`/profile/${sUser?._id}`} className="text-black dark:text-white">{sUser?.username}</Link>
                                    </h1>
                                    <span className='text-gray-600 dark:text-gray-400 text-sm'>{sUser?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <span onClick={() => followOrUnfollow(sUser._id)} className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers