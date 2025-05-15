export interface Plataforma {
    id: number;
    nombre: string;
    slug: string;
    fecha_lanzamiento: string;
  }
  
  export interface Cover {
    url: string;
  }
  
  export interface Videojuego {
    id: number;
    nombre: string;
    slug: string;
    precio: number;
    fecha_salida: string;
    peso_gb: number;
    sinopsis: any; // Puedes usar 'any' si vas a renderizar raw HTML o Slate
    cover: Cover;
    plataformas: Plataforma[];
  }
  