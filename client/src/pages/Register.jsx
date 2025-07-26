import React, { useState, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { UserData } from '../contexts/UserContext';
import { LoadingAnimation } from '../components/Loading';
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import Logo from "../assets/logo.jpg"

function Register() {

  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const { RegisterUser, btnLoading } = UserData()

  const navigate = useNavigate()


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const handleRemoveImage = (e) => {
    setAvatar(null);
    setAvatarPreview(null);
    fileInputRef.current.value = "";
  };


  const submitHandler = (e) => {
    e.preventDefault();
    RegisterUser(fullname, email, password, gender,avatar, navigate)
  }

  return (
    <div className='min-h-screen p-8 sm:pt-5 mt-5 sm:mt-0 flex items-center justify-center'>
      <div className='bg-white p-5 rounded-lg shadow-2xl w-full  shadow-gray-500 max-w-md'>
        <div className='flex justify-center mb-4 items-center'>
          <img
            src={Logo}
            alt="optipin"
            className='h-12'
          />
        </div>
        <h2 className='text-2xl font-semibold text-center mb-6'>Register to see more</h2>

        <form onSubmit={submitHandler}>

          <div className='flex items-center justify-center'>
            <div onClick={() => fileInputRef.current.click()}
              className='w-28 h-28 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden relative'
            >
              {avatarPreview ? (
                <>
                  <img src={avatarPreview} alt="preview" className='w-full h-full object-cover rounded-full hover:ring-2 hover:ring-red-400 transition ' />

                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className='absolute top-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-md z-10'
                    title='Remove Image'
                  >
                    <AiOutlineDelete className="text-red-600 text-lg" />
                  </button>

                </>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <AiOutlinePlus className="text-3xl" />
                  <span className="text-xs mt-1">Add Photo</span>
                </div>
              )}

              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleImageChange}
                className='hidden'
              />
            </div>


          </div>

          <div className='mb-4'>
            <label htmlFor="fullname" className='block text-sm font-medium text-gray-700'>Full Name</label>
            <input
              type="text"
              id='fullname'
              className='common-input'
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
            <input
              type="email"
              id='email'
              className='common-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
            <input
              type="password"
              id='password'
              className='common-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <button type='submit' className='common-btn' disabled={btnLoading}>
            {btnLoading ? <LoadingAnimation /> : "Register"}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <div className='relative mb-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>or</span>
            </div>
          </div>
          <div className='mt-4 text-sm'>
            <span>
              Already on Optipin?{" "}
              <Link to="/login" className="font-medium text-blue-600">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register