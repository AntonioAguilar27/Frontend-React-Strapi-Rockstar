import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <span className="font-bold text-xl">Mi Sitio</span>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/blogs" className="hover:underline">Blogs</Link>
        </div>
      </div>
    </nav>
  );
}
