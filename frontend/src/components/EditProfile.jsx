import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        bio: user?.bio,
        gender: user?.gender,
        highlight1: user?.highlights?.[0] || '',
        highlight2: user?.highlights?.[1] || '',
        highlight3: user?.highlights?.[2] || ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }


    const editProfileHandler = async () => {
        console.log(input);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        formData.append("highlights", JSON.stringify([input.highlight1, input.highlight2, input.highlight3]));
        if(selectedFile){
                        formData.append("profilePhoto", selectedFile);
        }
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${API_URL}/api/v1/user/profile/edit`, formData,{
                withCredentials:true
            });
            if(res.data.success){
                const updatedUserData = {
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user.gender,
                    highlights:res.data.user?.highlights
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10 bg-white dark:bg-black text-black dark:text-white'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl text-black dark:text-white'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 dark:bg-[#23272e] rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : user?.profilePicture} alt="post_image" />
                            <AvatarFallback className="text-black dark:text-white bg-gray-100 dark:bg-[#374151]">CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm text-black dark:text-white'>{user?.username}</h1>
                            <span className='text-gray-600 dark:text-gray-300'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2 text-black dark:text-white'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent bg-gray-100 dark:bg-[#23272e] text-black dark:text-white border border-gray-200 dark:border-gray-800" />
                </div>
                <div>
                    <h1 className='font-bold mb-2 text-black dark:text-white'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full bg-gray-100 dark:bg-[#23272e] text-black dark:text-white border border-gray-200 dark:border-gray-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2 text-black dark:text-white'>Highlights</h1>
                    <Textarea value={input.highlight1} onChange={(e) => setInput({ ...input, highlight1: e.target.value })} name='highlight1' className="focus-visible:ring-transparent bg-gray-100 dark:bg-[#23272e] text-black dark:text-white border border-gray-200 dark:border-gray-800" placeholder="Highlight 1" />
                    <Textarea value={input.highlight2} onChange={(e) => setInput({ ...input, highlight2: e.target.value })} name='highlight2' className="focus-visible:ring-transparent mt-2 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white border border-gray-200 dark:border-gray-800" placeholder="Highlight 2" />
                    <Textarea value={input.highlight3} onChange={(e) => setInput({ ...input, highlight3: e.target.value })} name='highlight3' className="focus-visible:ring-transparent mt-2 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white border border-gray-200 dark:border-gray-800" placeholder="Highlight 3" />
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile