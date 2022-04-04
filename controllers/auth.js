const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

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

module.exports = {login};