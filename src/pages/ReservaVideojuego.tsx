import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:1337";

const ReservaVideojuego: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [videojuegoId, setVideojuegoId] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  // Obtener el id del videojuego a partir del slug
  useEffect(() => {
    if (!slug) return;

    const fetchVideojuegoId = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/videojuegos`, {
          params: {
            filters: { slug },
            fields: ["id"],
          },
        });

        if (res.data.data.length > 0) {
          setVideojuegoId(res.data.data[0].id);
          setMensaje("");
        } else {
          setMensaje("Videojuego no encontrado.");
        }
      } catch (error) {
        setMensaje("Error al obtener videojuego.");
      }
    };

    fetchVideojuegoId();
  }, [slug]);

  // Verificar disponibilidad cuando el usuario pulse el botón
  const verificarDisponibilidad = async () => {
    setMensaje("");
    setDisponible(null);

    if (!videojuegoId || !fechaInicio || !fechaFin) {
      setMensaje("Selecciona ambas fechas primero");
      return;
    }

    if (fechaFin < fechaInicio) {
      setMensaje("La fecha fin no puede ser menor que la fecha inicio");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/reservas`, {
        params: {
          filters: {
            videojuego: { id: { $eq: videojuegoId } },
            $or: [
              {
                fecha_inicio: { $lte: fechaFin },
                fecha_fin: { $gte: fechaInicio },
              },
            ],
          },
        },
      });

      const disponible = res.data.data.length === 0;
      setDisponible(disponible);

      if (disponible) {
        setModalAbierto(true);
      } else {
        setMensaje("No está disponible en ese rango de fechas.");
      }
    } catch (error) {
      setMensaje("Error al verificar disponibilidad.");
    }
  };

  // Enviar formulario de reserva
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!videojuegoId) {
      setMensaje("Videojuego inválido.");
      return;
    }

    if (!nombre || !email || !telefono) {
      setMensaje("Completa todos los campos.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/reservas`, {
        data: {
          videojuego: videojuegoId,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          nombre_cliente: nombre,
          email_cliente: email,
          telefono,
        },
      });

      setMensaje("Reserva creada con éxito.");
      setModalAbierto(false);
      // Limpiar formulario
      setFechaInicio("");
      setFechaFin("");
      setNombre("");
      setEmail("");
      setTelefono("");
      setDisponible(null);
    } catch (error) {
      setMensaje("Error al crear la reserva, intenta de nuevo.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed py-10 px-4"
      style={{
        backgroundImage:
          "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')",
      }}
    >
      <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reserva videojuego
        </h2>

        {mensaje && (
          <p className="mb-4 text-center text-red-400 font-semibold">
            {mensaje}
          </p>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold" htmlFor="fechaInicio">
            Fecha inicio:
          </label>
          <input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full rounded border border-gray-600 p-2 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold" htmlFor="fechaFin">
            Fecha fin:
          </label>
          <input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full rounded border border-gray-600 p-2 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={verificarDisponibilidad}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-semibold mb-6"
        >
          Verificar disponibilidad
        </button>

        {modalAbierto && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={() => setModalAbierto(false)}
            >
              <div
                className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4 text-center">
                  Completa tus datos
                </h3>

                <form onSubmit={handleSubmit}>
                  <label className="block mb-1 font-semibold" htmlFor="nombre">
                    Nombre:
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full rounded border border-gray-600 p-2 mb-4 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-1 font-semibold" htmlFor="email">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded border border-gray-600 p-2 mb-4 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label
                    className="block mb-1 font-semibold"
                    htmlFor="telefono"
                  >
                    Teléfono:
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    maxLength={10}
                    minLength={10}
                    required
                    className="w-full rounded border border-gray-600 p-2 mb-6 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
                    >
                      Confirmar reserva
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalAbierto(false)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservaVideojuego;
