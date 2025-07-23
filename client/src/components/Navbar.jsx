import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PinData } from '../contexts/PinContext';
import { FiSearch } from 'react-icons/fi';
import { UserData } from '../contexts/UserContext';
import logo from "../assets/logo.jpg";

function Navbar({ user }) {
    const [searchTerm, setSearchTerm] = useState("");
    const { searchCategory } = PinData();
    const { isAuth } = UserData();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchCategory(searchTerm.trim());
        }
    };

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-9 w-9 rounded-full shadow"
                    />
                    <span className="hidden sm:block text-red-600 text-xl md:text-2xl font-extrabold italic tracking-tight ">OptiPin</span>
                </Link>

                {/* Search bar */}
                {isAuth && (
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 shadow-inner w-full max-w-sm mx-4"
                    >
                        <FiSearch className="text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="Search category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent flex-grow px-2 py-1 outline-none text-sm text-gray-700"
                        />
                        <button
                            type="submit"
                            className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-red-600 transition-all"
                        >
                            Search
                        </button>
                    </form>
                )}

                {/* Links and Avatar */}
                <div className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base">
                    <Link to="/" className="text-gray-700 hover:text-black font-medium transition">Home</Link>
                    <Link to="/create" className="text-gray-700 hover:text-black font-medium transition">Create</Link>
                    <Link to="/saved" className="text-gray-700 hover:text-black font-medium transition">Saved</Link>

                    <Link to="/account" className="flex-shrink-0">
                        <img
                            src={
                                user?.avatar ||
                                "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                            }
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 hover:ring-2 hover:ring-red-400 transition"
                        />
                    </Link>
                </div>
            </nav>

            {/* Mobile search bar */}
            {isAuth && (
                <div className="block md:hidden px-4 pb-2">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 shadow-inner"
                    >
                        <FiSearch className="text-gray-500 text-lg" />
                        <input
                            type="text"
                            placeholder="Search category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent flex-grow px-2 py-1 outline-none text-sm text-gray-700"
                        />
                        <button
                            type="submit"
                            className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-red-600 transition"
                        >
                            Search
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
}

export default Navbar;


