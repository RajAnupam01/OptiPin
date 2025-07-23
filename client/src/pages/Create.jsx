import { useState, useRef } from 'react'
import {  useNavigate } from "react-router-dom"
import { LoadingAnimation } from '../components/Loading';
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { PinData } from '../contexts/PinContext';

function Create() {

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("")
  const [category,setCategory] = useState("")
  const [image,setImage] = useState(null)
  const [imagePreview,setImagePreview] = useState(null)

  const fileInputRef = useRef(null)

  const {createPin,btnLoading} = PinData()

  const navigate = useNavigate()

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleRemoveImage = (e) => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

   const submitHandler = (e) => {
    e.preventDefault();
    createPin(title, description, image, category, navigate)
  }

  return (
<div className='min-h-screen flex items-center justify-center bg-gray-400 px-4'>
  <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl'>
    <form onSubmit={submitHandler}>
      <div className='flex flex-col md:flex-row gap-8'>

        {/* Left: Image Upload */}
        <div
          onClick={() => fileInputRef.current.click()}
          className='md:w-1/2 h-56 md:h-auto border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden relative'
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="preview"
                className='w-full h-full object-cover hover:ring-2 hover:ring-red-400 transition'
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
            required
          />
        </div>

        {/* Right: Form Inputs */}
        <div className='md:w-1/2 space-y-4'>

          <div>
            <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Title</label>
            <input
              type="text"
              id='title'
              className='common-input w-full'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              id='description'
              className='common-input w-full resize-none h-20'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className='block text-sm font-medium text-gray-700'>Category</label>
            <input
              type="text"
              id='category'
              className='common-input w-full'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <button type='submit' className='common-btn w-full' disabled={btnLoading}>
            {btnLoading ? <LoadingAnimation /> : "Add a Pin"}
          </button>
        </div>

      </div>
    </form>
  </div>
</div>

  )
}

export default Create