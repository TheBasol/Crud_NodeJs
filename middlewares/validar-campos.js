const { validationResult } = require('express-validator')

//recibe el request con los check y valida si se cumplen
const validarCampos = ( req, res, next) => {
    //busca los errores en el request
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }

    next();
}

module.exports = {
    validarCampos
}


