import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../contexts/UserContext';
import { LoadingAnimation } from '../components/Loading';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

function UpdateAccount() {
  const { user, updateUser, btnLoading,deleteMyProfile } = UserData();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account permanently? This action cannot be undone.")) {
      deleteMyProfile(navigate);
    }
  };

  const handleRemoveImage = () => {
    setAvatar(null);
    setAvatarPreview(null);
    fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(fullname, email, gender, avatar, navigate);
  };

 

  return (
    <div className='min-h-screen p-5 flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Update Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className='flex items-center justify-center mb-4'>
            <div
              onClick={() => fileInputRef.current.click()}
              className='w-28 h-28 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden relative'
            >
              {avatarPreview ? (
                <>
                  <img
                    src={avatarPreview}
                    alt='avatar preview'
                    className='w-full h-full object-cover rounded-full hover:ring-2 hover:ring-red-400 transition'
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className='absolute top-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-md z-10'
                    title='Remove Image'
                  >
                    <AiOutlineDelete className='text-red-600 text-lg' />
                  </button>
                </>
              ) : (
                <div className='flex flex-col items-center text-gray-500'>
                  <AiOutlinePlus className='text-3xl' />
                  <span className='text-xs mt-1'>Add Photo</span>
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

          {/* Full Name */}
          <div className='mb-4'>
            <label htmlFor='fullname' className='block text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              id='fullname'
              className='common-input'
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='common-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Gender */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
            <div className='flex gap-6'>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='gender'
                  value='male'
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='gender'
                  value='female'
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <button type='submit' className='common-btn w-full' disabled={btnLoading}>
            {btnLoading ? <LoadingAnimation /> : 'Save Changes'}
          </button>
        </form>

        {/* 🔴 Delete Account Button */}
        <button
          type='button'
          onClick={handleDeleteAccount}
          className='mt-6 w-full text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-medium py-2 px-4 rounded transition duration-200'
          disabled={btnLoading}
        >
          {btnLoading ? 'Deleting...' : 'Delete My Account'}
        </button>
        
      </div>
    </div>
  );
}

export default UpdateAccount;

