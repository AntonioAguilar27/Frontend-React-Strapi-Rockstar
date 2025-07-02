import React, { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:1337";

interface ReservaVideojuegoProps {
  videojuegoId: number | null;
  onSuccess: () => void;
}

const ReservaVideojuego: React.FC<ReservaVideojuegoProps> = ({
  videojuegoId,
  onSuccess,
}) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [mensaje, setMensaje] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

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

      const esDisponible = res.data.data.length === 0;
      setDisponible(esDisponible);

      if (!esDisponible) {
        setMensaje("No está disponible en ese rango de fechas.");
      } else {
        setMensaje(
          "El videojuego está disponible, puedes continuar con la reserva."
        );
      }
    } catch (error) {
      setMensaje("Error al verificar disponibilidad.");
    }
  };

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
          videojuego: videojuegoId.toString(),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          nombre_cliente: nombre,
          email_cliente: email,
          telefono,
        },
      });

      // Limpiar formulario
      setFechaInicio("");
      setFechaFin("");
      setNombre("");
      setEmail("");
      setTelefono("");
      setDisponible(null);

      onSuccess();
      setMensaje("");
    } catch (error) {
      setMensaje("Error al crear la reserva, intenta de nuevo.");
    }
  };

  return (
    <div className="mt-8 p-6 bg-white/60 rounded-lg shadow-md text-black max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">
        Verifica disponibilidad fecha
      </h3>

      {mensaje && (
        <p className="mb-4 text-center text-red-400 font-semibold">{mensaje}</p>
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
          className="w-full rounded border border-gray-200 p-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full rounded border border-gray-200 p-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={verificarDisponibilidad}
        className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-semibold mb-6"
        type="button"
      >
        Verificar disponibilidad
      </button>

      {disponible && (
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
            className="w-full rounded border border-gray-200 p-2 mb-4 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded border border-gray-200 p-2 mb-4 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block mb-1 font-semibold" htmlFor="telefono">
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
            className="w-full rounded border border-gray-200 p-2 mb-6 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
            >
              Confirmar reserva
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReservaVideojuego;
