import { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import type { Plataforma, Videojuego } from '../types';


const API_URL = 'http://localhost:1337/api';

export default function Videojuegos() {
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [filtroPlataforma, setFiltroPlataforma] = useState<number | null>(null);

  // Estado para modal
  const [videojuegoSeleccionado, setVideojuegoSeleccionado] = useState<Videojuego | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

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

  // Funciones para abrir/cerrar modal
  const abrirModal = (game: Videojuego) => {
    setVideojuegoSeleccionado(game);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVideojuegoSeleccionado(null);
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover backdrop-blur-sm py-10 px-4"
      style={{ backgroundImage: "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <select
            className="w-full md:w-64 border border-black text-white bg-black bg-opacity-20 p-3  backdrop-blur rounded shadow focus:outline-none focus:ring-2 focus:ring-[#673e5f]"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videojuegos.map((game) => (
            <div
              key={game.id}
              className="bg-black/30 backdrop-blur shadow-lg rounded-xl overflow-hidden transition transform hover:-translate-y-1 hover:shadow-2xl"
            >
              {game.cover?.url ? (
                <img
                  src={`http://localhost:1337${game.cover.url}`}
                  alt={game.nombre}
                  className="w-full h-48 object-contain mt-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  Sin imagen
                </div>
              )}

              <div className="p-5 flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-100">{game.nombre}</h3>
                <p className="text-sm text-gray-100">
                  Precio: ${game.precio.toFixed(2)} USD • Peso: {game.peso_gb} GB
                </p>
                <p className="text-sm text-gray-100">Fecha salida: {game.fecha_salida}</p>
                <p className="text-sm text-gray-100">
                  Plataformas: {game.plataformas.map(p => p.nombre).join(', ')}
                </p>
                <button
                  onClick={() => abrirModal(game)}
                  className="mt-3 self-end px-4 py-2 bg-[#673E5F] text-white font-bold rounded hover:bg-[#844a7d] transition"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && videojuegoSeleccionado && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cerrarModal} // cerrar al hacer click fuera del modal
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()} // evitar cierre al click dentro del modal
          >
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-2xl font-bold"
              onClick={cerrarModal}
              aria-label="Cerrar modal"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">{videojuegoSeleccionado.nombre}</h2>

            {videojuegoSeleccionado.cover?.url && (
              <img
                src={`http://localhost:1337${videojuegoSeleccionado.cover.url}`}
                alt={videojuegoSeleccionado.nombre}
                className="w-full h-64 object-contain mb-4"
              />
            )}

            <p className="mb-2"><strong>Precio:</strong> ${videojuegoSeleccionado.precio.toFixed(2)} USD</p>
            <p className="mb-2"><strong>Peso:</strong> {videojuegoSeleccionado.peso_gb} GB</p>
            <p className="mb-2"><strong>Fecha de salida:</strong> {videojuegoSeleccionado.fecha_salida}</p>
            <p className="mb-2"><strong>Plataformas:</strong> {videojuegoSeleccionado.plataformas.map(p => p.nombre).join(', ')}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Sinopsis:</h3>
              {videojuegoSeleccionado.sinopsis.map((block, i) => (
                <p key={i} className="text-gray-700">
                  {block.children.map((child, j) => child.text).join(' ')}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
