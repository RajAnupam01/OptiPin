import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 flex items-center justify-center px-4 py-8'>
      <div className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md sm:max-w-lg md:max-w-xl text-center transition-all duration-300 hover:shadow-pink-300'>

        {/* Avatar */}
        {owner?.avatar ? (
          <img
            src={owner.avatar}
            alt='User Avatar'
            className={`w-40 sm:w-56 md:w-80 mx-auto object-cover border-4 rounded-full transition-transform duration-300 hover:scale-105 ${
              owner.gender === 'female'
                ? 'border-pink-400 shadow-pink-300'
                : 'border-blue-400 shadow-blue-300'
            } shadow-lg`}
          />
        ) : (
          <div className='w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-3xl'>
            ?
          </div>
        )}

        {/* Info */}
        <h2 className='mt-5 text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide'>
          {owner?.fullname || 'Anonymous User'}
        </h2>
        <p className='text-sm sm:text-base text-gray-500 italic'>
          {owner?.email || 'No email'}
        </p>

        {/* Extra Info */}
        <div className='mt-6 text-sm sm:text-base text-gray-700 space-y-1 font-medium'>
          <p><span className="text-gray-500">Gender:</span> {owner?.gender || 'N/A'}</p>
          <p><span className="text-gray-500">Followers:</span> {owner?.followers?.length || 0}</p>
          <p><span className="text-gray-500">Following:</span> {owner?.following?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default Owner;



