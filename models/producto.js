const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { 
        type: String 
    },
    disponible: { 
        type: Boolean,
        default: true 
    }
})

//eliminar los valores del response, debe ser una funcion normal
ProductoSchema.methods.toJSON = function() {
    const { __v, estado,...datos } = this.toObject();

    return datos;
}

//hay que ingresar el nombre del modelo y su valor
module.exports = model( 'Producto', ProductoSchema)