import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-gray-100 to-white border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-gray-700">

        {/* Brand Section */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">OptiPin</h2>
          <p className="mt-3 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            Discover and save the best ideas. Your visual inspiration platform.
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center md:text-left">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-500 transition">Home</a></li>
            <li><a href="/create" className="hover:text-red-500 transition">Create</a></li>
            <li><a href="/saved" className="hover:text-red-500 transition">Saved</a></li>
            <li><a href="/account" className="hover:text-red-500 transition">Account</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="text-center md:text-left">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-red-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-red-500 transition">License</a></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="text-center md:text-left">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Connect</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:someone@example.com" className="inline-flex items-center gap-2 hover:text-red-500 transition justify-center md:justify-start">
                <HiOutlineMail className="w-5 h-5" /> Email
              </a>
            </li>
            <li>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-red-500 transition justify-center md:justify-start">
                <FaGithub className="w-5 h-5" /> GitHub
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-red-500 transition justify-center md:justify-start">
                <FaLinkedin className="w-5 h-5" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center py-5 text-xs text-gray-500 border-t border-gray-200">
        &copy; {new Date().getFullYear()} <span className="font-semibold">OptiPin</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;


