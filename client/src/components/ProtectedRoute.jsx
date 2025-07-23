import {Navigate} from "react-router-dom";
import {UserData} from "../contexts/UserContext";
import toast from "react-hot-toast";

function ProtectedRoute({children}){
    const {isAuth} = UserData();
    
    if (!isAuth) {
        toast.error("You need to log in to access this service");
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;