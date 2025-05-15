import { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';

type Plataforma = {
  id: number;
  nombre: string;
  slug: string;
  fecha_lanzamiento: string;
};

type Videojuego = {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  peso_gb: number;
  fecha_salida: string;
  sinopsis: { type: string; children: { type: string; text: string }[] }[];
  cover: {
    url: string;
  } | null;
  plataformas: Plataforma[];
};

const API_URL = 'http://localhost:1337/api';

export default function Videojuegos() {
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [filtroPlataforma, setFiltroPlataforma] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/plataformas`).then(res => {
      const data = res.data.data;
      setPlataformas(data);
    });
  }, []);

  useEffect(() => {
    const query = qs.stringify(
      {
        populate: {
          cover: true,
          plataformas: true,
        },
        filters: filtroPlataforma
          ? {
              plataformas: {
                id: {
                  $eq: filtroPlataforma,
                },
              },
            }
          : undefined,
      },
      { encodeValuesOnly: true }
    );

    axios
      .get(`${API_URL}/videojuegos?${query}`)
      .then(res => setVideojuegos(res.data.data))
      .catch(err =>
        console.error('Error al obtener videojuegos:', err.response?.data || err.message)
      );
  }, [filtroPlataforma]);

  return (
    <div
    className="min-h-screen py-10 px-4 bg-cover bg-center"
    style={{
      backgroundImage:
        'url("http://localhost:1337/uploads/background_image_325d67b3eb.png")',
    }}
  >
    <div className="max-w-7xl mx-auto">
      <div className="p-6">
        {/* Select de plataformas */}
        <div className="mb-6">
          <select
            className="w-full md:w-64 border border-gray-300 bg-white p-3 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setFiltroPlataforma(e.target.value ? Number(e.target.value) : null)
            }
            value={filtroPlataforma ?? ''}
          >
            <option value="">Todas las plataformas</option>
            {plataformas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de videojuegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videojuegos.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {game.cover?.url ? (
                <img
                  src={`http://localhost:1337${game.cover.url}`}
                  alt={game.nombre}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  Sin imagen
                </div>
              )}

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{game.nombre}</h3>
                <p className="text-sm text-gray-600">
                  Precio: ${game.precio.toFixed(2)} USD • Peso: {game.peso_gb} GB
                </p>
                <p className="text-sm text-gray-600">Fecha salida: {game.fecha_salida}</p>
                <div className="text-sm text-gray-700">
                  Plataformas: {game.plataformas.map(p => p.nombre).join(', ')}
                </div>
                <button className="mt-3 self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
