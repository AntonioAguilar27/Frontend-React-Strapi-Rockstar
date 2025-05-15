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
