// src/services/videojuegos.ts
import axios from "axios";
import { Videojuego } from "../types";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchVideojuegoPorSlug = async (
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
      precio_renta_dia: v.precio_renta_dia,
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
