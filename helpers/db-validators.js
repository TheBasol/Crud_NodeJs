const Role = require('../models/roles');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const { Producto } = require('../models');

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

//categorias
const existeCategoria = async(id) => {

    const busquedaID = await Categoria.findById(id)

    if (!busquedaID) {
        throw new Error("No existe esa categoria en la DB")
    }
}

const existeProducto = async(id) => {

    const busquedaProducto = await Producto.findById(id)

    if (!busquedaProducto) {
        throw new Error("No existe este producto en la DB")
    }
}


module.exports = {
    esRoleValido,
    esEmailValido,
    existeUsuarioID,
    existeCategoria,
    existeProducto
}