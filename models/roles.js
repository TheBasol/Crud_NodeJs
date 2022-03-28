const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        require: [true, 'El rol es obligatorio']
    }
})

//hay que ingresar el nombre del modelo y su valor
module.exports = model( 'Role', RoleSchema)