import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide hover:text-gray-300 transition-colors">
          GTA VI
        </Link>
        <div className="flex space-x-6 text-xl font-semibold">
          <Link
            to="/"
            className="hover:text-gray-400 transition-colors duration-200"
          >
            Inicio
          </Link>
          <Link
            to="/blogs"
            className="hover:text-gray-400 transition-colors duration-200"
          >
            Blogs
          </Link>
          <Link
            to="/videojuegos"
            className="hover:text-gray-400 transition-colors duration-200"
          >
            Videojuegos
          </Link>
        </div>
      </div>
    </nav>
  );
}
