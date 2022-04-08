const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    }
})

//eliminar los valores del response, debe ser una funcion normal
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado,...categoria } = this.toObject();

    return categoria;
}

//hay que ingresar el nombre del modelo y su valor
module.exports = model( 'Categoria', CategoriaSchema)