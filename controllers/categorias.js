const { response } = require('express');
const { Categoria } = require('../models');

//se me olvido poner try catchs xDXDXD

//obtenerCategorias - paginado -total - populate
const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0}  = req.query;
    const query = {estado:true}

    //hace las dos promesas al mismo tiempo para ahorrar tiempo de ejecucion
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        //hace referencia al nombre del usuario gracias a la consulta de la DB
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    })
}

//obtenerCategoria - populate - objeto de la categoria
const obtenerCategoria = async(req,res = response) => {

    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json({
        categoria
    })

}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if (categoriaDB) {
        return res.status(400).json({
            msg: "La categoria "+ categoriaDB.nombre + " ya existe"
        })
    }

    const data = {
        nombre,
        //gracias al JWT puedo acceder a elementos del usuario que interactua con la DB
        //todo desde el mismo request
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data )

    await categoria.save()

    //poner startus 201 si se crea algo
    res.status(201).json(categoria)

}

//actualizarCategoria 
const actualizarCategoria = async(req,res = response) => {

    const {id} = req.params;

    //desustructurar datos, puedes sacar los que no necesites
    const { nombre } = req.body;

    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id,data)
    
    res.json({
        categoria
    })

}

//borrarCategoria - estado:false
const borrarCategoria = async(req, res = response) =>{
    const {id} = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado : false } )

    res.json(categoriaBorrada)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}