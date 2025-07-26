import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { UserData } from '../contexts/UserContext';

function Owner() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { fetchOwner, owner } = UserData();

  useEffect(() => {
    const loadOwner = async () => {
      setLoading(true);
      await fetchOwner(id);
      setLoading(false);
    };

    loadOwner();
  }, [id]);

  if (loading) return <Loading />;

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='sm:min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 flex items-center justify-center px-4 py-10'>
      <div className='bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl flex flex-col md:flex-row gap-8'>

        {/* Left Panel: Avatar & Info */}
        <div className='flex-1 flex flex-col items-center justify-between text-center border-r border-gray-200 pr-4'>
          <div>
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt='User Avatar'
                className={`w-40 sm:w-56 mx-auto object-cover border-4 rounded-full transition-transform duration-300 hover:scale-105 ${
                  owner.gender === 'female'
                    ? 'border-pink-400 shadow-pink-300'
                    : 'border-blue-400 shadow-blue-300'
                } shadow-lg`}
              />
            ) : (
              <div className='w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center mx-auto rounded-full bg-gray-200 text-gray-500 text-4xl font-bold'>
                {getInitials(owner?.fullname || 'User')}
              </div>
            )}

            <h2 className='mt-4 text-2xl sm:text-3xl font-bold text-gray-800'>
              {owner?.fullname || 'Anonymous User'}
            </h2>
            <p className='text-sm sm:text-base text-gray-500 italic'>
              {owner?.email || 'No email'}
            </p>
          </div>

          <div className='mt-6 text-sm sm:text-base text-gray-700 space-y-1 font-medium'>
            <p><span className='text-gray-500'>Gender:</span> {owner?.gender || 'N/A'}</p>
          </div>
        </div>

        {/* Right Panel: Followers & Following */}
        <div className='flex-1 flex flex-col gap-4 text-gray-700 font-medium text-base sm:text-lg'>
          
          {/* Followers */}
          <div className='flex-1 flex flex-col border-b border-gray-200 overflow-hidden rounded-xl'>
            <h3 className='text-center font-semibold text-lg sm:text-xl py-3 bg-gray-100 text-gray-800 sticky top-0 z-10'>
              Followers ({owner?.followers?.length || 0})
            </h3>
            <div className='overflow-y-auto px-3 py-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300'>
              {owner?.followers?.length > 0 ? (
                owner.followers.map((follower) => (
                  <Link
                    key={follower._id}
                    to={`/owner/${follower._id}`}
                    className='flex items-center gap-3 bg-gray-50 hover:bg-pink-50 px-3 py-2 rounded-xl transition'
                  >
                    <img
                      src={follower.avatar}
                      alt={follower.fullname}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <span className='text-sm font-medium text-gray-700'>{follower.fullname}</span>
                  </Link>
                ))
              ) : (
                <p className='text-sm text-center text-gray-400'>No followers yet.</p>
              )}
            </div>
          </div>

          {/* Following */}
          <div className='flex-1 flex flex-col overflow-hidden rounded-xl'>
            <h3 className='text-center font-semibold text-lg sm:text-xl py-3 bg-gray-100 text-gray-800 sticky top-0 z-10'>
              Following ({owner?.following?.length || 0})
            </h3>
            <div className='overflow-y-auto px-3 py-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300'>
              {owner?.following?.length > 0 ? (
                owner.following.map((followee) => (
                  <Link
                    key={followee._id}
                    to={`/owner/${followee._id}`}
                    className='flex items-center gap-3 bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-xl transition'
                  >
                    <img
                      src={followee.avatar}
                      alt={followee.fullname}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <span className='text-sm font-medium text-gray-700'>{followee.fullname}</span>
                  </Link>
                ))
              ) : (
                <p className='text-sm text-center text-gray-400'>Not following anyone yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Owner;







