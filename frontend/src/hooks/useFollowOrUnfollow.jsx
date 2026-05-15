import { setFollowOrUnfollow } from '@/redux/authSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { API_URL } from "@/constants";

const useFollowOrUnfollow = () => {
    const dispatch = useDispatch();
    const followOrUnfollowHandler = async (id) => {
        try {
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