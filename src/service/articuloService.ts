import {db} from '../config/database';


export async function getAllArticulosService(){
    try {
        const articulosRaw = await db.articulos.findMany({
            include: {
                articulos_caracteristicas: {
                    include: {
                        caracteristicas: true
                    }
                }
            }
        });

        // Transformar los datos para que coincidan con tus modelos
        const articulos = articulosRaw.map(articulo => {
            return {
                id: articulo.id,
                nombre: articulo.nombre,
                precio: articulo.precio,
                stock: articulo.stock,
                dimensiones: articulo.dimensiones,
                foto: articulo.foto,
                descripcion: articulo.descripcion,
                caracteristicas: articulo.articulos_caracteristicas.map(ac => ac.caracteristicas),
            };
        });

        return articulos;
    } catch (error) {
        console.error('Error al obtener los articulos:', error);
        throw error;
    }
}

