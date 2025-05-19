import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Videojuego } from '../types/index';

const API_URL = 'http://localhost:1337';

const fetchVideojuegoPorSlug = async (slug: string): Promise<Videojuego | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/videojuegos`, {
      params: {
        populate: '*',
        filters: { slug: slug },
      },
    });

    if (res.data.data.length === 0) return null;

    const v = res.data.data[0];

    const videojuego: Videojuego = {
      id: v.id,
      nombre: v.nombre,
      slug: v.slug,
      precio: v.precio,
      peso_gb: v.peso_gb,
      fecha_salida: v.fecha_salida,
      sinopsis: v.sinopsis,
      cover: v.cover ? { url: API_URL + v.cover.url } : null,
      plataformas: v.plataformas.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        slug: p.slug,
        fecha_lanzamiento: p.fecha_lanzamiento,
      })),
    };

    return videojuego;
  } catch (error) {
    console.error('Error al obtener videojuego:', error);
    return null;
  }
};

const DetalleVideojuego: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [videojuego, setVideojuego] = useState<Videojuego | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No se proporcionó slug');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchVideojuegoPorSlug(slug)
      .then((vj) => {
        if (!vj) {
          setError('Videojuego no encontrado');
        } else {
          setVideojuego(vj);
        }
      })
      .catch(() => {
        setError('Error al cargar videojuego');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center py-10 text-white">Cargando...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!videojuego) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed py-10 px-4"
      style={{ backgroundImage: "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')" }}
    >
      <div className="max-w-4xl mx-auto bg-black bg-opacity-30 text-white shadow-2xl rounded-xl overflow-hidden p-6 backdrop-blur">
        <h1 className="text-3xl font-bold mb-6">{videojuego.nombre}</h1>

        {videojuego.cover && (
          <div className="mb-6 flex justify-center">
            <img
              src={videojuego.cover.url}
              alt={videojuego.nombre}
              className="rounded-lg shadow-lg max-h-96 object-contain"
            />
          </div>
        )}

        <div className="space-y-2 mb-6">
          <p><span className="font-semibold">💵 Precio:</span> ${videojuego.precio}</p>
          <p><span className="font-semibold">💾 Peso:</span> {videojuego.peso_gb} GB</p>
          <p><span className="font-semibold">📅 Fecha de salida:</span> {new Date(videojuego.fecha_salida).toLocaleDateString()}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">🎮 Sinopsis</h2>
          <div className="space-y-2">
            {videojuego.sinopsis.map((block, i) => (
              <p key={i}>
                {block.children.map((child, j) => (
                  <span key={j}>{child.text}</span>
                ))}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">🕹️ Plataformas</h2>
          <ul className="list-disc list-inside space-y-1">
            {videojuego.plataformas.map((plataforma) => (
              <li key={plataforma.id}>
                {plataforma.nombre} {/* — Lanzamiento: {new Date(plataforma.fecha_lanzamiento).toLocaleDateString()}  */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetalleVideojuego;
