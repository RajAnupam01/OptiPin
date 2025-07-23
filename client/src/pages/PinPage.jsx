import { useEffect, useState } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom';
import { PinData } from '../contexts/PinContext';
import { Loading } from '../components/Loading';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { UserData } from '../contexts/UserContext';
import toast, { Toaster } from "react-hot-toast"

function PinPage() {
  const params = useParams();
  const navigate = useNavigate();

  const { user, toggleFollowUser, } = UserData();
  const {
    pin,
    loading,
    fetchSinglePin,
    updatePin,
    addComment,
    deleteComment,
    deleteEntirePin,
    getCommentForPin,
    toggleLikePin,
  } = PinData();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function loadPinAndComments() {
      await fetchSinglePin(params.id);
      const loadedComments = await getCommentForPin(params.id);
      setComments(loadedComments);
    }
    loadPinAndComments();
  }, [params.id]);

  const editPinHandler = () => {
    setTitle(pin.title);
    setDescription(pin.description);
    setEdit(true);
  };

  const updateHandler = () => {
    updatePin(pin._id, title, description, setEdit);
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    await addComment(pin._id, comment, setComment);
    const updatedComments = await getCommentForPin(pin._id);
    setComments(updatedComments);
  };

  const deleteCommentHandler = async (commentId) => {
    await deleteComment(commentId);
    const updatedComments = await getCommentForPin(pin._id);
    setComments(updatedComments);
  };

  const deletePinHandler = () => {
    deleteEntirePin(pin._id, navigate);
  };

  const savedPin = () =>{
    toast.success("This feature is coming soon..")
  }

  if (loading) return <Loading />;
  if (!pin) return <div className="p-6">Pin not found.</div>;

  return (
    <div className='flex flex-col items-center bg-gray-100 p-4 min-h-screen'>
      <div className='bg-white rounded-lg shadow-lg flex flex-wrap w-full max-w-4xl'>

        {/* Image */}
        <div className='w-full md:w-1/2 flex items-center justify-center'>
          {pin.image && (
            <img
              src={pin.image}
              alt='pin'
              className='object-cover w-full max-h-[500px] rounded-t-lg md:rounded-l-lg md:rounded-t-none'
            />
          )}
        </div>

        {/* Content */}
        <div className='w-full md:w-1/2 p-6 flex flex-col'>

          {/* Title and Edit/Delete Buttons */}
          <div className='flex items-center justify-between mb-4'>
            {edit ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='common-input'
                placeholder='Enter Title'
              />
            ) : (
              <h1 className='text-2xl font-bold'>{pin.title}</h1>
            )}
            {pin.owner && user && pin.owner._id === user._id && (
              <div className="flex gap-2">
                <button onClick={editPinHandler}><FaEdit /></button>
                <button onClick={deletePinHandler} className='bg-red-500 text-white py-1 px-3 rounded'>
                  <MdDelete />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {edit ? (
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='common-input'
              placeholder='Enter Description'
            />
          ) : (
            <p className='mb-6 text-gray-700'>{pin.description}</p>
          )}

          {edit && (
            <button className='bg-red-700 text-white py-1 px-3 mt-2 mb-2' onClick={updateHandler}>
              Update
            </button>
          )}

          {/* Owner Info + Follow */}
          {pin.owner && (
            <div className='flex items-center justify-between border-b pb-4 mb-4'>
              <div className='flex items-center'>
                <Link to={`/owner/${pin.owner._id}`}>
                  <img
                    src={pin.owner.avatar}
                    alt="owner avatar"
                    className='rounded-full h-12 w-12 object-cover hover:scale-105 transition-transform duration-200'
                  />
                </Link>
                <div className='ml-4'>
                  <h2 className='text-lg font-semibold'>{pin.owner.fullname}</h2>
                  <p className='text-gray-500'>{pin.owner.followers?.length || 0} Followers</p>
                </div>
              </div>
              {user && user._id !== pin.owner._id && (
                <button
                  onClick={async () => {
                    await toggleFollowUser(pin.owner._id);
                    fetchSinglePin(params.id);
                  }}
                  className='bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600'
                >
                  {user.following?.includes(pin.owner._id) ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          )}

          {/* Like Button */}
          {user && (
            <div className='flex  justify-between mt-4 mb-4'>
              <button
              onClick={() => toggleLikePin(pin._id)}
              className=' self-start px-4 py-2 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200'
            >
              {pin.likes.includes(user._id) ? "❤️" : "🖤"} ({pin.likes.length})
            </button>
            <button  onClick={savedPin} className='px-4 rounded-lg  bg-pink-100 text-pink-700 hover:bg-pink-200' >
              Click to Save Pin
            </button>
            </div>
          )}

          {/* Add Comment */}
          <div className='flex items-center mt-4'>
            <div className='flex flex-col items-center w-14'>
              <Link to="/account">
              <img
                src={user?.avatar}
                alt="user avatar"
                className='rounded-full h-10 w-10 object-cover'
              />
              </Link>
              <p className='text-xs text-gray-600 mt-1'>{user.fullname?.split(" ")[0]}</p>
            </div>
            <form onSubmit={submitCommentHandler} className='flex-1 flex ml-4'>
              <input
                type='text'
                placeholder='Enter Comment'
                className='border rounded-lg p-2 w-full'
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type='submit' className='ml-2 bg-red-500 px-4 py-2 rounded-md text-white'>
                Add+
              </button>
            </form>
          </div>

          {/* Show Comments */}
          <div className='overflow-y-auto h-64 mt-4 pr-2'>
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c._id} className='flex items-start gap-3 mb-4'>
                  <div className="flex flex-col items-center w-14">
                    <img
                      src={c.user.avatar}
                      alt='commenter'
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <span className="text-xs text-gray-600 mt-1 text-center">
                      {c.user.fullname?.split(" ")[0]}
                    </span>
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>{c.user.username}</p>
                      {user && user._id === c.user._id && (
                        <button onClick={() => deleteCommentHandler(c._id)}>
                          <MdDelete className='text-red-500 hover:text-red-700' />
                        </button>
                      )}
                    </div>
                    <p className='text-sm text-gray-700'>{c.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>Be the first one to add a comment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PinPage;





