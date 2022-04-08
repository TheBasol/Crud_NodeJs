const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async(req = request,res = response,next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg:'no hay token en la peticion'
        })
    }

    try {
        //regresa el uid del usuario que coincida
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //leer usuario que corresponde al uid
        const usuario = await Usuario.findById( uid )

        if (!usuario) {
            return res.status(401).json({
                msg:'Token no valido - usuario no existe en DB'
            })
        }

        //verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Token no valido -estado en false'
            })
        }
        
        //agregar el usuario al request
        req.usuario = usuario

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg:'token no valido'
        })
    }

    
}

module.exports = {
    validarJWT
}