import { Videojuego } from "../types/gametype";
import axios from "axios";
// services/api.ts

const API_URL = 'http://localhost:1337/api';

export async function fetchVideojuegos(): Promise<Videojuego[]> {
  const res = await fetch(`${API_URL}/videojuegos?populate=cover,plataformas`);
  const data = await res.json();
  return data.data.map((item: any) => ({
    id: item.id,
    ...item.attributes,
    cover: item.attributes.cover.data?.attributes || {},
    plataformas: item.attributes.plataformas.data.map((p: any) => ({
      id: p.id,
      ...p.attributes,
    })),
  }));
}

export const fetchVideojuegoBySlug = async (slug: string): Promise<Videojuego | null> => {
  const res = await axios.get(
    `http://localhost:1337/api/videojuegos?filters[slug][$eq]=${slug}&populate=*`
  );
  const item = res.data.data[0];
  if (!item) return null;
  return {
    id: item.id,
    ...item.attributes,
    cover: item.attributes.cover,
    plataformas: item.attributes.plataformas,
  };
};
