import { useEffect, useState } from "react";
import axios from "axios";
import { Blog as BlogType, Categoria } from "../types";

const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState<number | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );

  useEffect(() => {
    axios.get(`${API_URL}/categorias`).then((res) => {
      setCategorias(
        res.data.data.map((cat: any) => ({
          id: cat.id,
          nombre: cat.nombre,
        }))
      );
    });
  }, []);

  useEffect(() => {
    const query = filtro
      ? `?filters[categoria][id][$eq]=${filtro}&populate=*`
      : "?populate=*";
    axios.get(`${API_URL}/blogs${query}`).then((res) => {
      setBlogs(res.data.data);
    });
  }, [filtro]);

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover backdrop-blur-sm py-10 px-4"
      style={{
        backgroundImage:
          "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')",
      }}
    >
      <div className="max-w-7xl mx-auto mt-20">
        <div className="mb-6">
          <select
            className="w-full md:w-64 border border-gray-300 bg-white bg-opacity-80 p-3 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFiltro(Number(e.target.value))}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white/50 bg-opacity-90 backdrop-blur shadow-lg rounded-xl overflow-hidden transition transform hover:-translate-y-1 hover:shadow-2xl"
            >
              {blog.imagen?.formats?.medium?.url && (
                <img
                  src={`${BASE_URL}${blog.imagen.formats.medium.url}`}
                  alt={blog.nombre}
                  className="w-full object-cover cursor-pointer"
                  onClick={() =>
                    setImagenSeleccionada(`${BASE_URL}${blog.imagen.url}`)
                  }
                />
              )}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {blog.nombre}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {blog.categoria?.nombre}
                </p>
                <p className="text-gray-700 text-sm">
                  {blog.descripcion?.[0]?.children?.[0]?.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] p-4 bg-white rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
              onClick={() => setImagenSeleccionada(null)}
            >
              Cerrar
            </button>
            <img
              src={imagenSeleccionada}
              alt="Vista ampliada"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
