import { setFollowOrUnfollow } from '@/redux/authSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const useFollowOrUnfollow = () => {
    const dispatch = useDispatch();
    const followOrUnfollowHandler = async (id) => {
        try {
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${API_URL}/api/v1/user/followorunfollow/${id}`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setFollowOrUnfollow(res.data));
            }
        } catch (error) {
            console.log(error);
        }
    }
    return followOrUnfollowHandler;
}

export default useFollowOrUnfollow;