import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { toast } from 'sonner';

const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const errorMessage = error.response?.data?.message || "";

                // Check for 401 Unauthorized OR 400 with specific token expiration message
                if (
                    error.response?.status === 401 ||
                    (error.response?.status === 400 && errorMessage.includes("token has expired"))
                ) {
                    // Prevent multiple toasts/redirects if already logged out
                    if (localStorage.getItem('accessToken')) {
                        console.warn("Session expired. Logging out...");
                        localStorage.removeItem('accessToken');
                        dispatch(setUser(null));
                        toast.error("Session expired. Please log in again.");
                        navigate('/login');
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate, dispatch]);

    return children;
};

export default AxiosInterceptor;
