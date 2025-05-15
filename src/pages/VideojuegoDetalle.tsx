// pages/VideojuegoDetalle.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchVideojuegoBySlug } from '../services/VideojuegoServices';
import { Videojuego } from '../types/gametype';

export default function VideojuegoDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Videojuego | null>(null);

  useEffect(() => {
    if (slug) fetchVideojuegoBySlug(slug).then(setGame);
  }, [slug]);

  if (!game) return <div className="p-4">Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{game.nombre}</h1>
      <img src={`http://localhost:1337${game.cover.url}`} alt={game.nombre} className="w-full max-w-3xl mx-auto rounded mb-6" />
      <p className="mb-4 text-lg">{game.sinopsis}</p>
      <p><strong>Precio:</strong> {game.precio} USD</p>
      <p><strong>Peso:</strong> {game.peso_gb} GB</p>
      <p><strong>Fecha de salida:</strong> {game.fecha_salida}</p>
      <div className="mt-4">
        <strong>Plataformas:</strong>
        <ul className="list-disc list-inside">
          {game.plataformas.map(p => (
            <li key={p.id}>{p.nombre} ({p.fecha_lanzamiento})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
