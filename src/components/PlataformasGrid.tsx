import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plataforma } from "../types";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PlataformasGrid: React.FC = () => {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlataformas = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/plataformas`, {
          params: {
            populate: "imagen",
          },
        });

        const data = res.data.data.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          slug: p.slug,
          fecha_lanzamiento: p.fecha_lanzamiento,
          imagen: p.imagen?.url ? { url: BASE_URL + p.imagen.url } : null,
        }));

        setPlataformas(data);
      } catch (err) {
        console.error("Error al cargar plataformas:", err);
        setError("No se pudieron cargar las plataformas.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlataformas();
  }, []);

  if (loading)
    return <div className="text-center py-10 text-white">Cargando...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">🕹️ Plataformas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plataformas.map((plataforma) => (
          <div
            key={plataforma.id}
            onClick={() => navigate(`/plataforma/${plataforma.slug}`)}
            className="bg-white bg-opacity-10 p-4 rounded-xl text-white shadow-lg backdrop-blur cursor-pointer hover:scale-105 transition"
          >
            {plataforma.imagen ? (
              <img
                src={plataforma.imagen.url}
                alt={plataforma.nombre}
                className="w50 h-32 object-fill mb-4 rounded mx-auto"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center text-gray-400 bg-gray-800 rounded mb-4 mx-auto">
                Sin imagen
              </div>
            )}
            <h3 className="text-xl font-semibold text-white text-center">
              {plataforma.nombre}
            </h3>
            <p className="text-sm text-gray-300 text-center">
              Lanzamiento:{" "}
              {new Date(plataforma.fecha_lanzamiento).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlataformasGrid;
