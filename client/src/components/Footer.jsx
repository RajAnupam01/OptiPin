function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

        {/* Brand Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">OptiPin</h2>
          <p className="mt-2 text-sm">
            Discover and save the best ideas. Your visual inspiration platform.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Navigation</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-red-500 transition">Home</a></li>
            <li><a href="/create" className="hover:text-red-500 transition">Create</a></li>
            <li><a href="/saved" className="hover:text-red-500 transition">Saved</a></li>
            <li><a href="/account" className="hover:text-red-500 transition">Account</a></li>
          </ul>
        </div>

        {/* Resources / Legal */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-red-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-red-500 transition">License</a></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Connect</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="https://mail.google.com/mail/?view=cm&to=anupam.r2301@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition"
              >
                Email
              </a>
            </li>
            <li>
              <a href="https://github.com/RajAnupam01" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/anupam-raj-101b96280" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center py-4 text-xs text-gray-500 border-t">
        &copy; {new Date().getFullYear()} OptiPin. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
