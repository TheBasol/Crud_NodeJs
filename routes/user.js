const { Router } =  require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRol,
    tieneRol
} = require('../middlewares')

const { esRoleValido, esEmailValido, existeUsuarioID } = require('../helpers/db-validators');

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/user');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioID),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usuariosPut );

//si se envian 3 elementos el segundo sera el middleware
router.post('/',[
    //middleware, hay que pasar los campos del body de la request
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( esEmailValido ),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    //todos los check viaja en la request y en validarCampos se verifica si hubo un error
    validarCampos
 ] ,usuariosPost );

router.delete('/:id', [
    validarJWT,
    //esAdminRol,
    tieneRol('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioID),
    validarCampos
] ,usuariosDelete );

router.patch('/', usuariosPatch );

module.exports = router;