export interface Imagen {
  url: string;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Blog {
  id: number;
  nombre: string;
  descripcion: any;
  imagen: Imagen; // ✅ ya no es array
  categoria: Categoria;
}


// types.ts
export type Plataforma = {
  id: number;
  nombre: string;
  slug: string;
  fecha_lanzamiento: string;
};

export type Videojuego = {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  peso_gb: number;
  fecha_salida: string;
  sinopsis: { type: string; children: { type: string; text: string }[] }[];
  cover: {
    url: string;
  } | null;
  plataformas: Plataforma[];
};