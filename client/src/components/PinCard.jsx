import { Link } from "react-router-dom";


function PinCard({ pin }) {

   
  return (
    <div className="p-2">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative group">
        <img
          src={pin.image}
          alt="pin-img"
          className="w-full max-h-72 object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end items-start p-2">
          <Link to={`/pinpage/${pin._id}`}  className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>View Pin</Link>
        </div>

      </div>
    </div>
  );
}

export default PinCard;
