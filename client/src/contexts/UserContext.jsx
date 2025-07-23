import axios from "../utils/axios";

import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast"

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isAuth, setAuth] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [owner, setOwner] = useState(null);


    async function RegisterUser(fullname, email, password, gender, avatar, navigate) {
        try {
            setBtnLoading(true)

            const formData = new FormData();
            formData.append("fullname", fullname);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("gender", gender);

            if (avatar) {
                formData.append("avatar", avatar)
            }
            const { data } = await axios.post("/api/auth/register", formData)
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
            await fetchUser()
            toast.success(data.message);
            navigate("/")
            setBtnLoading(false)
        } catch (error) {
            toast.error(error.response?.data?.message);
            setBtnLoading(false)
        }
    }
    async function loginUser(email, password, navigate) {
        try {

            setBtnLoading(true)
            const { data } = await axios.post("/api/auth/login", { email, password })
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
            await fetchUser()
            toast.success(data.message);
            navigate("/")
            setBtnLoading(false)

        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false)
        }
    }
    async function logoutUser(navigate) {
        try {
            const { data } = await axios.get("/api/auth/logout")
            setUser(null);
            setAuth(false);
            toast.success(data.message)
            navigate("/login")
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }



    async function fetchUser() {
        try {
            const { data } = await axios.get("/api/users/me")
            setUser(data.data);
            setAuth(true);
            setLoading(false)
        } catch (error) {
            console.log("User fetch failed:", error);
            setUser(null);
            setAuth(false);
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!user) fetchUser();
    }, [])

    async function fetchOwner(id) {
        try {
            const { data } = await axios.get(`/api/users/${id}/profile`);
            setOwner(data.data);
        } catch (error) {
            console.error("Failed to fetch owner:", error);
        } finally {
            setLoading(false);
        }
    }


    async function updateUser(fullname, email, gender, avatar, navigate) {
        try {
            setBtnLoading(true);
            const formData = new FormData();
            formData.append("fullname", fullname);
            formData.append("email", email);
            formData.append("gender", gender);
            if (avatar) {
                formData.append("avatar", avatar);
            }
            const { data } = await axios.patch("/api/users/update-me", formData);

            if (data.accessToken) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
            }
            await fetchUser();
            toast.success(data.message);
            navigate("/account");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user");
        } finally {
            setBtnLoading(false);
        }
    }

    const toggleFollowUser = async (targetUserId) => {
        try {
            const { data } = await axios.patch(`/api/users/${targetUserId}/follow`);
            toast.success(data.message);
            fetchUser();
        } catch (error) {
            console.error("Failed to follow/unfollow:", error);
            toast.error("Action failed.");
        }
    };


    const getProfile = async (userId) => {
        try {
            const { data } = await axios.get(`/api/users/${userId}/profile`);
            return data.data;
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("Unable to fetch profile");
            return null;
        }
    };

    const deleteMyProfile = async (navigate) => {
        try {
            setBtnLoading(true);

            const { data } = await axios.delete("/api/users/remove-me"); // ✅ FIXED URL

            setUser(null);
            setAuth(false);

            toast.success(data.message || "Profile deleted successfully");

           
            navigate("/login");

        } catch (error) {
            console.error("Failed to delete profile:", error);
            toast.error(error.response?.data?.message || "Failed to delete profile");
        } finally {
            setBtnLoading(false);
        }
    };



    return (
        <UserContext.Provider
            value={{
                loginUser,
                btnLoading,
                setBtnLoading,
                isAuth,
                user,
                fetchUser,
                loading,
                logoutUser,
                RegisterUser,
                updateUser,
                toggleFollowUser,
                getProfile,
                fetchOwner,
                deleteMyProfile,
                owner
            }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    )
}

export const UserData = () => useContext(UserContext)