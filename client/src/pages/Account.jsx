import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserData } from '../contexts/UserContext';

function Account({ user }) {
  const { logoutUser, getProfile } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => logoutUser(navigate);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfile(user._id);
      if (data) setProfile(data);
    };
    fetchData();
  }, [user]);

  return (
    <div className='sm:min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 flex items-center justify-center'>
      <div className='bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col md:flex-row gap-10'>

        {/* Left Panel */}
        <div className='flex-1 flex flex-col items-center justify-between text-center'>
          <div>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt='User Avatar'
                className={`w-40 sm:w-52 object-cover border-4 rounded-full shadow-lg mx-auto ${user.gender === 'female'
                    ? 'border-pink-400 shadow-pink-200'
                    : 'border-blue-400 shadow-blue-200'
                  } transition-transform hover:scale-105 duration-300`}
              />
            ) : (
              <div className='w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 flex items-center justify-center rounded-full text-3xl text-gray-500 mx-auto'>
                ?
              </div>
            )}

            <h2 className='mt-4 text-3xl font-bold text-gray-800'>
              {user?.fullname || 'Anonymous User'}
            </h2>
            <p className='text-sm text-gray-500 italic'>
              {user?.email || 'No email available'}
            </p>
          </div>

          {/* Edit & Logout Buttons */}
          <div className='mt-8 flex flex-col items-center gap-4 w-full'>
            <Link
              to='/update'
              className='text-blue-600 hover:underline font-medium'
            >
              ✏️ Edit Profile
            </Link>
            <button
              onClick={logoutHandler}
              className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-lg transition'
            >
              Logout
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className='w-px bg-gray-200 hidden md:block'></div>

        {/* Right Panel */}
        <div className='flex-1 flex flex-col gap-6 text-gray-800'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>

            {/* Followers */}
            {/* Followers */}
            <div className='bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold text-gray-600 mb-2'>Followers</h3>
              <p className='text-xl font-bold mb-4'>{profile?.followers?.length || 0}</p>
              <div className='space-y-3 max-h-64 overflow-y-auto custom-scrollbar'>
                {profile?.followers?.map(f => (
                  <Link
                    key={f._id}
                    to={`/owner/${f._id}`} // ✅ corrected path
                    className='flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition'
                  >
                    <img
                      src={f.avatar || '/fallback-avatar.png'} // ✅ fallback avatar (optional)
                      alt={f.fullname}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <p className='text-gray-700 font-medium'>{f.fullname}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Following */}
            <div className='bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold text-gray-600 mb-2'>Following</h3>
              <p className='text-xl font-bold mb-4'>{profile?.following?.length || 0}</p>
              <div className='space-y-3 max-h-64 overflow-y-auto custom-scrollbar'>
                {profile?.following?.map(f => (
                  <Link
                    key={f._id}
                    to={`/owner/${f._id}`} // ✅ corrected path
                    className='flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition'
                  >
                    <img
                      src={f.avatar || '/fallback-avatar.png'} // ✅ fallback avatar (optional)
                      alt={f.fullname}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <p className='text-gray-700 font-medium'>{f.fullname}</p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Account;







