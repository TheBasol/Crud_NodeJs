const { response } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const usuariosGet = async(req = request,res = response) => {

    const { limite = 5, desde = 0}  = req.query;
    const query = {estado:true}

    //hace las dos promesas al mismo tiempo para ahorrar tiempo de ejecucion
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req,res = response) => {


    //const { id , nombre } = req.body;
    const { nombre, correo, password, rol } = req.body;

    //crear una instancia para subir los datos
    // subir solo los datos que necesites
    const usuario = new Usuario( {nombre, correo, password, rol} );

    //Encriptar la contraseña
    //darle un valor elevado dentro de la funcion genSaltSync si quieren un encriptado mas robusto
    //por defecto esta en 10
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt )

    //subir la instancia
    await usuario.save()

    res.json({
        usuario
    })
}

const usuariosPut = async(req,res, response) => {

    const {id} = req.params;

    //desustructurar datos, puedes sacar los que no necesites
    const {_id, password, google, correo, ...resto } = req.body;


    //si recibe la contraseña la encripta
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt )
    }

    //actualiza los datos
    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json({
        msg: 'put  Api - Controlador',
        usuario
    })
}

const usuariosDelete = async(req,res, response) => {

    const {id} = req.params;

    // Borrar fisicamnete de la base de datos
    // const usuario = await Usuario.findByIdAndDelete( id );

    //Borrar cambiando el estado a false
    const usuario = await Usuario.findByIdAndUpdate( id, { estado : false } )
    const usuarioAutenticdo = req.usuario;

    res.json({usuario})
}




const usuariosPatch = (req,res, response) => {
    res.json({
        msg: 'patch  Api - Controlador'
    })
}
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}