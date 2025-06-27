import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Plataforma, Videojuego } from "../types/index";
import { Link } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const DetallePlataforma: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [plataforma, setPlataforma] = useState<Plataforma | null>(null);
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlataformaYJuegos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/plataformas`, {
          params: {
            filters: { slug },
            populate: {
              videojuegos: {
                populate: ["cover", "imagenes", "plataformas"],
              },
            },
          },
        });

        if (!res.data.data.length) {
          setError("Plataforma no encontrada");
          setLoading(false);
          return;
        }

        const plat = res.data.data[0];
        setPlataforma({
          id: plat.id,
          nombre: plat.nombre,
          slug: plat.slug,
          fecha_lanzamiento: plat.fecha_lanzamiento,
          imagen: plat.imagen ? { url: BASE_URL + plat.imagen.url } : null,
        });

        const juegos: Videojuego[] = (plat.videojuegos || []).map((v: any) => ({
          id: v.id,
          nombre: v.nombre,
          slug: v.slug,
          precio: v.precio,
          peso_gb: v.peso_gb,
          fecha_salida: v.fecha_salida,
          sinopsis: v.sinopsis,
          cover: v.cover ? { url: BASE_URL + v.cover.url } : null,
          imagenes:
            v.imagenes?.map((img: any) => ({ url: BASE_URL + img.url })) || [],
          plataformas:
            v.plataformas?.map((p: any) => ({
              id: p.id,
              nombre: p.nombre,
              slug: p.slug,
              fecha_lanzamiento: p.fecha_lanzamiento,
            })) || [],
        }));

        setVideojuegos(juegos);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la plataforma");
        setLoading(false);
      }
    };

    if (slug) fetchPlataformaYJuegos();
  }, [slug]);

  if (loading)
    return <div className="text-center py-10 text-white">Cargando...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6"
      style={{
        backgroundImage:
          "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')",
      }}
    >
      <div className="max-w-5xl mx-auto mt-20">
        <h1 className="text-xl md:text-3xl font-bold mb-6">
          JUEGOS DISPONIBLES EN {plataforma?.nombre}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {videojuegos.length === 0 ? (
            <p>No hay videojuegos para esta plataforma.</p>
          ) : (
            videojuegos.map((juego) => (
              <div
                key={juego.id}
                className="bg-black bg-opacity-40 rounded-lg shadow-xl p-4"
              >
                {juego.cover && (
                  <img
                    src={juego.cover.url}
                    alt={juego.nombre}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold">{juego.nombre}</h2>
                <p className="text-sm text-gray-300">
                  Precio: ${juego.precio} • Peso: {juego.peso_gb} GB
                </p>
                <p className="text-sm text-gray-400">
                  Fecha:{" "}
                  {new Date(juego.fecha_salida).toLocaleDateString("es-MX")}
                </p>
                <Link to={`/videojuego/${juego.slug}`}>
                  <button className="mt-3 self-end px-4 py-2 bg-[#673E5F] text-white font-bold rounded hover:bg-[#844a7d] transition">
                    Ver detalle
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallePlataforma;
