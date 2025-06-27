import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Videojuego } from "../types/index";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const fetchVideojuegoPorSlug = async (
  slug: string
): Promise<Videojuego | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/api/videojuegos`, {
      params: {
        populate: "*",
        filters: { slug },
      },
    });

    if (res.data.data.length === 0) return null;

    const v = res.data.data[0];

    const videojuego: Videojuego = {
      id: v.id,
      nombre: v.nombre,
      slug: v.slug,
      precio: v.precio,
      precio_renta_dia: v.precio_renta_dia, // <-- Nuevo campo
      peso_gb: v.peso_gb,
      fecha_salida: v.fecha_salida,
      sinopsis: v.sinopsis,
      cover: v.cover ? { url: BASE_URL + v.cover.url } : null,
      imagenes:
        v.imagenes?.map((img: any) => ({
          url: BASE_URL + img.url,
        })) || [],
      plataformas: v.plataformas.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        slug: p.slug,
        fecha_lanzamiento: p.fecha_lanzamiento,
      })),
    };

    return videojuego;
  } catch (error) {
    console.error("Error al obtener videojuego:", error);
    return null;
  }
};

const DetalleVideojuego: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [videojuego, setVideojuego] = useState<Videojuego | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!slug) {
      setError("No se proporcionó slug");
      setLoading(false);
      return;
    }

    fetchVideojuegoPorSlug(slug)
      .then((vj) => {
        if (!vj) {
          setError("Videojuego no encontrado");
        } else {
          setVideojuego(vj);
        }
      })
      .catch(() => {
        setError("Error al cargar videojuego");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading)
    return <div className="text-center py-10 text-white">Cargando...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!videojuego) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed py-10 px-4"
      style={{
        backgroundImage:
          "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')",
      }}
    >
      <div className="max-w-4xl mx-auto bg-black bg-opacity-30 text-white shadow-2xl rounded-xl overflow-hidden p-6 backdrop-blur mt-20">
        <h1 className="text-3xl font-bold mb-6">{videojuego.nombre}</h1>

        {videojuego.cover && (
          <div className="mb-6 flex justify-center">
            <img
              src={videojuego.cover.url}
              alt={videojuego.nombre}
              className="rounded-lg shadow-lg max-h-96 object-contain cursor-pointer"
              onClick={() => setImagenSeleccionada(videojuego.cover!.url)}
            />
          </div>
        )}

        {videojuego.imagenes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">🖼️ Galería</h2>
            <Slider {...sliderSettings}>
              {videojuego.imagenes.map((img, i) => (
                <div key={i} className="px-2">
                  <img
                    src={img.url}
                    alt={`Imagen ${i + 1}`}
                    className="rounded-lg shadow-md object-cover w-full h-48 cursor-pointer"
                    onClick={() => setImagenSeleccionada(img.url)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}

        <div className="space-y-2 mb-6 mt-6">
          <p className="text-md text-gray-300">
            Renta por día: ${videojuego.precio_renta_dia} MXN
          </p>
          <p>
            <span className="font-semibold">💵 Precio:</span> $
            {videojuego.precio}
          </p>
          <p>
            <span className="font-semibold">💾 Peso:</span> {videojuego.peso_gb}{" "}
            GB
          </p>
          <p>
            <span className="font-semibold">📅 Fecha de salida:</span>{" "}
            {new Date(videojuego.fecha_salida).toLocaleDateString()}
          </p>
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
              <li key={plataforma.id}>{plataforma.nombre}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal de imagen en grande */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setImagenSeleccionada(null)} // cerrar al hacer clic fuera
        >
          <div
            className="relative max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()} // evita que el clic dentro del modal lo cierre
          >
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={() => setImagenSeleccionada(null)}
            >
              &times;
            </button>
            <img
              src={imagenSeleccionada}
              alt="Imagen ampliada"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
      <button
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() => {
          navigate(`/reservar/${videojuego.slug}`);
        }}
      >
        Reservar este juego
      </button>
    </div>
  );
};

export default DetalleVideojuego;
