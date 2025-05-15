import { useEffect, useState } from 'react';
import axios from 'axios';
import { Blog as BlogType, Categoria } from '../types';

const API_URL = 'http://localhost:1337/api';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/categorias`).then(res => {
      setCategorias(res.data.data.map((cat: any) => ({
        id: cat.id,
        nombre: cat.nombre
      })));
    });
  }, []);

  useEffect(() => {
    const query = filtro ? `?filters[categoria][id][$eq]=${filtro}&populate=*` : '?populate=*';
    axios.get(`${API_URL}/blogs${query}`).then(res => {
      setBlogs(res.data.data);
    });
  }, [filtro]);

  return (
    <div>
        <select
            className="border border-gray-300 p-2 rounded mb-4"
            onChange={(e) => setFiltro(Number(e.target.value))}
            >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
                <div key={blog.id} className="bg-white shadow rounded overflow-hidden">
                {blog.imagen?.[0]?.formats?.medium?.url && (
                    <img
                    src={`http://localhost:1337${blog.imagen[0].formats.medium.url}`}
                    alt={blog.nombre}
                    className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{blog.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">Categoría: {blog.categoria?.nombre}</p>
                    <p className="text-gray-700">{blog.descripcion?.[0]?.children?.[0]?.text}</p>
                </div>
                </div>
            ))}
        </div>
    </div>
  );
}
