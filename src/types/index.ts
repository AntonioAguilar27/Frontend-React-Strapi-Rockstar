export interface Categoria {
    id: number;
    nombre: string;
  }
  
  export interface Imagen {
    url: string;
    formats: {
      medium?: { url: string };
    };
  }
  
  export interface Blog {
    id: number;
    nombre: string;
    descripcion: any;
    imagen: Imagen[];
    categoria: Categoria;
  }
  