class Producto{
    constructor(id, name, categoria, tipoDeProducto, precio, descripcion){
        this.id = id;
        this.name = name;
        this.categoria = categoria;
        this.tipoDeProducto = tipoDeProducto;
        this.precio = precio;
        this.descripcion = descripcion;
    }
} 


        class ProductoRopa extends Producto (){
            constructor(id, name, categoria, tipoDeProducto, precio, descripcion, color, talle) {
            super(id, name, categoria, tipoDeProducto, precio, descripcion)
                this.color = color;
                this.talle = talle;
            }
        }

        

         class ProductoCelular extends Producto (){
                constructor(id, name, categoria, tipoDeProducto, precio, descripcion, color, almacenamiento, RAM) {
                    super(id, name, categoria, tipoDeProducto, precio, descripcion )
                    this.color = color;
                    this.almacenamiento = almacenamiento;
                    this.RAM = RAM;
            }
        }



module.exports = Producto;