import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send, BookmarkCheck } from 'lucide-react'
import { saveAs } from 'file-saver';
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { API_URL } from "@/constants";

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    
    // Derive state from props to keep in sync with global Redux state
    const liked = post.likes.includes(user?._id);
    const postLike = post.likes.length;
    const comment = post.comments;
    const bookmarked = user?.bookmarks?.includes(post._id);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${API_URL}/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.success) {
                // apne post ko update krunga in global state
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked 
                            ? p.likes.filter(id => id.toString() !== user._id.toString()) 
                            : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${API_URL}/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
            if(res.data.success){
                const updatedBookmarks = res.data.type === 'saved' 
                    ? [...user.bookmarks, post._id] 
                    : user.bookmarks.filter(id => id.toString() !== post._id.toString());
                
                dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const downloadImage = () => {
        saveAs(post.image, `lumora_post_${post._id}.jpg`);
    }

    return (
        <div className='my-4 w-full max-w-xl mx-auto px-4 sm:px-0'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                        <AvatarFallback className="text-black dark:text-white bg-gray-100 dark:bg-[#374151]">CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <h1 className="text-black dark:text-white">{post.author?.username}</h1>
                       {user?._id === post.author._id &&  <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer text-black dark:text-white' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {
                        post?.author?._id !== user?._id && <Button variant='ghost-destructive' className="cursor-pointer w-fit">Unfollow</Button>
                        }
                        
                        <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
                        {
                            user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-black dark:text-white' />
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-black dark:text-white' />
                    <Send onClick={downloadImage} className='cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-black dark:text-white' />
                </div>
                {
                    bookmarked ? <BookmarkCheck onClick={bookmarkHandler} className='cursor-pointer text-[#3BADF8]' /> : <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-black dark:text-white' />
                }
            </div>
            <span className='font-medium block mb-2 text-black dark:text-white'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2 text-black dark:text-white'>{post.author?.username}</span>
                <span className='text-black dark:text-white'>{post.caption}</span>
            </p>
            {
                comment.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer text-sm text-gray-400 dark:text-gray-300'>View all {comment.length} comments</span>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full bg-white dark:bg-[#2C2C2E] text-black dark:text-white border border-gray-200 dark:border-gray-800 rounded-md px-2 py-1'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }

            </div>
        </div>
    )
}

export default Post