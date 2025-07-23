import { useNavigate, Link } from 'react-router-dom';
import { UserData } from '../contexts/UserContext';

function Account({ user }) {
  const { logoutUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 flex items-center justify-center px-4'>
      <div className='bg-white mt-6 rounded-3xl shadow-2xl p-8 w-full max-w-md sm:max-w-lg md:max-w-xl text-center transition-all duration-300 hover:shadow-pink-300'>

        {/* User Avatar */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt='User Avatar'
            className={`w-40 sm:w-56 md:w-80  max-h-96 mx-auto object-cover border-4  transition-transform duration-300 hover:scale-105 ${
              user.gender === 'female'
                ? 'border-pink-400 shadow-pink-300'
                : 'border-blue-400 shadow-blue-300'
            } shadow-lg`}
          />
        ) : (
          <div className='w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-3xl'>
            ?
          </div>
        )}

        {/* User Info */}
        <h2 className='mt-5 text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide'>
          {user?.fullname || 'Anonymous User'}
        </h2>
        <p className='text-sm sm:text-base text-gray-500 italic'>
          {user?.email || 'No email'}
        </p>

        {/* Followers & Following */}
        <div className='flex items-center justify-center mt-4 gap-6 text-sm sm:text-base text-gray-600 font-medium'>
          <p><span className='text-gray-400'>Followers:</span> {user?.followers?.length || 0}</p>
          <p><span className='text-gray-400'>Following:</span> {user?.following?.length || 0}</p>
        </div>

        {/* Edit Link */}
        <Link
          to='/update'
          className='mt-4 inline-block text-blue-600 hover:underline font-medium transition-colors'
        >
          ✏️ Edit Profile
        </Link>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className='mt-4 ml-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition duration-300'
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;




