const { response } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async(req,res = response) => {

    const { limite = 5, desde = 0}  = req.query;
    const query = {estado:true}

    //hace las dos promesas al mismo tiempo para ahorrar tiempo de ejecucion
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        //hace referencia al nombre del usuario gracias a la consulta de la DB
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })

}

const obtenerProducto = async(req,res = response) => {

    const {id} = req.params;

    const producto = await Producto.findById(id)
                    .populate('usuario', 'nombre')
                    .populate('categoria', 'nombre')

    res.json({
        producto
    })
}

const crearProducto = async( req, res = response ) => {

    const {estado, usuario, ...body } = req.body;

    let nombre = body.nombre.toUpperCase();

    try {
        const productoDB =  await Producto.findOne({nombre})

        if (productoDB) {
            return res.status(400).json({
                msg: "El producto "+ productoDB.nombre + " ya existe"
            })
        }
    
        const data = {
            ...body,
            usuario: req.usuario._id
        }
    
        const producto = new Producto( data )
    
        await producto.save()
    
        //poner status 201 si se crea algo
        res.status(201).json(producto)//
    } catch (error) {
        console.log(error)
    }
}


const actualizarProducto = async(req, res = response) => {
    
    const {id} = req.params;

    //desustructurar datos, puedes sacar los que no necesites
    //estado y usuario no viene en el body
    const { estado, usuario, nombre ,...body } = req.body;

    const data = {
        ...body,
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await Producto.findByIdAndUpdate(id,data)
    
    res.json(
        producto
    )
}

const borrarProducto = async(req, res = response) =>{
    const {id} = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado : false } )

    res.json(productoBorrado)
}


module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}