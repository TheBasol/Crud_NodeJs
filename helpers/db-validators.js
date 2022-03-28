const Role = require('../models/roles');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if(!existeRol){
        throw new Error('El rol no es correcto')
    }
}

//verificar si el correo existe
const esEmailValido = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error('El correo ya existe')
    }
}

const existeUsuarioID = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error('El id no existe')
    }
}

module.exports = {
    esRoleValido,
    esEmailValido,
    existeUsuarioID
}