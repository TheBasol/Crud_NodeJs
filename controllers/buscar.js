const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

//las colecciones de la base de datos
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino= '', res = response) =>{

    try {
        const esMongoId = ObjectId.isValid(termino)

        if (esMongoId) {
            const usuario = await Usuario.findById(termino)
            res.json({
                results: (usuario) ? [ usuario ] : []
            })
        }

        const regex = new RegExp(termino, 'i')

        const usuarios = await Usuario.find({
            //esto es propio de mongo
            $or: [{nombre:regex}, {correo:regex}],
            $and: [{estado: true}]
        })

        res.json({
            resutls: usuarios
        })
    } catch (error) {
        console.log(error)
    }

}

const buscarCategorias = async(termino = '', res = response) => {

    try {
        const esMongoId = ObjectId.isValid(termino)

        if (esMongoId) {
            const categoria = await Categoria.findById(termino)
            res.json({
                results: (categoria) ? [ categoria ] : []
            })
        }
    
        const regex = new RegExp(termino, 'i')
    
        const categorias = await Categoria.find({nombre:regex,estado: true})
    
        res.json({
            results: categorias
        })
    } catch (error) {
        console.log(error)
    }

}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino)

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria','nombre')
        res.json({
            results: (producto) ? [ producto ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({nombre:regex,estado: true})

    res.json({
        resutls: productos
    })
}
 
const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: 'Las colecciones permitidas son '+ coleccionesPermitidas
        })
    }

    switch(coleccion){
        case 'usuarios':
            //Cannot set headers after they are sent to the client 
            //sale por pasar el response, pero solo afectaria si quieres moficiar algo de los headers
            //pero es recomendable hacer un return dentro de la funcion para que dentro del 
            //switch se haga la res.json
            buscarUsuarios(termino,res)
        break;
        case 'categorias':
            buscarCategorias(termino,res)
        break;
        case 'productos':
            buscarProductos(termino,res)
        break;

        default:
            res.status(500).json({
                msg: "No existe esta busqueda"
            })
    }
}

module.exports = {
    buscar
}