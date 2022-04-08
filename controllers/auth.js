const { response, json } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify')

const login = async(req,res = response) => {

    const {correo, password} = req.body;

    try {
        
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if ( !usuario){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos'
            })
        }

        //verificar si el usuario esta activo
        if ( !usuario.estado){
            return res.status(400).json({
                msg: 'El usuario no esta registrado'
            })
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos'
            })
        }

        //generar json web token
        const token = await generarJWT( usuario.id)

        res.json({
            usuario,
            token
        })


    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Hable con el administrador'
        })
    }


}

const googleSignIn = async(req,res= response) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify(id_token) 

        let usuario = await Usuario.findOne({ correo });

        //si el usuario no existe en la DB
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario( data )
            await usuario.save()
        }

        //si el usuario esta en estado false
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        //generar json web token
        const token = await generarJWT( usuario.id)

        res.json({
            msg: "Todo bien!",
            correo: usuario.correo
        })
    } catch (error) {

        console.log(error)

        return res.status(400).json({
            ok:false,
            msg: 'El token no se pudo verificar'
        })
    }


}

module.exports = {
    login,
    googleSignIn
};