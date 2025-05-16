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
        filters: {
          slug: slug,
        },
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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!videojuego) return null;

  return (
    <div>
      <h1>{videojuego.nombre}</h1>
      {videojuego.cover && (
        <img
          src={videojuego.cover.url}
          alt={videojuego.nombre}
          style={{ maxWidth: '300px' }}
        />
      )}
      <p>Precio: ${videojuego.precio}</p>
      <p>Peso: {videojuego.peso_gb} GB</p>
      <p>Fecha de salida: {new Date(videojuego.fecha_salida).toLocaleDateString()}</p>

      <h2>Sinopsis</h2>
      {videojuego.sinopsis.map((block, i) => (
        <p key={i}>
          {block.children.map((child, j) => (
            <span key={j}>{child.text}</span>
          ))}
        </p>
      ))}

      <h2>Plataformas</h2>
      <ul>
        {videojuego.plataformas.map((plataforma) => (
          <li key={plataforma.id}>
            {plataforma.nombre} (Lanzamiento: {new Date(plataforma.fecha_lanzamiento).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetalleVideojuego;
