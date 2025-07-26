import  {  useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { LoadingAnimation } from '../components/Loading';
import { UserData } from '../contexts/UserContext';
import Logo from "../assets/logo.jpg"
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const { loginUser, btnLoading } = UserData()

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        loginUser(email, password, navigate)
    }

    return (
        <div className="sm:min-h-screen p-10 sm:pt-5 mt-5 sm:mt-0  flex items-center justify-center ">
            <div className='bg-white p-8 sm:p-5  rounded-lg shadow-2xl shadow-gray-500 w-full  max-w-md'>
                <div className='flex justify-center mb-4 items-center'>
                    <img src={Logo} alt="optipin" className='h-12' />
                </div>
                <div>
                    <h2 className='text-2xl font-semibold text-center mb-6'>Login to see more</h2>
                </div>
                <form onSubmit={submitHandler}>
                    <div className='mb-4'>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                        <input type="email"
                            id='email'
                            className='common-input'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mb-4" className='block text-sm font-medium text-gray-700'>Password</label>
                        <input type="password"
                            id='password'
                            className='common-input'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type='sumbit' className='common-btn' disabled={btnLoading}>

                        {btnLoading ? <LoadingAnimation /> : "Login"}
                    </button>
                </form>
                <div className='mt-8 text-center'>
                    <div className='relative mb-4'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 to-gray-50'></span>
                        </div>
                    </div>
                    <div className='mt-4 text-center text-sm'>
                        <span>
                            Not on OptiPin Yet?{" "}
                            <Link to="/register" className='font-medium text-clipbase'>Register</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login