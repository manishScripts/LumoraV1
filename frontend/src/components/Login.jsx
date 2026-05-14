import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dark, setDark] = useState(() => {
      // Default to dark mode
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [dark]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${API_URL}/api/v1/user/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error("Network Error: No response received from server.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${dark ? 'bg-black' : 'bg-white'}`}>
            <button
              aria-label="Toggle dark mode"
              className="absolute top-4 right-4 p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black shadow-md z-10"
              onClick={() => setDark(d => !d)}
            >
              {dark ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
            </button>
            <form
              onSubmit={signupHandler}
              className="w-full max-w-md rounded-2xl shadow-xl p-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 flex flex-col gap-6"
              style={{ boxShadow: dark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(255,107,53,0.1)' }}
            >
                <div className="mb-4">
                    <h1 className="text-center font-bold text-3xl mb-2 text-black dark:text-white tracking-tight">LUMORA</h1>
                    <p className="text-center text-base text-gray-500 dark:text-gray-400">Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <label className="block text-gray-900 dark:text-white font-medium mb-2">Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="bg-gray-100 dark:bg-[#374151] border border-gray-300 dark:border-[#374151] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#877EFF] focus:border-[#877EFF] transition"
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 dark:text-white font-medium mb-2">Password</label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="bg-gray-100 dark:bg-[#374151] border border-gray-300 dark:border-[#374151] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#877EFF] focus:border-[#877EFF] transition"
                        placeholder="Enter your password"
                    />
                </div>
                {
                    loading ? (
                        <Button className="bg-[#877EFF] text-white rounded-full py-3 font-semibold text-lg shadow-md hover:bg-[#6C63FF] transition">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className="bg-[#877EFF] text-white rounded-full py-3 font-semibold text-lg shadow-md hover:bg-[#6C63FF] transition">Login</Button>
                    )
                }
                <span className='text-center text-gray-500 dark:text-gray-400'>Dosent have an account? <Link to="/signup" className='text-[#877EFF] hover:underline'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login