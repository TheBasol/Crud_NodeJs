const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});


//eliminar los valores del response, debe ser una funcion normal
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id,...user } = this.toObject();
    user.uid = _id

    return user;
}

//para crear la coleccion se usa model y le das un nombre y el esquema
//mongoose agrega a la colecion una s al final
module.exports = model('Usuario', UsuarioSchema);